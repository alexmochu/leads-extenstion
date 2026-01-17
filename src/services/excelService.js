import * as XLSX from 'xlsx';

/**
 * Service to handle reading from and writing to a local Excel file using the File System Access API.
 */
export const excelService = {
    fileHandle: null,

    /**
     * Prompts the user to select an existing Excel file.
     * @returns {Promise<boolean>} True if file selected successfully.
     */
    connectFile: async () => {
        try {
            const [handle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: 'Excel Spreadsheets',
                        accept: {
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                        },
                    },
                ],
                multiple: false,
            });
            excelService.fileHandle = handle;
            return true;
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error selecting file:', error);
            }
            return false;
        }
    },

    /**
     * Reads the current content of the connected Excel file.
     * @returns {Promise<Array<Object>>} Array of row objects.
     */
    readLeads: async () => {
        if (!excelService.fileHandle) throw new Error('No file connected');

        const file = await excelService.fileHandle.getFile();
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        return XLSX.utils.sheet_to_json(worksheet);
    },

    /**
     * Appends a new lead to the Excel file.
     * @param {Object} leadData - The lead information to add.
     */
    addLead: async (leadData) => {
        if (!excelService.fileHandle) throw new Error('No file connected');

        // reload current data to ensure we don't overwrite fresh edits (basic concurrency handling)
        const currentData = await excelService.readLeads();

        // Sanitize data to prevent CSV injection
        const sanitizedLead = {};
        for (const [key, value] of Object.entries(leadData)) {
            if (typeof value === 'string' && (value.startsWith('=') || value.startsWith('+') || value.startsWith('-') || value.startsWith('@'))) {
                sanitizedLead[key] = `'${value}`; // Escape potential formulas
            } else {
                sanitizedLead[key] = value;
            }
        }

        const newData = [...currentData, sanitizedLead];
        const newWorksheet = XLSX.utils.json_to_sheet(newData);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Leads');

        // Write back to file
        const writable = await excelService.fileHandle.createWritable();
        const buffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
        await writable.write(buffer);
        await writable.close();
    }
};

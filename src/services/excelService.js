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
        if (!window.showOpenFilePicker) {
            throw new Error('File System Access API not supported in this browser.');
        }
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
            // Rethrow specific errors so UI can handle them
            if (error.name === 'AbortError') {
                return false; // User cancelled, no error needed
            }
            throw error;
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
    },

    /**
     * Fallback: Triggers a browser download for the provided leads.
     * @param {Array<Object>} leads - Array of lead objects
     */
    /**
     * Fallback: Triggers a browser download for the provided leads.
     * @param {Array<Object>} leads - Array of lead objects
     * @param {string} format - 'xlsx' or 'csv'
     */
    download: (leads, format = 'xlsx') => {
        const worksheet = XLSX.utils.json_to_sheet(leads);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

        let url;
        let filename;

        if (format === 'csv') {
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            // Create a blob URL for CSV (simpler than base64)
            url = URL.createObjectURL(blob);
            filename = 'kejani_leads.csv';

            // For Blob URLs we can use standard download or chrome.downloads. For consistency let's use chrome.downloads
            // But chrome.downloads expects a URL. Blob URL works.
            chrome.runtime.sendMessage({
                action: 'download',
                url: url,
                filename: filename
            });
            return;
        }

        // Default to XLSX
        // Write to base64 string
        const base64 = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });

        // Use Chrome Downloads API via Background Script
        url = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
        filename = 'kejani_leads.xlsx';

        chrome.runtime.sendMessage({
            action: 'download',
            url: url,
            filename: filename
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                throw new Error(chrome.runtime.lastError.message);
            }
            if (response && !response.success) {
                console.error(response.error);
                throw new Error(response.error);
            }
        });
    },

    /**
     * Attempts to share the leads file using the native OS share dialog.
     * @param {Array<Object>} leads 
     * @returns {Promise<boolean>} True if shared, False if not supported/cancelled.
     */
    share: async (leads) => {
        try {
            const worksheet = XLSX.utils.json_to_sheet(leads);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
            const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

            const file = new File([buffer], 'kejani_leads.xlsx', {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Kejani Leads',
                    text: `Here are ${leads.length} captured leads.`
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Share failed:', error);
            if (error.name === 'AbortError') return true;
            return false;
        }
    },

    /**
     * Helper to get CSV text for clipboard copying.
     */
    getCSV: (leads) => {
        const worksheet = XLSX.utils.json_to_sheet(leads);
        return XLSX.utils.sheet_to_csv(worksheet);
    }
};

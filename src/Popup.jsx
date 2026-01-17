import React, { useState } from 'react';
import { FileSpreadsheet, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { excelService } from './services/excelService';
import { getScrapper } from './scrappers';

const Popup = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isScrapping, setIsScrapping] = useState(false);
    const [status, setStatus] = useState({ type: 'idle', message: '' });
    const [scrappedData, setScrappedData] = useState(null);

    const handleConnect = async () => {
        setStatus({ type: 'loading', message: 'Connecting to Excel file...' });
        try {
            const success = await excelService.connectFile();
            if (success) {
                setIsConnected(true);
                setStatus({ type: 'success', message: 'Excel file connected successfully!' });
            } else {
                setStatus({ type: 'idle', message: '' }); // User cancelled
            }
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: 'Failed to connect file.' });
        }
    };

    const handleScrape = async () => {
        setIsScrapping(true);
        setStatus({ type: 'loading', message: 'Scrapping current page...' });
        setScrappedData(null);

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (!tab) {
                throw new Error('No active tab found');
            }

            const scrapper = getScrapper(tab.url);

            // Execute the scrapper in the context of the page
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: scrapper,
            });

            const data = results[0].result;
            setScrappedData(data);

            if (isConnected) {
                await excelService.addLead(data);
                setStatus({ type: 'success', message: 'Lead scrapped and saved to Excel!' });
            } else {
                setStatus({ type: 'warning', message: 'Lead scrapped but NOT saved (no Excel connected).' });
            }

        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: `Scrapping failed: ${error.message}` });
        } finally {
            setIsScrapping(false);
        }
    };

    return (
        <div className="w-[350px] min-h-[400px] p-4 bg-gray-50 text-gray-800 font-sans">
            <header className="mb-6 flex items-center justify-between border-b pb-4">
                <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                    <FileSpreadsheet className="w-6 h-6" />
                    Kejani Leads
                </h1>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">v1.1</span>
            </header>

            <main className="space-y-6">
                {/* Connection Section */}
                <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="font-semibold text-sm text-gray-600">Storage</h2>
                        {isConnected ? (
                            <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                <CheckCircle className="w-3 h-3" /> Connected
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                                Not Connected
                            </span>
                        )}
                    </div>

                    {!isConnected ? (
                        <button
                            onClick={handleConnect}
                            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors text-sm font-medium"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            Connect Excel Sheet
                        </button>
                    ) : (
                        <div className="text-xs text-gray-500 italic text-center">
                            Ready to save leads to disk.
                        </div>
                    )}
                </section>

                {/* Action Section */}
                <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="font-semibold text-sm text-gray-600 mb-3">Actions</h2>
                    <button
                        onClick={handleScrape}
                        disabled={isScrapping}
                        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded text-white font-medium transition-transform active:scale-95 ${isScrapping ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isScrapping ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Scrapping...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Scrape Current Page
                            </>
                        )}
                    </button>
                </section>

                {/* Status Display */}
                {status.message && (
                    <div className={`p-3 rounded text-sm flex items-start gap-2 ${status.type === 'error' ? 'bg-red-50 text-red-700' :
                        status.type === 'success' ? 'bg-green-50 text-green-700' :
                            status.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                                'bg-blue-50 text-blue-700'
                        }`}>
                        {status.type === 'error' && <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                        {status.type === 'success' && <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                        {status.type === 'loading' && <Loader2 className="w-4 h-4 mt-0.5 animate-spin shrink-0" />}
                        {status.type === 'warning' && <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                        <span>{status.message}</span>
                    </div>
                )}

                {/* Data Preview (Mini) */}
                {scrappedData && (
                    <div className="mt-4 border-t pt-4">
                        <h3 className="text-xs font-semibold text-gray-500 mb-2">Last Scrapped:</h3>
                        <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap">
                            {scrappedData.name} - {scrappedData.platform}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Popup;

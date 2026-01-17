import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, Loader2, CheckCircle, AlertCircle, Save, X } from 'lucide-react';
import { excelService } from './services/excelService';
import { getScrapper } from './scrappers';

const Popup = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isScrapping, setIsScrapping] = useState(false);
    const [status, setStatus] = useState({ type: 'idle', message: '' });
    const [scrappedData, setScrappedData] = useState(null);
    const [isFileSystemSupported, setIsFileSystemSupported] = useState(true);
    const [sessionLeads, setSessionLeads] = useState([]);

    useEffect(() => {
        if (!window.showOpenFilePicker) {
            setIsFileSystemSupported(false);
            // Don't show warning immediately on polished UI, let the mode indicator speak
        }
    }, []);

    const handleConnect = async () => {
        setStatus({ type: 'loading', message: 'Connecting...' });
        try {
            const success = await excelService.connectFile();
            if (success) {
                setIsConnected(true);
                setStatus({ type: 'success', message: 'Connected to Excel File' });
            } else {
                setStatus({ type: 'idle', message: '' });
            }
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: `Error: ${error.message}` });
        }
    };

    const handleScrape = async () => {
        setIsScrapping(true);
        setStatus({ type: 'loading', message: 'Scrapping data...' });
        setScrappedData(null);

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab) throw new Error('No active tab');

            const scrapper = getScrapper(tab.url);

            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: scrapper,
            });

            const data = results[0].result;
            setScrappedData(data);

            if (isFileSystemSupported && isConnected) {
                await excelService.addLead(data);
                setStatus({ type: 'success', message: 'Saved to Excel!' });
            } else {
                setSessionLeads(prev => [...prev, data]);
                setStatus({ type: 'success', message: 'Lead captured!' });
            }

        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: 'Scrapping failed. Try refreshing.' });
        } finally {
            setIsScrapping(false);
        }
    };

    const handleDownload = () => {
        if (sessionLeads.length === 0) return;
        try {
            excelService.download(sessionLeads);
            setStatus({ type: 'success', message: 'Download started...' });
        } catch (error) {
            setStatus({ type: 'error', message: 'Download failed.' });
        }
    };

    return (
        <div className="w-[360px] min-h-[500px] font-sans text-gray-800 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-purple-500 rounded-full blur-[80px] opacity-30 animate-pulse"></div>
            <div className="absolute bottom-[-20px] left-[-20px] w-40 h-40 bg-blue-500 rounded-full blur-[60px] opacity-20"></div>

            <main className="relative z-10 p-6 flex flex-col h-full gap-5">

                {/* Header */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-white/10">
                            <FileSpreadsheet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-tight">Kejani Leads</h1>
                            <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold flex items-center gap-1">
                                {isFileSystemSupported ? 'Auto-Sync' : 'Manual Mode'}
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            </p>
                        </div>
                    </div>
                </header>

                {/* Storage Card */}
                <section className="bg-white/10 backdrop-blur-md border border-white/5 rounded-2xl p-4 shadow-xl transition-all hover:bg-white/15">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-sm font-medium text-purple-200">Storage connection</h2>
                        {isConnected ? (
                            <span className="bg-green-500/20 text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/30 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> ACTIVE
                            </span>
                        ) : (
                            <span className="bg-white/10 text-white/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                DISCONNECTED
                            </span>
                        )}
                    </div>

                    {isFileSystemSupported ? (
                        !isConnected ? (
                            <button
                                onClick={handleConnect}
                                className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 active:scale-[0.98]"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <FileSpreadsheet className="w-4 h-4" />
                                    Link Excel File
                                </span>
                            </button>
                        ) : (
                            <div className="text-xs text-center text-white/60 bg-white/5 py-2 rounded-lg">
                                Leads will be auto-saved to your file.
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between text-xs text-white/70 px-1">
                                <span>Captured Session Leads:</span>
                                <span className="font-bold text-white">{sessionLeads.length}</span>
                            </div>
                            <button
                                onClick={handleDownload}
                                disabled={sessionLeads.length === 0}
                                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all shadow-lg ${sessionLeads.length > 0
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-emerald-500/25 active:scale-[0.98] cursor-pointer'
                                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                                    }`}
                            >
                                <Save className="w-4 h-4" />
                                Download Leads
                            </button>
                        </div>
                    )}
                </section>

                {/* Scrape Action */}
                <button
                    onClick={handleScrape}
                    disabled={isScrapping}
                    className={`w-full relative py-4 px-6 rounded-2xl font-bold text-lg text-white shadow-2xl transition-all border border-white/10 ${isScrapping
                            ? 'bg-indigo-600/50 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/25 active:scale-[0.98]'
                        }`}
                >
                    <div className="flex items-center justify-center gap-3">
                        {isScrapping ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Scrapping...
                            </>
                        ) : (
                            <>
                                <Download className="w-5 h-5" />
                                Scrape Page
                            </>
                        )}
                    </div>
                </button>

                {/* Status Bar */}
                <div className={`mt-auto min-h-[40px] flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-sm border transition-all duration-300 ${status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-200' :
                        status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' :
                            status.type === 'loading' ? 'bg-blue-500/10 border-blue-500/20 text-blue-200' :
                                'bg-white/5 border-white/5 text-white/40' // idle
                    }`}>
                    {status.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />}
                    {status.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />}
                    {status.type === 'loading' && <Loader2 className="w-4 h-4 shrink-0 animate-spin text-blue-400" />}
                    <span className="text-xs font-medium truncate">
                        {status.message || "Ready to scrape"}
                    </span>
                </div>

                {/* Last Scrapped Preview */}
                {scrappedData && (
                    <div className="absolute top-[80px] left-0 w-full px-6 pointer-events-none">
                        <div className="animate-[fade-in-up_0.5s_ease-out] bg-gray-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-start gap-4 pointer-events-auto">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                {scrappedData.name ? scrappedData.name[0] : '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold text-sm truncate">{scrappedData.name || 'Unknown'}</h4>
                                <p className="text-xs text-gray-400 truncate">{scrappedData.title || scrappedData.handle || 'No Title'}</p>
                                <div className="mt-2 flex gap-2">
                                    <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded text-xs uppercase tracking-wide">
                                        {scrappedData.platform}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setScrappedData(null)} className="text-white/20 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Popup;

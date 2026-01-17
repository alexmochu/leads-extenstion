import React, { useState, useEffect } from 'react';
import {
    FileSpreadsheet, Download, Loader2, CheckCircle, AlertCircle, Save, X,
    Share2, ClipboardCopy, Mail, MessageCircle, Send, Twitter
} from 'lucide-react';
import { excelService } from './services/excelService';
import { getScrapper } from './scrappers';

const Popup = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isScrapping, setIsScrapping] = useState(false);
    const [status, setStatus] = useState({ type: 'idle', message: '' });
    const [scrappedData, setScrappedData] = useState(null);
    const [isFileSystemSupported, setIsFileSystemSupported] = useState(true);
    const [sessionLeads, setSessionLeads] = useState([]);

    // Options
    const [exportFormat, setExportFormat] = useState('xlsx'); // 'xlsx' | 'csv'
    const [showShareMenu, setShowShareMenu] = useState(false);

    useEffect(() => {
        if (!window.showOpenFilePicker) {
            setIsFileSystemSupported(false);
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
        setShowShareMenu(false);

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
            excelService.download(sessionLeads, exportFormat);
            setStatus({ type: 'success', message: `Downloaded as ${exportFormat.toUpperCase()}!` });
        } catch (error) {
            setStatus({ type: 'error', message: 'Download failed.' });
        }
    };

    const handleNativeShare = async () => {
        if (sessionLeads.length === 0) return;
        setStatus({ type: 'loading', message: 'Sharing...' });
        try {
            const shared = await excelService.share(sessionLeads);
            if (shared) {
                setStatus({ type: 'success', message: 'Shared successfully!' });
            } else {
                // Native share failed/unsupported -> Open fallback menu
                setShowShareMenu(true);
                setStatus({ type: 'warning', message: 'Choose a sharing option below' });
            }
        } catch (error) {
            console.error(error);
            setShowShareMenu(true); // Fallback
        }
    };

    const handleSocialShare = (platform) => {
        const csv = excelService.getCSV(sessionLeads);
        const encodedData = encodeURIComponent(csv);
        // Truncate if too long for URL parameters (safe limit ~2000 chars roughly, but apps vary)
        const safeData = encodedData.length > 1500 ? encodeURIComponent(csv.substring(0, 1000) + '... (truncated)') : encodedData;
        const text = `Here are the captured leads:%0A${safeData}`;

        let url = '';
        switch (platform) {
            case 'email':
                url = `mailto:?subject=Kejani Leads&body=${text}`;
                break;
            case 'whatsapp':
                url = `https://wa.me/?text=${text}`;
                break;
            case 'telegram':
                url = `https://t.me/share/url?url=&text=${text}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${text}`;
                break;
            case 'copy':
                navigator.clipboard.writeText(csv)
                    .then(() => setStatus({ type: 'success', message: 'Copied to clipboard!' }))
                    .catch(err => setStatus({ type: 'error', message: 'Copy failed' }));
                return; // No window open
        }

        if (url) {
            window.open(url, '_blank');
        }
    };

    return (
        <div className="w-[360px] min-h-[550px] font-sans text-gray-800 bg-gray-900 relative overflow-hidden flex flex-col">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 z-0"></div>
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-purple-500 rounded-full blur-[80px] opacity-20 animate-pulse z-0"></div>

            <main className="relative z-10 p-6 flex flex-col h-full gap-5 flex-1">

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

                {/* Storage / Format Section */}
                <section className="bg-white/10 backdrop-blur-md border border-white/5 rounded-2xl p-4 shadow-xl transition-all hover:bg-white/15">

                    {isFileSystemSupported && !isConnected ? (
                        <>
                            <div className="mb-4 flex justify-between items-center text-sm font-medium text-purple-200">
                                <h2>Connect Storage</h2>
                                <span className="bg-white/10 text-white/40 text-[10px] px-2 py-0.5 rounded-full">OFFLINE</span>
                            </div>
                            <button onClick={handleConnect} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                <FileSpreadsheet className="w-4 h-4" /> Link Excel File
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {/* Stats */}
                            <div className="flex justify-between items-center text-xs text-white/70 px-1">
                                <span>Session Leads: <span className="text-white font-bold text-sm ml-1">{sessionLeads.length}</span></span>
                                {isConnected && <span className="text-green-400 font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Auto-Saving</span>}
                            </div>

                            {/* Format Toggle (Only useful for manual download/share) */}
                            {!isConnected && (
                                <div className="flex bg-black/20 p-1 rounded-lg">
                                    <button
                                        onClick={() => setExportFormat('xlsx')}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${exportFormat === 'xlsx' ? 'bg-white/20 text-white shadow-sm' : 'text-white/40 hover:text-white'}`}
                                    >
                                        Excel (.xlsx)
                                    </button>
                                    <button
                                        onClick={() => setExportFormat('csv')}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${exportFormat === 'csv' ? 'bg-white/20 text-white shadow-sm' : 'text-white/40 hover:text-white'}`}
                                    >
                                        CSV
                                    </button>
                                </div>
                            )}

                            {/* Actions (Only for Manual Mode) */}
                            {!isConnected && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDownload}
                                        disabled={sessionLeads.length === 0}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all shadow-lg text-sm ${sessionLeads.length > 0 ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-white/5 text-white/20 cursor-not-allowed'
                                            }`}
                                    >
                                        <Save className="w-4 h-4" /> Save
                                    </button>
                                    <button
                                        onClick={handleNativeShare}
                                        disabled={sessionLeads.length === 0}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all shadow-lg border border-white/10 text-sm ${sessionLeads.length > 0 ? 'bg-blue-600/80 text-white hover:bg-blue-500' : 'bg-white/5 text-white/20 cursor-not-allowed'
                                            }`}
                                    >
                                        <Share2 className="w-4 h-4" /> Share
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Scrape Button */}
                <button
                    onClick={handleScrape}
                    disabled={isScrapping}
                    className={`w-full relative py-4 px-6 rounded-2xl font-bold text-lg text-white shadow-2xl transition-all border border-white/10 ${isScrapping ? 'bg-indigo-600/50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 active:scale-[0.98]'
                        }`}
                >
                    <div className="flex items-center justify-center gap-3">
                        {isScrapping ? <><Loader2 className="w-5 h-5 animate-spin" /> Scrapping...</> : <><Download className="w-5 h-5" /> Scrape Page</>}
                    </div>
                </button>

                {/* Social Share Menu (Expanded) */}
                {showShareMenu && (
                    <div className="animate-[fade-in-up_0.3s_ease-out] bg-white/10 backdrop-blur-md border border-white/5 rounded-2xl p-4 shadow-xl">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">Share via App</h3>
                            <button onClick={() => setShowShareMenu(false)} className="text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            <button onClick={() => handleSocialShare('email')} className="flex flex-col items-center gap-1 group">
                                <div className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10">
                                    <Mail className="w-4 h-4 text-orange-300" />
                                </div>
                                <span className="text-[9px] text-white/60 group-hover:text-white">Email</span>
                            </button>
                            <button onClick={() => handleSocialShare('whatsapp')} className="flex flex-col items-center gap-1 group">
                                <div className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10">
                                    <MessageCircle className="w-4 h-4 text-green-400" />
                                </div>
                                <span className="text-[9px] text-white/60 group-hover:text-white">WhatsApp</span>
                            </button>
                            <button onClick={() => handleSocialShare('telegram')} className="flex flex-col items-center gap-1 group">
                                <div className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10">
                                    <Send className="w-4 h-4 text-blue-400" />
                                </div>
                                <span className="text-[9px] text-white/60 group-hover:text-white">Telegram</span>
                            </button>
                            <button onClick={() => handleSocialShare('twitter')} className="flex flex-col items-center gap-1 group">
                                <div className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10">
                                    <Twitter className="w-4 h-4 text-sky-400" />
                                </div>
                                <span className="text-[9px] text-white/60 group-hover:text-white">X</span>
                            </button>
                            <button onClick={() => handleSocialShare('copy')} className="flex flex-col items-center gap-1 group">
                                <div className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10">
                                    <ClipboardCopy className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-[9px] text-white/60 group-hover:text-white">Copy</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Status Bar */}
                <div className={`mt-auto min-h-[40px] flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-sm border transition-all ${status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-200' :
                        status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' :
                            status.type === 'loading' ? 'bg-blue-500/10 border-blue-500/20 text-blue-200' :
                                status.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' :
                                    'bg-white/5 border-white/5 text-white/40' // idle
                    }`}>
                    {status.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />}
                    {status.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />}
                    {status.type === 'warning' && <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />}
                    {status.type === 'loading' && <Loader2 className="w-4 h-4 shrink-0 animate-spin text-blue-400" />}
                    <span className="text-xs font-medium truncate flex-1">{status.message || "Ready"}</span>
                </div>

                {/* Scrapped Data Preview */}
                {scrappedData && !showShareMenu && (
                    <div className="absolute top-[80px] left-0 w-full px-6 pointer-events-none z-20">
                        <div className="animate-[fade-in-up_0.5s_ease-out] bg-gray-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-start gap-4 pointer-events-auto">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                {scrappedData.name ? scrappedData.name[0] : '?'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold text-sm truncate">{scrappedData.name || 'Unknown'}</h4>
                                <p className="text-xs text-gray-400 truncate">{scrappedData.title || 'No Title'}</p>
                            </div>
                            <button onClick={() => setScrappedData(null)} className="text-white/20 hover:text-white"><X className="w-4 h-4" /></button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Popup;

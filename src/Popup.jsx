import React, { useState, useEffect } from 'react';
import {
    FileSpreadsheet, Download, Loader2, CheckCircle, AlertCircle, Save, X,
    Share2, ClipboardCopy, Mail, MessageCircle, Send, Twitter,
    Copy, Tags, Users, Repeat, Trash2, List, ChevronDown, ChevronUp
} from 'lucide-react';
import { excelService } from './services/excelService';
import { getScrapper } from './scrappers';
import { generateTags, generateIcebreaker, checkDuplicate } from './utils/salesIntelligence';

const Popup = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isScrapping, setIsScrapping] = useState(false);
    const [status, setStatus] = useState({ type: 'idle', message: '' });
    const [scrappedData, setScrappedData] = useState(null);
    const [isFileSystemSupported, setIsFileSystemSupported] = useState(true);
    const [sessionLeads, setSessionLeads] = useState([]);

    // Sales Intelligence State
    const [campaignName, setCampaignName] = useState('General Outreach');
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [generatedIcebreaker, setGeneratedIcebreaker] = useState('');

    // Options
    const [exportFormat, setExportFormat] = useState('xlsx'); // 'xlsx' | 'csv'
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [showLeadsList, setShowLeadsList] = useState(false);

    // 1. Load Session from Storage on Mount
    useEffect(() => {
        if (!window.showOpenFilePicker) setIsFileSystemSupported(false);

        // Load persisted state
        chrome.storage.local.get(['sessionLeads', 'campaignName', 'exportFormat'], (result) => {
            if (result.sessionLeads) setSessionLeads(result.sessionLeads);
            if (result.campaignName) setCampaignName(result.campaignName);
            if (result.exportFormat) setExportFormat(result.exportFormat);
        });
    }, []);

    // 2. Auto-Save Session to Storage
    useEffect(() => {
        chrome.storage.local.set({
            sessionLeads,
            campaignName,
            exportFormat
        });
    }, [sessionLeads, campaignName, exportFormat]);

    const handleResetSession = () => {
        if (confirm("Are you sure you want to clear all leads in this session? This cannot be undone.")) {
            setSessionLeads([]);
            setScrappedData(null);
            setGeneratedIcebreaker('');
            setIsDuplicate(false);
            setStatus({ type: 'success', message: 'Session cleared.' });
            // Storage will auto-update via useEffect
        }
    };

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
        setStatus({ type: 'loading', message: 'Scrapping & Analyzing...' });
        setScrappedData(null);
        setIsDuplicate(false);
        setGeneratedIcebreaker('');
        setShowShareMenu(false);

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab) throw new Error('No active tab');

            const scrapper = getScrapper(tab.url);

            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: scrapper,
            });

            // Base Data
            let data = results[0].result;

            // 1. Smart Tagging
            data.tags = generateTags(data);
            data.campaign = campaignName;

            // 2. Icebreaker
            const icebreaker = generateIcebreaker(data);
            setGeneratedIcebreaker(icebreaker);

            // 3. Duplicate Detection
            let existingData = [];
            if (isFileSystemSupported && isConnected) {
                // If connected to file, we should theoretically read it to check duplicates.
                // NOTE: Reading large files every time might be slow.
                // For now, we assume user just connected or we read minimally.
                try {
                    existingData = await excelService.readLeads();
                } catch (e) { console.warn("Could not read for dedup", e); }
            } else {
                existingData = sessionLeads;
            }

            const isDup = checkDuplicate(data, existingData);
            setIsDuplicate(isDup);
            setScrappedData(data); // Show preview regardless

            if (isDup) {
                setStatus({ type: 'warning', message: 'Duplicate Lead Detected!' });
                // We DO NOT auto-save if duplicate
            } else {
                if (isFileSystemSupported && isConnected) {
                    await excelService.addLead(data);
                    setStatus({ type: 'success', message: 'Saved to Excel!' });
                } else {
                    setSessionLeads(prev => [...prev, data]);
                    setStatus({ type: 'success', message: 'Lead captured!' });
                }
            }

        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: 'Scrapping failed. Try refreshing.' });
        } finally {
            setIsScrapping(false);
        }
    };

    const handleCopyIcebreaker = () => {
        if (!generatedIcebreaker) return;
        navigator.clipboard.writeText(generatedIcebreaker);
        setStatus({ type: 'success', message: 'Icebreaker copied!' });
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
        <div className="w-full h-screen font-sans text-gray-800 bg-gray-900 relative overflow-hidden flex flex-col">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 z-0"></div>
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-purple-500 rounded-full blur-[80px] opacity-20 animate-pulse z-0"></div>

            <main className="relative z-10 p-4 sm:p-6 flex flex-col h-full gap-4 sm:gap-5 overflow-y-auto">

                {/* Header - Sticky */}
                <header className="flex-shrink-0 flex flex-col gap-3 sm:gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-white/10">
                                <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">Kejani Leads</h1>
                                <p className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-widest font-semibold flex items-center gap-1">
                                    {isFileSystemSupported ? 'Auto-Sync' : 'Manual Mode'}
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Campaign Input */}
                    <div className="relative group">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            value={campaignName}
                            onChange={(e) => setCampaignName(e.target.value)}
                            placeholder="Campaign Name (e.g. Q1 Sales)"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-xs sm:text-sm text-white placeholder:text-white/20 focus:outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all font-medium"
                        />
                    </div>
                </header>

                {/* Storage / Format Section */}
                <section className="flex-shrink-0 bg-white/10 backdrop-blur-md border border-white/5 rounded-2xl p-3 sm:p-4 shadow-xl transition-all hover:bg-white/15">

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
                            {/* Stats & Reset */}
                            <div className="flex justify-between items-center text-xs text-white/70 px-1">
                                <div className="flex items-center gap-2">
                                    <span>Session Leads: <span className="text-white font-bold text-sm ml-1">{sessionLeads.length}</span></span>
                                    {sessionLeads.length > 0 && (
                                        <>
                                            <button
                                                onClick={() => setShowLeadsList(!showLeadsList)}
                                                className="text-blue-400 hover:text-blue-300 transition-colors p-1 hover:bg-white/5 rounded flex items-center gap-1"
                                                title="View Leads List"
                                            >
                                                <List className="w-3 h-3" />
                                                {showLeadsList ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                                            </button>
                                            <button
                                                onClick={handleResetSession}
                                                className="text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-white/5 rounded"
                                                title="Clear Session"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </>
                                    )}
                                </div>
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

                {/* Leads List View - Scrollable */}
                {showLeadsList && sessionLeads.length > 0 && (
                    <section className="flex-1 bg-white/10 backdrop-blur-md border border-white/5 rounded-2xl p-3 sm:p-4 shadow-xl overflow-y-auto min-h-0">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xs font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
                                <List className="w-4 h-4" /> Collected Leads ({sessionLeads.length})
                            </h3>
                            <button onClick={() => setShowLeadsList(false)} className="text-white/40 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-2">
                            {sessionLeads.map((lead, index) => (
                                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                            {lead.name ? lead.name[0] : '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-white font-semibold text-sm truncate">{lead.name || 'Unknown'}</h4>
                                            <p className="text-xs text-gray-400 truncate">{lead.title || 'No Title'}</p>
                                            {lead.company && <p className="text-xs text-gray-500 truncate">{lead.company}</p>}
                                            {lead.tags && (
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                    {lead.tags.split(', ').slice(0, 3).map(tag => (
                                                        <span key={tag} className="text-[9px] bg-indigo-500/20 text-indigo-200 px-1.5 py-0.5 rounded border border-indigo-500/30">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Scrape Button - Sticky at bottom */}
                <button
                    onClick={handleScrape}
                    disabled={isScrapping}
                    className={`flex-shrink-0 w-full relative py-3 sm:py-4 px-4 sm:px-6 rounded-2xl font-bold text-base sm:text-lg text-white shadow-2xl transition-all border border-white/10 ${isScrapping ? 'bg-indigo-600/50 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 active:scale-[0.98]'
                        }`}
                >
                    <div className="flex items-center justify-center gap-3">
                        {isScrapping ? <><Loader2 className="w-5 h-5 animate-spin" /> Scrapping...</> : <><Download className="w-5 h-5" /> Scrape Page</>}
                    </div>
                </button>

                {/* Social Share Menu (Expanded) */}
                {showShareMenu && (
                    <div className="flex-shrink-0 animate-[fade-in-up_0.3s_ease-out] bg-white/10 backdrop-blur-md border border-white/5 rounded-2xl p-3 sm:p-4 shadow-xl">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-[10px] sm:text-xs font-bold text-white/60 uppercase tracking-wider">Share via App</h3>
                            <button onClick={() => setShowShareMenu(false)} className="text-white/40 hover:text-white"><X className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></button>
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

                {/* Status Bar - Sticky at bottom */}
                <div className={`flex-shrink-0 min-h-[36px] sm:min-h-[40px] flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl backdrop-blur-sm border transition-all ${status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-200' :
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
                    <div className="absolute top-[135px] left-0 w-full px-6 pointer-events-none z-20">
                        <div className={`animate-[fade-in-up_0.5s_ease-out] backdrop-blur-xl border p-4 rounded-2xl shadow-2xl pointer-events-auto transition-colors ${isDuplicate
                            ? 'bg-red-950/90 border-red-500/30 shadow-red-900/20'
                            : 'bg-gray-900/90 border-white/10'
                            }`}>
                            {/* Duplicate Warning */}
                            {isDuplicate && (
                                <div className="flex items-center gap-2 text-red-300 text-xs font-bold uppercase tracking-wider mb-2 bg-red-500/10 py-1 px-2 rounded-lg w-fit">
                                    <Repeat className="w-3 h-3" /> Duplicate Lead Detected
                                </div>
                            )}

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                    {scrappedData.name ? scrappedData.name[0] : '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-bold text-sm truncate">{scrappedData.name || 'Unknown'}</h4>
                                    <p className="text-xs text-gray-400 truncate">{scrappedData.title || 'No Title'}</p>

                                    {/* Smart Tags */}
                                    {scrappedData.tags && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {scrappedData.tags.split(', ').map(tag => (
                                                <span key={tag} className="flex items-center gap-1 text-[10px] bg-indigo-500/20 text-indigo-200 px-1.5 py-0.5 rounded border border-indigo-500/30 font-medium">
                                                    <Tags className="w-2.5 h-2.5" /> {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => setScrappedData(null)} className="text-white/20 hover:text-white"><X className="w-4 h-4" /></button>
                            </div>

                            {/* Icebreaker Action */}
                            <div className="mt-3 pt-3 border-t border-white/5">
                                <p className="text-[10px] text-white/40 mb-1">Icebreaker (Ready to Send):</p>
                                <button
                                    onClick={handleCopyIcebreaker}
                                    className="w-full text-left text-xs text-white/80 italic bg-black/20 hover:bg-black/40 p-2 rounded-lg transition-colors border border-dashed border-white/10 hover:border-white/30 group flex justify-between items-center"
                                >
                                    <span className="line-clamp-2">{generatedIcebreaker}</span>
                                    <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-white/60" />
                                </button>
                            </div>

                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Popup;

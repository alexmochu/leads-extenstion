// Background Service Worker
// Handles downloads to prevent popup closure from interrupting the process.

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ windowId: tab.windowId });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'download') {
        const { url, filename } = message;

        chrome.downloads.download({
            url: url,
            filename: filename,
            saveAs: true // We can keep this true if we want, or false to be safer against focus loss.
            // But since this is in background, focus loss of popup doesn't kill the download!
        }, (downloadId) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                sendResponse({ success: false, error: chrome.runtime.lastError.message });
            } else {
                sendResponse({ success: true, downloadId });
            }
        });

        return true; // Keep message channel open for async response
    }
});

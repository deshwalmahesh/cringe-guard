// Background script for handling tab creation and other background tasks
console.log("[Background] Service worker started");

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "createBackgroundTab") {
        console.log(`[Background] Creating background tab for: ${request.url}`);
        
        // Create tab in background and immediately restore focus
        chrome.tabs.create({
            url: request.url,
            active: false,
            openerTabId: sender.tab?.id
        }).then(async (tab) => {
            console.log(`[Background] Background tab created: ${tab.id}`);
            
            // Restore focus to original tab
            if (sender.tab?.id) {
                await chrome.tabs.update(sender.tab.id, { active: true });
            }
            
            sendResponse({ success: true, tabId: tab.id });
        }).catch(error => {
            console.error(`[Background] Failed to create background tab:`, error);
            sendResponse({ success: false, error: error.message });
        });
        
        return true; // Keep message channel open for async response
    }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
    console.log("[Background] Extension installed/updated");
});

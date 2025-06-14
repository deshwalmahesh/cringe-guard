// Simple bulk unfollow for LinkedIn profiles - Content Script Coordinator
// This file coordinates the bulk unfollow functionality by importing utility functions

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startBulkUnfollow") {
        console.log('[BULK_UNFOLLOW] Received startBulkUnfollow message');
        try {
            unfollowProfile()
                .then(result => sendResponse(result || { success: true }))
                .catch(error => sendResponse({ success: false, error: error.message }));
        } catch (error) {
            console.error('[BULK_UNFOLLOW] unfollowProfile not available:', error);
            sendResponse({ success: false, error: 'unfollowProfile function not available' });
        }
        return true;
    }
});

// Auto-start if profile page loads
if (window.location.href.includes('linkedin.com/in/')) {
    console.log('[BULK_UNFOLLOW] LinkedIn profile detected');
    setTimeout(() => {
        try {
            debugPageStructure();
        } catch (error) {
            console.log('[BULK_UNFOLLOW] debugPageStructure not available');
        }
    }, 2000);
}

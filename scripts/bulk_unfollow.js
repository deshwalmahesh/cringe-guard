// Simple bulk unfollow for LinkedIn profiles - Content Script Coordinator
// This file coordinates the bulk unfollow functionality by importing utility functions

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "startBulkUnfollow") {
        unfollowProfile()
            .then(result => sendResponse(result || { success: true }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
});

// Auto-start if profile page loads
if (isLinkedInProfile()) {
    console.log('LinkedIn profile detected');
    // Auto-debug on page load
    setTimeout(() => {
        debugPageStructure();
    }, 2000);
}

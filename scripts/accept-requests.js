// Accept requests functionality for LinkedIn
class AcceptRequestsHandler {
    constructor() {
        this.processed = 0;
        this.errors = [];
        console.log("[AcceptRequestsHandler] Initialized");
    }

    // Check if we're on the invitation manager page
    isInvitationManagerPage() {
        const isCorrectPage = window.location.href.includes('linkedin.com/mynetwork/invitation-manager');
        console.log(`[AcceptRequestsHandler] Checking page URL: ${window.location.href}, isCorrectPage: ${isCorrectPage}`);
        return isCorrectPage;
    }

    // Find all pending invitation cards with Accept buttons
    findPendingInvitations() {
        console.log("[AcceptRequestsHandler] Looking for pending invitations...");
        
        const invitationCards = document.querySelectorAll('li[data-view-name="pending-invitation"]');
        console.log(`[AcceptRequestsHandler] Found ${invitationCards.length} invitation cards with data-view-name="pending-invitation"`);
        
        const validCards = [];

        for (let i = 0; i < invitationCards.length; i++) {
            const card = invitationCards[i];
            console.log(`[AcceptRequestsHandler] Checking card ${i + 1}:`, card);
            
            const acceptButton = card.querySelector('button[aria-label*="Accept"]');
            console.log(`[AcceptRequestsHandler] Accept button found:`, acceptButton);
            
            if (acceptButton) {
                const isVisible = isElementVisible(acceptButton);
                console.log(`[AcceptRequestsHandler] Accept button visible: ${isVisible}`);
                
                if (isVisible) {
                    validCards.push({ card, acceptButton });
                    console.log(`[AcceptRequestsHandler] Added valid card ${i + 1}`);
                }
            }
        }

        console.log(`[AcceptRequestsHandler] Found ${validCards.length} valid invitation cards with visible Accept buttons`);
        return validCards;
    }

    // Extract profile URL from invitation card
    getProfileUrl(card) {
        const profileLink = card.querySelector('a[href*="/in/"]');
        const url = profileLink ? profileLink.href : null;
        console.log(`[AcceptRequestsHandler] Profile URL extracted: ${url}`);
        return url;
    }

    // Accept a single request and open profile in background tab
    async acceptRequest(cardData, index) {
        try {
            const { card, acceptButton } = cardData;
            const profileUrl = this.getProfileUrl(card);

            console.log(`[AcceptRequestsHandler] Processing request ${index + 1}: ${profileUrl}`);

            // Click accept button
            console.log(`[AcceptRequestsHandler] Clicking accept button for request ${index + 1}`);
            acceptButton.click();
            
            // Wait for the accept action to process
            console.log(`[AcceptRequestsHandler] Waiting for accept action to process...`);
            await randomDelay(500, 1000);

            // Send message to popup to open profile in background tab
            if (profileUrl) {
                console.log(`[AcceptRequestsHandler] Requesting background tab for: ${profileUrl}`);
                chrome.runtime.sendMessage({
                    action: "createBackgroundTab",
                    url: profileUrl
                });
            } else {
                console.warn(`[AcceptRequestsHandler] No profile URL found for request ${index + 1}`);
            }

            this.processed++;
            console.log(`[AcceptRequestsHandler] Successfully processed request ${index + 1}. Total processed: ${this.processed}`);
            
            // Random delay before next action
            const delay = Math.floor(Math.random() * 1000) + 1000; // 1-2 seconds
            console.log(`[AcceptRequestsHandler] Waiting ${delay}ms before next request...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            
            return { success: true, profileUrl };
        } catch (error) {
            console.error(`[AcceptRequestsHandler] Error accepting request ${index + 1}:`, error);
            this.errors.push(error.message);
            return { success: false, error: error.message };
        }
    }

    // Main function to accept multiple requests
    async acceptMultipleRequests(count = 10) {
        console.log(`[AcceptRequestsHandler] Starting acceptMultipleRequests with count: ${count}`);
        
        if (!this.isInvitationManagerPage()) {
            const error = 'Not on invitation manager page';
            console.error(`[AcceptRequestsHandler] ${error}`);
            throw new Error(error);
        }

        // Wait for page to fully load
        console.log("[AcceptRequestsHandler] Waiting for page to fully load...");
        await new Promise(resolve => setTimeout(resolve, 1000));

        const pendingInvitations = this.findPendingInvitations();
        
        if (pendingInvitations.length === 0) {
            const message = 'No pending invitations found';
            console.log(`[AcceptRequestsHandler] ${message}`);
            return {
                success: true,
                processed: 0,
                message: message
            };
        }

        const toProcess = Math.min(count, pendingInvitations.length);
        console.log(`[AcceptRequestsHandler] Found ${pendingInvitations.length} pending invitations, processing ${toProcess}`);

        // Process requests sequentially to avoid rate limiting
        for (let i = 0; i < toProcess; i++) {
            try {
                console.log(`[AcceptRequestsHandler] Starting to process request ${i + 1}/${toProcess}`);
                await this.acceptRequest(pendingInvitations[i], i);
            } catch (error) {
                console.error(`[AcceptRequestsHandler] Failed to process request ${i + 1}:`, error);
                this.errors.push(`Request ${i + 1}: ${error.message}`);
            }
        }

        const result = {
            success: true,
            processed: this.processed,
            errors: this.errors,
            total: pendingInvitations.length
        };
        
        console.log("[AcceptRequestsHandler] Final result:", result);
        return result;
    }
}

// Message listener for Chrome extension communication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("[AcceptRequestsHandler] Received message:", request);
    
    if (request.action === "acceptRequests") {
        console.log(`[AcceptRequestsHandler] Starting accept requests process with count: ${request.count}`);
        
        const handler = new AcceptRequestsHandler();
        
        handler.acceptMultipleRequests(request.count)
            .then(result => {
                console.log('[AcceptRequestsHandler] Accept requests completed successfully:', result);
                sendResponse(result);
            })
            .catch(error => {
                console.error('[AcceptRequestsHandler] Accept requests failed:', error);
                sendResponse({
                    success: false,
                    error: error.message,
                    processed: handler.processed
                });
            });
        
        return true; // Keep message channel open for async response
    }
});

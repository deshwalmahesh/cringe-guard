document.addEventListener("DOMContentLoaded", function () {
    // check the stored API key when popup opens
    chrome.storage.sync.get("groqApiKey", function (data) {
        const errorCard = document.querySelector(".error-card");

        if (data.groqApiKey) {
            errorCard.style.display = "none";
        }
    });

    // toggle switch for cringe guard
    const toggleSwitch = document.getElementById("toggle-switch");

    // Load initial state from Chrome storage
    chrome.storage.sync.get("isEnabled", function (data) {
        toggleSwitch.checked = data.isEnabled ?? false; // Default to false
    });

    // Listen for toggle changes
    toggleSwitch.addEventListener("change", function () {
        chrome.storage.sync.set({ isEnabled: toggleSwitch.checked });
    });

    chrome.storage.sync.get(["cringeCount", "timeSavedInMinutes"], function (data) {
        document.getElementById("cringe-count").innerText = data.cringeCount || 0;
        document.getElementById("time-saved").innerText = Math.ceil(data.timeSavedInMinutes || 0) + "m";
    });

    // Check for AI job posts and update UI
    updateAIJobPostsSection();

    // Add event listener for download button
    const downloadButton = document.getElementById("download-jobs");
    downloadButton.addEventListener("click", downloadAIJobPosts);

    // Add event listener for accept requests button
    const acceptRequestsButton = document.getElementById("accept-requests-btn");
    acceptRequestsButton.addEventListener("click", handleAcceptRequests);

    // Add event listener for bulk unfollow button
    const bulkUnfollowButton = document.getElementById("bulk-unfollow-btn");
    bulkUnfollowButton.addEventListener("click", handleBulkUnfollow);

    // Update bulk unfollow status
    updateBulkUnfollowStatus();

    // take user to the settings page
    const settingsButton = document.querySelector('.settings-icon');
    settingsButton.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });
});

// Function to update the AI job posts section
function updateAIJobPostsSection() {
    chrome.storage.local.get(['aiJobPosts'], function(data) {
        const jobPosts = data.aiJobPosts || [];
        const jobPostsSection = document.querySelector('.ai-jobs-section');
        const jobCountElement = document.querySelector('.job-count');
        
        if (jobPosts.length > 0) {
            jobPostsSection.style.display = 'block';
            jobCountElement.textContent = jobPosts.length;
        } else {
            jobPostsSection.style.display = 'none';
        }
    });
}

// Function to download AI job posts as JSON
function downloadAIJobPosts() {
    chrome.storage.local.get(['aiJobPosts'], function(data) {
        const jobPosts = data.aiJobPosts || [];
        
        if (jobPosts.length === 0) {
            return;
        }
        
        // Format the date for the filename
        const today = new Date();
        const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        // Create the export data with date
        const exportData = {
            date: today.toISOString(),
            posts: jobPosts
        };
        
        // Convert to JSON string
        const jsonString = JSON.stringify(exportData, null, 2);
        
        // Create a blob and download link
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Create a temporary download link
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `ai_jobs_${dateString}.json`;
        
        // Trigger download and cleanup
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
        
        // Clear the stored job posts after download
        chrome.storage.local.set({ aiJobPosts: [] });
        
        // Update the UI to reflect the empty job posts
        updateAIJobPostsSection();
    });
}

// Function to handle accept requests action
async function handleAcceptRequests() {
    const button = document.getElementById("accept-requests-btn");
    const statusSpan = document.getElementById("accept-status");
    const countInput = document.getElementById("accept-count");
    
    const count = parseInt(countInput.value) || 10;
    
    console.log(`[Accept Requests] Starting with count: ${count}`);
    
    try {
        button.textContent = "Navigating...";
        button.disabled = true;
        statusSpan.textContent = "Navigating";
        statusSpan.style.background = "#ffc107";
        
        // Get current active tab
        const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        console.log(`[Accept Requests] Current tab: ${currentTab.url}`);
        
        // Navigate to the invitations manager page in the current tab
        await chrome.tabs.update(currentTab.id, {
            url: "https://www.linkedin.com/mynetwork/invitation-manager/"
        });
        
        console.log("[Accept Requests] Navigation initiated");
        statusSpan.textContent = "Loading page";
        
        // Wait for the tab to load
        await new Promise((resolve) => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                if (tabId === currentTab.id && info.status === 'complete') {
                    console.log("[Accept Requests] Page loaded completely");
                    chrome.tabs.onUpdated.removeListener(listener);
                    resolve();
                }
            });
        });
        
        // Additional delay to ensure page is fully loaded and rendered
        console.log("[Accept Requests] Waiting for page to fully render...");
        await new Promise(r => setTimeout(r, 3000));
        
        statusSpan.textContent = "Processing";
        console.log("[Accept Requests] Injecting scripts and starting processing");
        
        // Inject and execute the accept requests script
        await chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            files: ['scripts/linkedin-utils.js', 'scripts/accept-requests.js']
        });
        
        console.log("[Accept Requests] Scripts injected, sending message");
        
        const result = await chrome.tabs.sendMessage(currentTab.id, { 
            action: "acceptRequests", 
            count: count 
        });
        
        console.log("[Accept Requests] Result received:", result);
        
        if (result.success) {
            statusSpan.textContent = `Processed ${result.processed}`;
            statusSpan.style.background = "#28a745";
            console.log(`[Accept Requests] Successfully processed ${result.processed} requests`);
        } else {
            statusSpan.textContent = "Error occurred";
            statusSpan.style.background = "#dc3545";
            console.error("[Accept Requests] Error in processing:", result.error);
        }
        
        setTimeout(() => {
            button.textContent = "Accept Requests";
            button.disabled = false;
            statusSpan.textContent = "Ready";
            statusSpan.style.background = "#6c757d";
        }, 5000); // Longer timeout to see results
        
    } catch (error) {
        console.error("[Accept Requests] Error in handleAcceptRequests:", error);
        statusSpan.textContent = "Error";
        statusSpan.style.background = "#dc3545";
        button.textContent = "Accept Requests";
        button.disabled = false;
    }
}

// Function to handle bulk unfollow action
async function handleBulkUnfollow() {
    const button = document.getElementById("bulk-unfollow-btn");
    const statusSpan = document.getElementById("unfollow-status");
    
    try {
        const tabs = await chrome.tabs.query({ url: "https://www.linkedin.com/in/*" });
        
        if (tabs.length === 0) {
            statusSpan.textContent = "No profile tabs found";
            statusSpan.style.background = "#dc3545";
            return;
        }
        
        button.textContent = "Processing...";
        button.disabled = true;
        statusSpan.textContent = `Processing ${tabs.length} tab(s)`;
        statusSpan.style.background = "#ffc107";
        
        // Process all tabs in parallel - start ALL immediately with individual random delays
        const promises = tabs.map((tab, index) => {
            // Random delay between 1-5 seconds for each tab
            const randomDelay = Math.floor(Math.random() * 4000) + 1000; // 1000-5000ms
            
            return new Promise(async (resolve) => {
                try {
                    // Wait for this tab's random delay
                    await new Promise(r => setTimeout(r, randomDelay));
                    
                    // Try to send message, inject script if needed
                    try {
                        const result = await chrome.tabs.sendMessage(tab.id, { action: "startBulkUnfollow" });
                        resolve(result);
                    } catch {
                        await chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            files: ['scripts/bulk_unfollow.js']
                        });
                        await new Promise(r => setTimeout(r, 500));
                        const result = await chrome.tabs.sendMessage(tab.id, { action: "startBulkUnfollow" });
                        resolve(result);
                    }
                } catch (error) {
                    resolve({ success: false, error: error.message });
                }
            });
        });
        
        const results = await Promise.all(promises);
        const successful = results.filter(r => r.success).length;
        
        statusSpan.textContent = `Done: ${successful}/${tabs.length}`;
        statusSpan.style.background = successful > 0 ? "#28a745" : "#dc3545";
        
        setTimeout(() => {
            button.textContent = "Start Bulk Unfollow";
            button.disabled = false;
            button.style.background = "#ff6b6b";
            statusSpan.textContent = "Ready";
            statusSpan.style.background = "#6c757d";
        }, 3000);
        
    } catch (error) {
        statusSpan.textContent = "Error";
        statusSpan.style.background = "#dc3545";
        button.textContent = "Start Bulk Unfollow";
        button.disabled = false;
        button.style.background = "#ff6b6b";
    }
}

// Function to update bulk unfollow status
function updateBulkUnfollowStatus() {
    chrome.tabs.query({ url: "https://www.linkedin.com/in/*" }, (tabs) => {
        const statusSpan = document.getElementById("unfollow-status");
        if (tabs.length > 0) {
            statusSpan.textContent = `${tabs.length} profile(s)`;
            statusSpan.style.background = "#28a745";
        } else {
            statusSpan.textContent = "No profiles";
            statusSpan.style.background = "#6c757d";
        }
    });
}
// Simple bulk unfollow for LinkedIn profiles
let isProcessing = false;

// Debug function to log page structure
function debugPageStructure() {
    console.log('=== DEBUG: Current page structure ===');
    console.log('URL:', window.location.href);
    console.log('Document ready state:', document.readyState);
    
    // Check for More buttons
    const moreButtons = document.querySelectorAll('button[aria-label*="More"], button[id*="profile"], button');
    console.log(`Found ${moreButtons.length} potential More buttons:`);
    moreButtons.forEach((btn, i) => {
        if (btn.textContent.includes('More') || btn.getAttribute('aria-label')?.includes('More')) {
            console.log(`  ${i}: "${btn.textContent.trim()}" | aria-label: "${btn.getAttribute('aria-label')}" | id: "${btn.id}" | classes: "${btn.className}"`);
        }
    });
    
    // Check for dropdown items
    const dropdownItems = document.querySelectorAll('.artdeco-dropdown__item, [role="button"]');
    console.log(`Found ${dropdownItems.length} potential dropdown items`);
    
    // Check for modals
    const modals = document.querySelectorAll('.artdeco-modal, [role="alertdialog"]');
    console.log(`Found ${modals.length} modals`);
    
    console.log('=== END DEBUG ===');
}

// Check if this is a LinkedIn profile page
function isLinkedInProfile() {
    return window.location.href.includes('linkedin.com/in/');
}

// Check if element is actually visible and clickable
function isElementVisible(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    
    return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0' &&
        !element.disabled &&
        rect.top >= 0 &&
        rect.left >= 0
    );
}

// Wait for element with timeout and visibility check
function waitForElement(selector, timeout = 5000) {
    return new Promise(resolve => {
        const checkElement = () => {
            const element = document.querySelector(selector);
            if (element && isElementVisible(element)) {
                return resolve(element);
            }
        };
        
        checkElement();

        const observer = new MutationObserver(() => {
            checkElement();
        });

        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => {
            observer.disconnect();
            resolve(null);
        }, timeout);
    });
}

// Random delay to avoid bot detection
function randomDelay(min = 1000, max = 3000) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
}

// Main unfollow function
async function unfollowProfile() {
    if (isProcessing) {
        console.log('Already processing, skipping...');
        return { success: false, message: 'Already processing' };
    }
    
    if (!isLinkedInProfile()) {
        console.log('Not a LinkedIn profile page');
        return { success: false, message: 'Not a LinkedIn profile page' };
    }
    
    isProcessing = true;
    console.log('Starting unfollow process...');
    
    // Debug current page structure
    debugPageStructure();

    try {
        // Wait for page to load
        if (document.readyState !== 'complete') {
            await new Promise(resolve => {
                if (document.readyState === 'complete') resolve();
                else window.addEventListener('load', resolve);
            });
        }

        // Add random delay before starting
        await randomDelay(500, 2000);

        // Find More button - target the one in main profile section
        const moreSelectors = [
            '.ph5 button[aria-label="More actions"][id*="profile-overflow-action"]',
            'button[aria-label="More actions"][id*="profile-overflow-action"]',
            'button[aria-label*="More actions"]'
        ];

        let moreButton = null;
        for (const selector of moreSelectors) {
            moreButton = await waitForElement(selector, 2000);
            if (moreButton) break;
        }

        if (!moreButton) {
            // Try finding in main profile section specifically
            const buttons = document.querySelectorAll('.ph5 button, button');
            for (const btn of buttons) {
                if (btn.textContent.trim() === 'More' && 
                    isElementVisible(btn) &&
                    (btn.id.includes('profile-overflow-action') || 
                     btn.getAttribute('aria-label') === 'More actions')) {
                    moreButton = btn;
                    console.log('Found More button by text content');
                    break;
                }
            }
        }

        if (!moreButton) {
            console.log('No More button found');
            return { success: false, message: 'No More button found' };
        }

        // Scroll to button and click
        moreButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await randomDelay(300, 800);
        
        // Ensure dropdown is closed first, then click
        const existingDropdown = document.querySelector('.artdeco-dropdown__content[aria-hidden="false"]');
        if (existingDropdown) {
            // Click elsewhere to close any open dropdowns
            document.body.click();
            await randomDelay(500);
        }
        
        moreButton.click();
        console.log('Clicked More button');
        
        // Wait for dropdown to appear and be visible
        await randomDelay(1500, 2500);

        // Debug: Check if dropdown actually opened
        const openDropdowns = document.querySelectorAll('.artdeco-dropdown__content[aria-hidden="false"], .artdeco-dropdown__content:not([aria-hidden="true"])');
        console.log(`Found ${openDropdowns.length} open dropdowns after clicking More`);
        
        if (openDropdowns.length === 0) {
            console.log('No dropdown opened, trying to click More button again');
            await randomDelay(500);
            moreButton.click();
            await randomDelay(1500, 2500);
        }

        // Find unfollow option - exact match from HTML structure
        const unfollowSelectors = [
            'div[aria-label*="Unfollow"][role="button"].artdeco-dropdown__item',
            'div[aria-label*="Unfollow"][role="button"]'
        ];

        let unfollowBtn = null;
        
        console.log('Searching for unfollow button...');
        
        // First try specific selectors
        for (const selector of unfollowSelectors) {
            console.log(`Trying selector: ${selector}`);
            unfollowBtn = document.querySelector(selector);
            if (unfollowBtn && isElementVisible(unfollowBtn)) {
                console.log(`Found unfollow button with selector: ${selector}`);
                break;
            }
        }

        // If not found, search through dropdown items
        if (!unfollowBtn) {
            const dropdownItems = document.querySelectorAll('.artdeco-dropdown__item, .artdeco-dropdown__content div[role="button"]');
            console.log(`Searching ${dropdownItems.length} dropdown items for unfollow option`);
            for (const item of dropdownItems) {
                const ariaLabel = item.getAttribute('aria-label') || '';
                const text = item.textContent.trim();
                console.log(`Checking: "${text}" | aria-label: "${ariaLabel}"`);
                if ((ariaLabel.toLowerCase().includes('unfollow') || text.toLowerCase() === 'unfollow') && 
                    isElementVisible(item)) {
                    unfollowBtn = item;
                    console.log('Found unfollow button in dropdown items');
                    break;
                }
            }
        }
        
        if (!unfollowBtn) {
            console.log('No unfollow option found in dropdown - checking if already following...');
            
            // Check if there's a "Follow" button on the page (meaning we're not following)
            const followButtons = document.querySelectorAll('button');
            let isFollowing = false;
            for (const btn of followButtons) {
                const text = btn.textContent.trim().toLowerCase();
                if (text === 'following' || text === 'unfollow') {
                    isFollowing = true;
                    break;
                }
            }
            
            // Debug: Show what options ARE available
            const allDropdownItems = document.querySelectorAll('.artdeco-dropdown__item');
            console.log('Available dropdown options:');
            allDropdownItems.forEach((item, i) => {
                const text = item.textContent.trim();
                const ariaLabel = item.getAttribute('aria-label') || '';
                console.log(`  ${i}: "${text}" | aria-label: "${ariaLabel}"`);
            });
            
            if (!isFollowing) {
                // Don't close tab if no unfollow option and not following
                return { success: true, message: 'Not following this profile', shouldClose: false };
            } else {
                // If we are following but no unfollow in dropdown, try clicking More again
                console.log('Following but no unfollow option found, retrying...');
                return { success: false, message: 'Following but unfollow option not found' };
            }
        }

        // Click unfollow with delay
        unfollowBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await randomDelay(300, 800);
        unfollowBtn.click();
        console.log('Clicked unfollow button');
        
        // Wait for confirmation modal to appear
        await randomDelay(1000, 2000);

        // Find confirmation button - exact match from HTML structure
        const modalSelectors = [
            'button[data-test-dialog-primary-btn=""]',
            '.artdeco-modal button[data-test-dialog-primary-btn]'
        ];

        let confirmBtn = null;
        
        // First try specific selectors
        for (const selector of modalSelectors) {
            confirmBtn = document.querySelector(selector);
            if (confirmBtn && isElementVisible(confirmBtn) && 
                confirmBtn.textContent.toLowerCase().includes('unfollow')) break;
        }

        // If not found, search through modal buttons
        if (!confirmBtn) {
            const modalButtons = document.querySelectorAll('.artdeco-modal button, [role="alertdialog"] button');
            for (const btn of modalButtons) {
                if (btn.textContent.toLowerCase().includes('unfollow') && 
                    isElementVisible(btn)) {
                    confirmBtn = btn;
                    break;
                }
            }
        }

        if (confirmBtn) {
            await randomDelay(300, 800);
            confirmBtn.click();
            console.log('Unfollow completed!');
            
            // Wait for action to complete
            await randomDelay(1000, 2000);
            
            // Close the tab after successful unfollow - only if we actually unfollowed
            window.close();
            
            return { success: true, message: 'Unfollow completed successfully', shouldClose: true };
        } else {
            console.log('No confirmation button found');
            return { success: false, message: 'No confirmation button found' };
        }

    } catch (error) {
        console.error('Unfollow error:', error);
    } finally {
        isProcessing = false;
    }
}

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

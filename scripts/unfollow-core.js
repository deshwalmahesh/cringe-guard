// Core unfollow functionality
let isProcessing = false;
let hasReloaded = false; // Track if we've already reloaded once

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

        // Simple logic: check for "Following" button first, if not found then look for "More" button
        let followingButton = null;
        let moreButton = null;
        
        // First, look for "Following" button
        const buttons = document.querySelectorAll('button');
        console.log(`[UNFOLLOW] Found ${buttons.length} total buttons on page`);
        
        for (const btn of buttons) {
            const text = btn.textContent.trim().toLowerCase();
            if (text === 'following' && isElementVisible(btn)) {
                followingButton = btn;
                console.log('[UNFOLLOW] Found Following button:', btn);
                break;
            }
        }
        
        // If Following button found, click it and unfollow
        if (followingButton) {
            console.log('[UNFOLLOW] Clicking Following button');
            followingButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await randomDelay(300, 800);
            followingButton.click();
            
            // Wait for confirmation modal to appear
            await randomDelay(1000, 2000);
            
            // Find and click confirmation button
            const modalButtons = document.querySelectorAll('.artdeco-modal button, [role="alertdialog"] button');
            console.log(`[UNFOLLOW] Found ${modalButtons.length} modal buttons`);
            for (const btn of modalButtons) {
                const btnText = btn.textContent.toLowerCase();
                console.log(`[UNFOLLOW] Checking modal button: "${btnText}"`);
                if (btnText.includes('unfollow') && isElementVisible(btn)) {
                    await randomDelay(300, 800);
                    btn.click();
                    console.log('[UNFOLLOW] Unfollow completed via Following button!');
                    await randomDelay(1000, 2000);
                    window.close();
                    return { success: true, message: 'Unfollow completed successfully', shouldClose: true };
                }
            }
            console.log('[UNFOLLOW] No confirmation button found');
            return { success: false, message: 'No confirmation button found' };
        }
        
        console.log('[UNFOLLOW] No Following button found, looking for More button...');
        
        // If no Following button, look for More button
        for (const btn of buttons) {
            const text = btn.textContent.trim().toLowerCase();
            console.log(`[UNFOLLOW] Checking button: "${text}" | visible: ${isElementVisible(btn)} | id: "${btn.id}" | aria-label: "${btn.getAttribute('aria-label')}"`);
            if (text === 'more' && 
                isElementVisible(btn) &&
                (btn.id.includes('profile-overflow-action') || 
                 btn.getAttribute('aria-label') === 'More actions')) {
                moreButton = btn;
                console.log('[UNFOLLOW] Found More button:', btn);
                break;
            }
        }

        if (!moreButton) {
            console.log('[UNFOLLOW] No More button found');
            
            // Try reloading once if we haven't already (covers case: no Following AND no More)
            if (!hasReloaded) {
                console.log('[UNFOLLOW] Attempting reload and retry...');
                hasReloaded = true;
                isProcessing = false;
                chrome.runtime.sendMessage({ action: "reloadTab" });
                return { success: false, message: 'Reloading and retrying' };
            }
            
            return { success: false, message: 'No More button found after reload' };
        }

        console.log('[UNFOLLOW] Found More button, proceeding with dropdown flow...');
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
            console.log('No unfollow option found in dropdown');
            
            // Try reloading once if we haven't already
            if (!hasReloaded) {
                console.log('Attempting reload and retry...');
                hasReloaded = true;
                isProcessing = false;
                chrome.runtime.sendMessage({ action: "reloadTab" });
                return { success: false, message: 'Reloading and retrying' };
            }
            
            return { success: false, message: 'No unfollow option found after reload' };
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
        
        // Try reloading once if we haven't already
        if (!hasReloaded) {
            console.log('Attempting reload and retry...');
            hasReloaded = true;
            chrome.runtime.sendMessage({ action: "reloadTab" });
            return { success: false, message: 'Reloading and retrying' };
        }
        
        return { success: false, message: error.message };
    } finally {
        isProcessing = false;
    }
}

// Make function globally available
window.unfollowProfile = unfollowProfile;

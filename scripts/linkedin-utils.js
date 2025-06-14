// LinkedIn utility functions
// Check if this is a LinkedIn profile page
function isLinkedInProfile() {
    return window.location.href.includes('linkedin.com/in/');
}

// Make functions globally available
window.isLinkedInProfile = isLinkedInProfile;
window.isElementVisible = isElementVisible;
window.waitForElement = waitForElement;
window.randomDelay = randomDelay;
window.debugPageStructure = debugPageStructure;

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

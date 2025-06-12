document.addEventListener("DOMContentLoaded", function () {
    const apiKeyInput = document.getElementById("api-key");
    const saveButton = document.getElementById("save-button");
    const successMessage = document.getElementById("success-message");

    // Load API key from Chrome storage
    chrome.storage.sync.get("groqApiKey", function (data) {
        if (data.groqApiKey) {
            apiKeyInput.value = data.groqApiKey;
        }
    });

    // Save API key to Chrome storage
    saveButton.addEventListener("click", function () {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) return;

        chrome.storage.sync.set({ groqApiKey: apiKey }, function () {
            successMessage.classList.add("show");
            
            // Hide message after 3 seconds
            setTimeout(() => {
                successMessage.classList.remove("show");
            }, 3000);
        });
    });

    // Also allow Enter key to save
    apiKeyInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            saveButton.click();
        }
    });
});

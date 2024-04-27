function updateToggleButton(tabId) {
    chrome.storage.local.get([String(tabId)], function (data) {
        const monitoringEnabled = !!data[tabId];
        const toggleButton = document.getElementById('toggleButton');
        toggleButton.textContent = monitoringEnabled ? 'Stop Monitoring' : 'Start Monitoring';
    });
}

function toggleMonitoring() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs && tabs.length > 0) {
            const tabId = tabs[0].id;
            chrome.storage.local.get([String(tabId)], function (data) {
                const monitoringEnabled = !!data[tabId];
                if (monitoringEnabled) {
                    chrome.storage.local.remove(String(tabId), function() {});
                    chrome.tabs.sendMessage(tabId, { command: 'stopMonitoring' });

                } else {
                    chrome.storage.local.set({ [String(tabId)]: true }, function() {});
                    chrome.tabs.sendMessage(tabId, { command: 'startMonitoring' });

                }
                updateToggleButton(tabId);
            });
        } else {
            console.error("No active tab found.");
        }
    });
}

document.getElementById('toggleButton').addEventListener('click', toggleMonitoring);

// Initialize toggle button state
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    updateToggleButton(tabs[0].id);
});
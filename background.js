
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.command === "changeIconStop") {
        chrome.action.setIcon({ path: "images/stop.png", tabId: sender.tab.id  });
    }
    if (message.command === "changeIconSensor") {
        chrome.action.setIcon({ path: "images/sensors.png", tabId: sender.tab.id  });
    }
    if (message.command === "changeIconPaused") {
        chrome.action.setIcon({ path: "images/autostop.png", tabId: sender.tab.id  });
    }
});
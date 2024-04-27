

(function () {
    class ExponentialMovingAverage {
        constructor(alpha) {
            this.alpha = alpha;
            this.value = 0.0;
        }

        update(newValue) {
            if (this.value === 0) {
                this.value = 0.1
            } else {
                this.value = this.alpha * newValue + (1 - this.alpha) * this.value;
            }
        }

        getValue() {
            return this.value;
        }
    }

    let shouldRun = false;
    let specialWords = [
        "!play",
        "dasbobSabber",
        "ltdigiMarble",
        "ohmygr1GetEmIn",
        "sinist26Boom",
        "shambu3Rollin",
        "sports12SquadFam",
        "jackst51Smile",
        "spoooBle",
        "thekyu4Wiggle",
        "thechr19Goldma",
    ];
    let timer;
    let canTrack = true;
    let trackingPauseSeconds = 190;
    let trackingTimeframeSeconds = 10;

    let emaAlpha = 0.2; // Smoothing factor for EMA
    let wordCountEMA = new ExponentialMovingAverage(emaAlpha);
    let specialWordCountRateRequired = 0.6;
    let chatObserver;

    function initEMA() {
        wordCountEMA = new ExponentialMovingAverage(emaAlpha);
    }

    function checkWordCount() {
        const currentEMA = wordCountEMA.getValue();
        console.log("EMA:", currentEMA.toFixed(2));
        if (currentEMA >= specialWordCountRateRequired) {
            initEMA();
            sendMessage("!play");
        }
    }

    function sendMessage(message) {
        if (!shouldRun || !canTrack) {
            console.log("skipped, should not run");
            return;
        }
        console.log("Special words detected");
        canTrack = false; // Disable tracking

        stopMonitorChat();
        chrome.runtime.sendMessage({ command: "changeIconPaused" });

        const e = new CustomEvent('tmap_send_chat', { 'detail': { 'text': message } })
        document.dispatchEvent(e)

        setTimeout(() => {
            canTrack = true;
            if (shouldRun) {
                monitorChat();
            }
        }, trackingPauseSeconds * 1000); // Enable tracking after tracking paused
    }

    function monitorChat() {
        if (!shouldRun) {
            console.error("skipped");
            stopMonitorChat();
            return;
        }
        const chatList = document.querySelector('.chat-list--default');
        if (!chatList) {
            console.error("Chat list element not found.");
            return;
        }
        console.log("Starting chat monitoring...");
        chrome.runtime.sendMessage({ command: "changeIconSensor" });

        chatObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && (node.matches('.seventv-message') || node.matches('.chat-line__message'))) {
                        //console.log('node:', node)

                        const messageBody = node.querySelector('.seventv-chat-message-body, .chat-line__message-container');
                        const messageText = getMessageTextAll(messageBody);
                        //console.log('messageBody:', messageBody)
                        //console.log('messageText:', messageText)
                        if (messageText && containsSpecialWord(messageText.toLowerCase())) {
                            wordCountEMA.update(1);
                            checkWordCount();
                            clearTimeout(timer);
                            timer = setTimeout(() => {
                                wordCountEMA = new ExponentialMovingAverage(emaAlpha);
                            }, trackingTimeframeSeconds * 1000);
                        }
                    }
                });
            });
        });

        chatObserver.observe(chatList, { childList: true, subtree: true });
    }

    function getMessageTextAll(messageBody) {
        if (!messageBody) return null;
        const emoteElements = messageBody.querySelectorAll('.seventv-chat-emote, .chat-line__message--emote');
        const textTokens = messageBody.querySelectorAll('.text-token, .text-fragment');
        let messageText = '';

        // Extract text from emote alt attributes
        emoteElements.forEach(emoteElement => {
            const alt = emoteElement.getAttribute('alt');
            if (alt) {
                messageText += alt + ' '; // Add a space between emotes
            }
        });

        // Extract text from text tokens
        textTokens.forEach(token => {
            messageText += token.textContent.trim() + ' ';
        });

        // Return the combined message text
        return messageText.trim().toLowerCase();
    }

    function containsSpecialWord(messageText) {
        for (let i = 0; i < specialWords.length; i++) {
            if (messageText.includes(specialWords[i])) {
                return true;
            }
        }
        return false;
    }

    function stopMonitorChat() {
        initEMA();
        if (chatObserver) {
            chatObserver.disconnect();
            console.log("Chat monitoring stopped.");
        } else {
            console.log("Chat monitoring is not active.");
        }
    }
    
    chrome.runtime.sendMessage({ command: "changeIconStop" });
    // Listen for messages from popup.js to start or stop monitoring
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.command === 'startMonitoring') {
            shouldRun = true;
            monitorChat();
        } else if (message.command === 'stopMonitoring') {
            shouldRun = false;
            stopMonitorChat();
            chrome.runtime.sendMessage({ command: "changeIconStop" });
        }
    });
})();


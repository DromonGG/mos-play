(function () {
    'use strict'

    function sendChatText(message) {
        const currentChat = getCurrentChat();
        if (!currentChat) return;
        currentChat.props.onSendMessage(message);
    }

    function getCurrentChat() {
        let currentChat;
        try {
            const node = searchReactParents(
                getReactInstance(document.querySelector('section[data-test-selector="chat-room-component-layout"]')),
                (n) => n.stateNode && n.stateNode.props && n.stateNode.props.onSendMessage
            );
            currentChat = node.stateNode;
        } catch (_) { }

        return currentChat;
    }

    function getReactInstance(element) {
        for (const key in element) {
            if (key.startsWith('__reactInternalInstance$') || key.startsWith('__reactFiber$')) {
                return element[key];
            }
        }

        return null;
    }

    function searchReactParents(node, predicate, maxDepth = 15, depth = 0) {
        try {
            if (predicate(node)) {
                return node;
            }
        } catch (_) { }

        if (!node || depth > maxDepth) {
            return null;
        }

        const { return: parent } = node;
        if (parent) {
            return searchReactParents(parent, predicate, maxDepth, depth + 1);
        }

        return null;
    }

    // Listen to content script
    document.addEventListener('tmap_send_chat', function (e) {
        sendChatText(e.detail.text)
    })
}())
// File: js/chat.js

document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.getElementById('chat-widget-button');
    const chatWindow = document.getElementById('chat-window');
    const closeChatBtn = document.getElementById('close-chat');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');

    // Bật tắt cửa sổ chat
    if(chatButton) chatButton.addEventListener('click', () => chatWindow.classList.remove('hidden'));
    if(closeChatBtn) closeChatBtn.addEventListener('click', () => chatWindow.classList.add('hidden'));

    // Gửi tin nhắn
    if(sendChatBtn) sendChatBtn.addEventListener('click', sendMessage);
    if(chatInput) chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    async function sendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText === '') return;

        // 1. Hiện tin nhắn của người dùng ngay lập tức
        addMessageToChat('user', messageText);
        chatInput.value = '';

        // 2. Hiện tin nhắn "Đang nghĩ..." của Bot
        const loadingId = addMessageToChat('ai', 'Đang suy nghĩ...');

        try {
            // 3. Gọi API Backend
            const response = await fetch('http://localhost:8080/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: messageText })
            });

            const data = await response.json();
            
            // 4. Xóa tin nhắn "Đang nghĩ"
            const loadingMsg = document.getElementById(loadingId);
            if (loadingMsg) loadingMsg.remove();
            
            // 5. Hiện câu trả lời thật
            addMessageToChat('ai', data.response);

        } catch (error) {
            console.error("Lỗi chat:", error);
            const loadingMsg = document.getElementById(loadingId);
            if (loadingMsg) loadingMsg.innerText = "Lỗi kết nối Server.";
        }
    }

    function addMessageToChat(sender, text) {
        const messageElement = document.createElement('div');
        const msgId = 'msg-' + Date.now();
        messageElement.id = msgId;
        messageElement.classList.add('chat-message', `message-${sender}`);
        
        // Thay thế xuống dòng bằng thẻ <br> để đẹp hơn
        messageElement.innerHTML = text.replace(/\n/g, "<br>"); 
        
        chatBody.appendChild(messageElement);
        chatBody.scrollTop = chatBody.scrollHeight; // Cuộn xuống dưới cùng
        return msgId;
    }
});
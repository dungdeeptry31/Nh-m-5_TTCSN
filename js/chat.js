// File: js/chat.js

document.addEventListener('DOMContentLoaded', () => {
    const chatButton = document.getElementById('chat-widget-button');
    const chatWindow = document.getElementById('chat-window');
    const closeChatBtn = document.getElementById('close-chat');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');

    // Bấm nút 💬 để mở cửa sổ chat
    chatButton.addEventListener('click', () => {
        chatWindow.classList.remove('hidden');
    });

    // Bấm nút X để đóng cửa sổ chat
    closeChatBtn.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    // Bấm nút Gửi
    sendChatBtn.addEventListener('click', () => {
        sendMessage();
    });

    // Gõ Enter trong ô input
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Hàm gửi tin nhắn
    function sendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText === '') return; // Không gửi tin nhắn rỗng

        // 1. Hiển thị tin nhắn của người dùng
        addMessageToChat('user', messageText);

        // 2. Xóa nội dung ô input
        chatInput.value = '';

        // 3. (Giả lập) AI trả lời
        setTimeout(() => {
            addMessageToChat('ai', 'Đây là câu trả lời giả lập. Chúng ta sẽ sớm kết nối AI thật.');
        }, 1000);
        
        // Sau này: Sẽ gọi API POST /api/chat
    }

    // Hàm thêm tin nhắn vào cửa sổ chat
    function addMessageToChat(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `message-${sender}`);
        messageElement.innerText = text;
        chatBody.appendChild(messageElement);

        // Tự động cuộn xuống tin nhắn mới nhất
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Thêm CSS cho tin nhắn (cần thêm vào style.css)
    // .chat-message { padding: 8px 12px; border-radius: 18px; margin-bottom: 8px; max-width: 80%; }
    // .message-user { background: #007bff; color: white; margin-left: auto; }
    // .message-ai { background: #e9e9eb; color: #333; }
});
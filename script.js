
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Đã gửi form! (Tĩnh, không xử lý thực tế)');
    });
});
// Chatbox Functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatIcon = document.getElementById('chat-icon');
    const chatModal = document.getElementById('chat-modal');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendChat = document.getElementById('send-chat');
    const chatMessages = document.getElementById('chat-messages');

    // Open chat modal
    chatIcon.addEventListener('click', function() {
        chatModal.style.display = 'block';
    });

    // Close chat modal
    closeChat.addEventListener('click', function() {
        chatModal.style.display = 'none';
    });

    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;

        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'user-message';
        userMsg.textContent = message;
        chatMessages.appendChild(userMsg);

        // Generate bot response
        const botMsg = document.createElement('div');
        botMsg.className = 'bot-message';
        botMsg.textContent = getBotResponse(message);
        chatMessages.appendChild(botMsg);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Clear input
        chatInput.value = '';
    }

    sendChat.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    // Bot response logic (hardcoded)
    function getBotResponse(userMessage) {
        const lowerMsg = userMessage.toLowerCase();
        if (lowerMsg.includes('pizza')) {
            return 'Chúng tôi chưa có công thức pizza, nhưng bạn có thể thử Mì Ý Bolognese – nó ngon không kém!';
        } else if (lowerMsg.includes('sushi')) {
            return 'Sushi chưa có, nhưng Salad Rau Củ tươi ngon lắm, hãy thử xem!';
        } else if (lowerMsg.includes('bánh mì')) {
            return 'Bánh mì chưa có, nhưng Bánh Kem Chocolate của chúng tôi rất tuyệt!';
        } else if (lowerMsg.includes('món ăn') || lowerMsg.includes('công thức')) {
            return 'Chúng tôi có Salad Rau Củ, Mì Ý Bolognese, và Bánh Kem Chocolate. Bạn muốn hỏi gì cụ thể hơn?';
        } else {
            return 'Xin lỗi, tôi chưa hiểu rõ. Hãy hỏi về món ăn bạn quan tâm nhé!';
        }
    }
});
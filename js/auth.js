// File: js/auth.js (PHIÊN BẢN CUỐI CÙNG - KẾT NỐI API THẬT)

document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // === (ĐÃ SỬA) XỬ LÝ FORM ĐĂNG KÝ (API THẬT) ===
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => { // Thêm 'async'
            e.preventDefault(); // Ngăn form gửi đi
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // Gọi API POST /api/auth/register của Java
                const response = await fetch('http://localhost:8080/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password }) 
                });

                if (response.ok) {
                    // Nếu backend trả về 200 OK
                    alert('Đăng ký thành công! Vui lòng đăng nhập.');
                    window.location.href = 'login.html';
                } else {
                    // Nếu backend trả về lỗi (400, 500...)
                    const errorData = await response.text(); // Lấy thông báo lỗi
                    alert(`Lỗi đăng ký: ${errorData}`);
                }
            } catch (error) {
                // Lỗi nếu không kết nối được (ví dụ: backend chưa chạy)
                console.error("Lỗi đăng ký:", error);
                alert("Không thể kết nối đến máy chủ đăng ký. (Backend có đang chạy không?)");
            }
        });
    }

    // === (ĐÃ SỬA) XỬ LÝ FORM ĐĂNG NHẬP (API THẬT) ===
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => { // Thêm 'async'
            e.preventDefault(); 
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // Gọi API POST /api/auth/login của Java
                const response = await fetch('http://localhost:8080/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }) // Gửi email và pass
                });

                if (response.ok) {
                    // Nếu đăng nhập thành công (Backend trả về 200 OK)
                    const data = await response.json(); // Lấy { email, username, token }
                    
                    // Lưu Token và thông tin user vào localStorage
                    localStorage.setItem('authToken', data.token); // Quan trọng nhất
                    localStorage.setItem('currentUser', JSON.stringify({ 
                        username: data.username, 
                        email: data.email,
                        isAdmin: data.email === 'admin@gmail.com' // Tạm thời vẫn check admin bằng email
                    }));

                    alert('Đăng nhập thành công!');
                    
                    // Chuyển hướng
                    if (data.email === 'admin@gmail.com') {
                        window.location.href = 'admin-dashboard.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    // Nếu backend trả về lỗi 401 (Sai pass) hoặc 404 (Không tìm thấy user)
                    const errorData = await response.text();
                    alert(`Lỗi đăng nhập: ${errorData}`);
                }
            } catch (error) {
                console.error("Lỗi đăng nhập:", error);
                alert("Không thể kết nối đến máy chủ đăng nhập.");
            }
        });
    }
    
    // Cập nhật giao diện Header (Giữ nguyên code cũ của bạn)
    updateHeaderUI();
});

/**
 * Hàm cập nhật giao diện Header (Giữ nguyên)
 */
function updateHeaderUI() {
    const loggedOutActions = document.getElementById('logged-out-actions');
    const loggedInUser = document.getElementById('logged-in-user');
    
    if (!loggedOutActions || !loggedInUser) return; 

    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (user) {
        // --- ĐÃ ĐĂNG NHẬP ---
        loggedOutActions.classList.add('hidden');
        loggedInUser.classList.remove('hidden');

        const usernameDisplay = document.getElementById('username-display');
        const adminLink = document.getElementById('admin-link');
        const userProfileButton = document.getElementById('user-profile-button');
        const dropdownMenu = document.getElementById('dropdown-menu');
        const logoutBtn = document.getElementById('logout-btn-dropdown');

        usernameDisplay.innerText = `Chào, ${user.username}`;

        if (user.isAdmin) {
            adminLink.classList.remove('hidden');
        } else {
            adminLink.classList.add('hidden');
        }

        userProfileButton.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
        });

        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            localStorage.removeItem('authToken'); // Xóa cả Token
            alert('Đã đăng xuất.');
            window.location.href = 'index.html';
        });

    } else {
        // --- CHƯA ĐĂNG NHẬP ---
        loggedOutActions.classList.remove('hidden');
        loggedInUser.classList.add('hidden');
    }
}

/**
 * Hàm kiểm tra đăng nhập (Giờ sẽ kiểm tra Token)
 */
function isLoggedIn() {
    return localStorage.getItem('authToken') !== null;
}

// Logic Click ra ngoài để đóng dropdown (Giữ nguyên)
window.addEventListener('click', () => {
    const dropdownMenu = document.getElementById('dropdown-menu');
    if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
        dropdownMenu.classList.add('hidden');
    }
});
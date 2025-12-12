// File: js/auth.js

const API_AUTH_URL = 'http://localhost:8080/api/auth';

document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // === 1. XỬ LÝ ĐĂNG KÝ ===
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_AUTH_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password }) 
                });

                if (response.ok) {
                    alert('Đăng ký thành công! Vui lòng đăng nhập.');
                    window.location.href = 'login.html';
                } else {
                    const errorData = await response.text();
                    alert(`Lỗi đăng ký: ${errorData}`);
                }
            } catch (error) {
                console.error(error);
                alert("Lỗi kết nối Server.");
            }
        });
    }

    // === 2. XỬ LÝ ĐĂNG NHẬP ===
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_AUTH_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json(); 
                    
                    localStorage.setItem('authToken', data.token);
                    
                    // Lưu thông tin user (Thêm displayName nếu backend có trả về)
                    localStorage.setItem('currentUser', JSON.stringify({ 
                        username: data.username, 
                        email: data.email,
                        role: data.role,
                        displayName: data.displayName || null // Dự phòng
                    }));

                    alert('Đăng nhập thành công!');
                    
                    if (data.role === 'ADMIN') {
                        window.location.href = 'admin-manage-recipes.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                } else {
                    alert("Sai email hoặc mật khẩu!");
                }
            } catch (error) {
                console.error(error);
                alert("Lỗi kết nối Server.");
            }
        });
    }
    
    updateHeaderUI();
});

// === 3. CẬP NHẬT HEADER (QUAN TRỌNG: ĐÃ SỬA LOGIC HIỂN THỊ TÊN) ===
function updateHeaderUI() {
    const userJson = localStorage.getItem('currentUser');
    const user = userJson ? JSON.parse(userJson) : null;

    const loggedOutActions = document.getElementById('logged-out-actions');
    const loggedInUser = document.getElementById('logged-in-user');

    if (user) {
        if (loggedOutActions) loggedOutActions.classList.add('hidden');
        if (loggedInUser) loggedInUser.classList.remove('hidden');

        // --- SỬA Ở ĐÂY: Ưu tiên hiển thị displayName ---
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            // Logic: Nếu có displayName thì lấy, nếu không thì lấy username, cùng lắm thì lấy email
            const nameToShow = user.displayName || user.username || user.email;
            usernameDisplay.innerText = `Chào, ${nameToShow}`; 
        }
        // -----------------------------------------------

        const adminLink = document.getElementById('admin-link');
        if (adminLink) {
            if (user.role === 'ADMIN') {
                adminLink.classList.remove('hidden');
                adminLink.style.display = 'inline-block';
            } else {
                adminLink.classList.add('hidden');
                adminLink.style.display = 'none';
            }
        }

        // Xử lý Dropdown
        const userProfileButton = document.getElementById('user-profile-button'); 
        const dropdownMenu = document.getElementById('dropdown-menu');

        if (userProfileButton && dropdownMenu) {
            const newBtn = userProfileButton.cloneNode(true);
            userProfileButton.parentNode.replaceChild(newBtn, userProfileButton);

            newBtn.addEventListener('click', (e) => {
                e.stopPropagation(); 
                dropdownMenu.classList.toggle('hidden');
            });

            window.addEventListener('click', () => {
                if (!dropdownMenu.classList.contains('hidden')) {
                    dropdownMenu.classList.add('hidden');
                }
            });
        }

        // Xử lý Đăng xuất
        const logoutBtn = document.getElementById('logout-btn-dropdown') || document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.onclick = function(e) {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                localStorage.removeItem('authToken');
                alert("Đăng xuất thành công!");
                window.location.href = 'index.html';
            };
        }

    } else {
        if (loggedOutActions) loggedOutActions.classList.remove('hidden');
        if (loggedInUser) loggedInUser.classList.add('hidden');
    }
}

function isLoggedIn() {
    return localStorage.getItem('authToken') !== null;
}
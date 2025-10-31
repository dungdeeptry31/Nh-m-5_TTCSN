// File: js/auth.js (PHIÊN BẢN CÓ DROPDOWN VÀ PHÂN QUYỀN)

document.addEventListener('DOMContentLoaded', () => {
    
    // Xử lý Form (Không thay đổi nhiều)
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Đăng ký giả lập thành công! Vui lòng đăng nhập.');
            window.location.href = 'login.html';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const email = document.getElementById('email').value;
            
            const fakeUser = {
                id: 1,
                email: email,
                username: email.split('@')[0],
                // KIỂM TRA QUYỀN ADMIN NGAY KHI ĐĂNG NHẬP
                isAdmin: email === 'admin@gmail.com' 
            };
            
            localStorage.setItem('currentUser', JSON.stringify(fakeUser));
            alert('Đăng nhập thành công!');
            
            // Tự động chuyển hướng
            if (fakeUser.isAdmin) {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        });
    }
    
    // Cập nhật giao diện Header (HÀM NÀY THAY ĐỔI HOÀN TOÀN)
    updateHeaderUI();
});

/**
 * Hàm cập nhật giao diện Header
 * Hiển thị dropdown nếu đã đăng nhập, ẩn/hiện link Admin
 */
function updateHeaderUI() {
    // Lấy các khối HTML mới
    const loggedOutActions = document.getElementById('logged-out-actions');
    const loggedInUser = document.getElementById('logged-in-user');
    
    if (!loggedOutActions || !loggedInUser) return; // Thoát nếu không tìm thấy

    const user = JSON.parse(localStorage.getItem('currentUser'));

    if (user) {
        // --- ĐÃ ĐĂNG NHẬP ---
        loggedOutActions.classList.add('hidden');
        loggedInUser.classList.remove('hidden');

        // Lấy các phần tử trong dropdown
        const usernameDisplay = document.getElementById('username-display');
        const adminLink = document.getElementById('admin-link');
        const userProfileButton = document.getElementById('user-profile-button');
        const dropdownMenu = document.getElementById('dropdown-menu');
        const logoutBtn = document.getElementById('logout-btn-dropdown');

        // 1. Cập nhật tên
        usernameDisplay.innerText = `Chào, ${user.username}`;

        // 2. PHÂN QUYỀN ADMIN (Use Case #11)
        if (user.isAdmin) {
            adminLink.classList.remove('hidden');
        } else {
            adminLink.classList.add('hidden');
        }

        // 3. Logic Bật/Tắt Dropdown
        userProfileButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Ngăn click lan ra ngoài
            dropdownMenu.classList.toggle('hidden');
        });

        // 4. Logic Đăng xuất
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
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
 * Hàm kiểm tra đăng nhập (Không đổi)
 */
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// (MỚI) Thêm logic: Click ra ngoài để đóng dropdown
window.addEventListener('click', () => {
    const dropdownMenu = document.getElementById('dropdown-menu');
    if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
        dropdownMenu.classList.add('hidden');
    }
});
// File: js/profile.js
const API_BASE_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- PHẦN 1: QUẢN LÝ THÔNG TIN CÁ NHÂN ---
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
        alert("Vui lòng đăng nhập!");
        window.location.href = 'login.html';
        return;
    }
    const user = JSON.parse(userStr);

    const emailInput = document.getElementById('user-email');
    const nameInput = document.getElementById('display-name');
    
    if (emailInput) emailInput.value = user.email || "";
    if (nameInput) nameInput.value = user.displayName || user.username || "";

    const form = document.getElementById('profile-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newName = nameInput.value.trim();
            if (!newName) { alert("Tên hiển thị không được để trống!"); return; }

            try {
                const res = await fetch(`${API_BASE_URL}/api/users/update`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email, displayName: newName })
                });

                if (res.ok) {
                    const updatedUser = await res.json();
                    const newUserLocal = { ...user, displayName: updatedUser.displayName };
                    localStorage.setItem('currentUser', JSON.stringify(newUserLocal));
                    alert("Cập nhật thành công!");
                    location.reload(); 
                } else {
                    alert("Lỗi: " + await res.text());
                }
            } catch (err) { console.error(err); alert("Lỗi kết nối Server!"); }
        });
    }

    // --- PHẦN 2: QUẢN LÝ TAB (Yêu thích & Lịch sử) ---

    const tabs = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);

            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            if (targetContent) targetContent.classList.add('active');

            if (targetId === 'tab-favorites') {
                loadList('favorites');
            } else if (targetId === 'tab-history') {
                loadList('history');
            }
        });
    });

    // Hàm chung để tải danh sách
    async function loadList(type) {
        // SỬA QUAN TRỌNG: Chọn đúng container .recipe-grid bên trong tab tương ứng
        const containerSelector = type === 'favorites' ? '#tab-favorites .recipe-grid' : '#tab-history .recipe-grid';
        const container = document.querySelector(containerSelector); 
        
        if (!container) {
            console.error(`Không tìm thấy container: ${containerSelector}`);
            return;
        }
        
        let url = '';
        if (type === 'favorites') {
            url = `${API_BASE_URL}/api/favorites/user/${user.email}`;
        } else {
            url = `${API_BASE_URL}/api/history/${user.email}`;
        }

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Lỗi tải dữ liệu");
            
            const data = await res.json();

            container.innerHTML = ''; // Xóa cũ
            
            if (data.length === 0) {
                container.innerHTML = '<p>Chưa có dữ liệu.</p>';
                return;
            }

            data.forEach(item => {
                // Lịch sử trả về object {recipe:..., viewedAt:...}, Yêu thích trả về List<Recipe>
                let recipe = (type === 'history') ? item.recipe : item;
                
                let imgUrl = 'https://via.placeholder.com/300x200?text=No+Img';
                if (recipe.image) {
                    imgUrl = recipe.image.startsWith('http') ? recipe.image : `${API_BASE_URL}/uploads/${recipe.image}`;
                }

                const card = `
                    <div class="recipe-card" style="
                        border: 1px solid #eee; 
                        margin-bottom: 15px; 
                        padding: 10px; 
                        border-radius: 8px; 
                        display: flex; 
                        align-items: center; 
                        gap: 15px; 
                        background: #fff; 
                        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                        cursor: pointer;" 
                        onclick="location.href='recipe-detail.html?id=${recipe.id}'">
                        
                        <img src="${imgUrl}" 
                             alt="${recipe.title}" 
                             style="width: 80px; height: 80px; object-fit: cover; border-radius: 6px;"
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/150?text=Error';">
                        
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 5px 0; color: #333;">${recipe.title}</h4>
                            <p style="margin: 0; font-size: 13px; color: #666;">
                                ${recipe.description ? recipe.description.substring(0, 60) + '...' : 'Món ngon...'}
                            </p>
                            ${type === 'history' ? `<small style="color: #999; font-size: 12px; display: block; margin-top: 5px;">Xem lúc: ${formatDate(item.viewedAt)}</small>` : ''}
                        </div>
                    </div>
                `;
                container.innerHTML += card;
            });

        } catch (err) { 
            console.error(err); 
            container.innerHTML = '<p style="color:red">Lỗi kết nối!</p>';
        }
    }

    function formatDate(dateString) {
        if(!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN'); // Ngày giờ kiểu Việt Nam
    }
});
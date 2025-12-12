// File: js/admin-category.js (BẢN CHUẨN ĐỒNG BỘ ID)
const API_BASE_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check quyền
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'ADMIN') {
        alert("Bạn không có quyền truy cập!");
        window.location.href = 'index.html';
        return;
    }

    // 2. Load danh sách ngay khi vào trang
    loadCategories();

    // 3. Sự kiện nút bấm
    const formContainer = document.getElementById('category-form-container');
    
    // Nút Thêm mới
    document.getElementById('add-new-btn').addEventListener('click', () => {
        showForm();
    });

    // Nút Hủy
    document.getElementById('cancel-btn').addEventListener('click', () => {
        formContainer.classList.remove('show');
        document.getElementById('category-form').reset();
        document.getElementById('image-preview').style.display = 'none';
    });

    // Xem trước ảnh
    document.getElementById('category-image-input').addEventListener('change', function(e) {
        if(e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                const img = document.getElementById('image-preview');
                img.src = ev.target.result;
                img.style.display = 'block';
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // 4. Submit Form
    document.getElementById('category-form').addEventListener('submit', handleFormSubmit);
});

// --- HÀM TẢI DANH SÁCH ---
async function loadCategories() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/categories`);
        const categories = await res.json();
        const tbody = document.getElementById('category-table-body');
        tbody.innerHTML = '';

        if(categories.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Chưa có danh mục nào.</td></tr>';
            return;
        }

        categories.forEach(cat => {
            // Xử lý ảnh
            let imgUrl = 'https://via.placeholder.com/60?text=No+Img';
            if (cat.image) {
                imgUrl = cat.image.startsWith('http') ? cat.image : `${API_BASE_URL}/uploads/${cat.image}`;
            }
            
            const row = `
                <tr>
                    <td>${cat.id}</td>
                    <td>
                        <img src="${imgUrl}" 
                             style="width:60px; height:60px; object-fit:cover; border-radius:6px;"
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/60?text=Error';">
                    </td>
                    <td><strong>${cat.name}</strong></td>
                    <td>
                        <button class="btn btn-edit" onclick="openEdit(${cat.id})">Sửa</button>
                        <button class="btn btn-delete" onclick="deleteCategory(${cat.id})">Xóa</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (err) { console.error(err); }
}

// --- HÀM SUBMIT (THÊM/SỬA) ---
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('category-id').value;
    const name = document.getElementById('category-name-input').value;
    const file = document.getElementById('category-image-input').files[0];
    const currentImage = document.getElementById('current-image-path').value;

    const formData = new FormData();
    formData.append('name', name);
    if (file) formData.append('file', file);
    if (id && currentImage) formData.append('currentImage', currentImage);

    const url = id ? `${API_BASE_URL}/api/categories/${id}` : `${API_BASE_URL}/api/categories`;
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, { method: method, body: formData });
        if (res.ok) {
            alert(id ? "Cập nhật thành công!" : "Thêm mới thành công!");
            document.getElementById('category-form-container').classList.remove('show');
            loadCategories();
        } else {
            alert("Lỗi: " + await res.text());
        }
    } catch (err) { alert("Lỗi kết nối!"); }
}

// --- HÀM HỖ TRỢ ---
function showForm() {
    document.getElementById('category-form').reset();
    document.getElementById('category-id').value = '';
    document.getElementById('form-title').innerText = "Thêm danh mục mới";
    document.getElementById('image-preview').style.display = 'none';
    document.getElementById('category-form-container').classList.add('show');
}

async function openEdit(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/categories/${id}`);
        const cat = await res.json();

        document.getElementById('category-id').value = cat.id;
        document.getElementById('category-name-input').value = cat.name;
        document.getElementById('current-image-path').value = cat.image;

        const img = document.getElementById('image-preview');
        if(cat.image) {
            img.src = cat.image.startsWith('http') ? cat.image : `${API_BASE_URL}/uploads/${cat.image}`;
            img.style.display = 'block';
        } else {
            img.style.display = 'none';
        }

        document.getElementById('form-title').innerText = "Cập nhật danh mục";
        document.getElementById('category-form-container').classList.add('show');
    } catch(e) { console.error(e); }
}

async function deleteCategory(id) {
    if (!confirm("Xóa danh mục này?")) return;
    try {
        const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, { method: 'DELETE' });
        if (res.ok) {
            alert("Đã xóa!");
            loadCategories();
        } else {
            alert("Không thể xóa (Có thể danh mục này đang chứa món ăn)");
        }
    } catch (err) { alert("Lỗi kết nối!"); }
}
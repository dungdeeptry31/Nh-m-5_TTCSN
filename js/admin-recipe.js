// File: js/admin-recipe.js (ĐÃ SỬA LỖI NHÁY ẢNH)
const API_BASE_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check quyền
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'ADMIN') {
        alert("Bạn không có quyền truy cập!");
        window.location.href = 'index.html';
        return;
    }

    // 2. Load dữ liệu
    loadCategoriesToSelect();
    loadRecipes();

    // 3. Sự kiện nút bấm
    document.getElementById('add-new-recipe-btn').onclick = showAddForm;
    document.getElementById('cancel-btn').onclick = () => document.getElementById('recipe-form-container').classList.add('hidden');
    
    // 4. Preview ảnh khi chọn file
    const imgInput = document.getElementById('recipe-image-input');
    if(imgInput) {
        imgInput.onchange = function(e) {
            if(e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    const img = document.getElementById('image-preview');
                    img.src = ev.target.result;
                    img.classList.remove('hidden');
                    img.style.display = 'block';
                }
                reader.readAsDataURL(e.target.files[0]);
            }
        };
    }

    // 5. Submit Form
    document.getElementById('recipe-form').onsubmit = handleFormSubmit;
});

// --- LOAD DANH MỤC ---
async function loadCategoriesToSelect() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/categories`);
        const cats = await res.json();
        const select = document.getElementById('recipe-category-input');
        select.innerHTML = '<option value="">-- Chọn danh mục --</option>';
        cats.forEach(c => select.innerHTML += `<option value="${c.id}">${c.name}</option>`);
    } catch(e) { console.error(e); }
}

// --- LOAD DANH SÁCH MÓN ĂN (SỬA LỖI ẢNH TẠI ĐÂY) ---
async function loadRecipes() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/recipes?page=0&size=100`);
        const data = await res.json();
        const tbody = document.getElementById('recipe-table-body');
        tbody.innerHTML = '';
        
        data.content.forEach(r => {
            // Xử lý đường dẫn ảnh
            let imgUrl = 'https://via.placeholder.com/150?text=No+Image'; // Mặc định dùng ảnh online cho an toàn
            if(r.image) {
                // Nếu là link http (ảnh mạng) thì dùng luôn, nếu không thì trỏ về server
                imgUrl = r.image.startsWith('http') ? r.image : `${API_BASE_URL}/uploads/${r.image}`;
            }
            
            tbody.innerHTML += `
                <tr>
                    <td>${r.id}</td>
                    <td>
                        <img src="${imgUrl}" 
                             style="width:60px; height:40px; object-fit:cover; border-radius:4px;"
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/150?text=Error';">
                    </td>
                    <td><strong>${r.title}</strong></td>
                    <td class="desc-col" title="${r.description}">${r.description ? r.description.substring(0, 50)+'...' : ''}</td>
                    <td>
                        <button class="action-btn edit-btn" onclick="openEdit(${r.id})">Sửa</button>
                        <button class="action-btn delete-btn" onclick="deleteRecipe(${r.id})">Xóa</button>
                    </td>
                </tr>
            `;
        });
    } catch(e) { console.error(e); }
}

// --- XỬ LÝ SUBMIT (GỬI FORMDATA) ---
async function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('recipe-id').value;
    const formData = new FormData();
    
    // Lấy dữ liệu Text
    formData.append('title', document.getElementById('recipe-title-input').value);
    formData.append('description', document.getElementById('recipe-description-input').value);
    formData.append('prepTime', document.getElementById('recipe-prep-time-input').value);
    formData.append('servings', document.getElementById('recipe-servings-input').value);
    formData.append('categoryId', document.getElementById('recipe-category-input').value);
    
    // Lấy dữ liệu Mảng (Nguyên liệu/Cách làm) - Tách dòng
    document.getElementById('recipe-ingredients-input').value.split('\n').forEach(i => { if(i.trim()) formData.append('ingredients', i.trim()) });
    document.getElementById('recipe-instructions-input').value.split('\n').forEach(i => { if(i.trim()) formData.append('instructions', i.trim()) });

    // Lấy File Ảnh Mới (Nếu có)
    const fileInput = document.getElementById('recipe-image-input');
    if(fileInput.files[0]) formData.append('file', fileInput.files[0]);
    
    // Gửi tên ảnh cũ (để backend biết nếu không thay ảnh mới)
    const currentImg = document.getElementById('current-image-path');
    if(id && currentImg) formData.append('currentImage', currentImg.value);

    // Gửi API
    const url = id ? `${API_BASE_URL}/api/recipes/${id}` : `${API_BASE_URL}/api/recipes`;
    const method = id ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, { method: method, body: formData });
        if(res.ok) {
            alert("Thành công!");
            document.getElementById('recipe-form-container').classList.add('hidden');
            loadRecipes();
        } else {
            alert("Lỗi: " + await res.text());
        }
    } catch(err) { alert("Lỗi kết nối Server!"); }
}

// --- CÁC HÀM HỖ TRỢ ---
function showAddForm() {
    document.getElementById('recipe-form').reset();
    document.getElementById('recipe-id').value = '';
    document.getElementById('image-preview').style.display = 'none';
    document.getElementById('form-title').innerText = "Thêm công thức mới";
    document.getElementById('recipe-form-container').classList.remove('hidden');
}

async function openEdit(id) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/recipes/${id}`);
        const r = await res.json();
        
        document.getElementById('recipe-id').value = r.id;
        document.getElementById('recipe-title-input').value = r.title;
        document.getElementById('recipe-description-input').value = r.description;
        document.getElementById('recipe-prep-time-input').value = r.prepTime;
        document.getElementById('recipe-servings-input').value = r.servings;
        document.getElementById('recipe-category-input').value = r.category ? r.category.id : "";
        document.getElementById('current-image-path').value = r.image;
        
        // Điền nguyên liệu/cách làm
        if(r.ingredients) document.getElementById('recipe-ingredients-input').value = r.ingredients.map(i => i.name).join('\n');
        if(r.steps) document.getElementById('recipe-instructions-input').value = r.steps.map(s => s.instruction).join('\n'); // Lưu ý: server trả về steps

        // Hiển thị ảnh cũ
        const img = document.getElementById('image-preview');
        if(r.image) {
            img.src = r.image.startsWith('http') ? r.image : `${API_BASE_URL}/uploads/${r.image}`;
            img.style.display = 'block';
            img.classList.remove('hidden');
        } else {
            img.style.display = 'none';
        }

        document.getElementById('form-title').innerText = "Cập nhật công thức";
        document.getElementById('recipe-form-container').classList.remove('hidden');
        document.getElementById('recipe-form-container').scrollIntoView({ behavior: 'smooth' });
    } catch(e) { console.error(e); }
}

async function deleteRecipe(id) {
    if(!confirm("Bạn có chắc muốn xóa?")) return;
    await fetch(`${API_BASE_URL}/api/recipes/${id}`, { method: 'DELETE' });
    loadRecipes();
}
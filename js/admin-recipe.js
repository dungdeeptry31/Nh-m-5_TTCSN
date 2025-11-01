// File: js/admin-recipe.js (PHIÊN BẢN SỬA LỖI HOÀN CHỈNH)

const API_BASE_URL = 'http://localhost:8080'; // Địa chỉ API Backend

document.addEventListener('DOMContentLoaded', () => {
    
    // Lấy các đối tượng DOM
    const tableBody = document.getElementById('recipe-table-body');
    const formContainer = document.getElementById('recipe-form-container');
    const form = document.getElementById('recipe-form');
    const addNewBtn = document.getElementById('add-new-recipe-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const formTitle = document.getElementById('form-title');
    const categorySelect = document.getElementById('recipe-category-input');
    const imagePreview = document.getElementById('image-preview'); // Lấy khung xem trước

    // === HÀM 1: TẢI DANH MỤC (API THẬT) ===
    async function loadCategories() {
        if (!categorySelect) return;
        try {
            const response = await fetch(`${API_BASE_URL}/api/categories`);
            if (!response.ok) throw new Error('Không thể tải danh mục');
            
            const categories = await response.json(); 

            categorySelect.innerHTML = '<option value="">-- Vui lòng chọn --</option>'; 
            
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.innerText = category.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
            categorySelect.innerHTML = '<option value="">-- Lỗi tải danh mục --</option>';
        }
    }
    
    // === HÀM 2: TẢI BẢNG CÔNG THỨC (API PHÂN TRANG) ===
    async function loadRecipeTable() {
        if (!tableBody) return;

        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/recipes?page=0&size=100`); 
            if (!response.ok) throw new Error('Không thể tải dữ liệu');
            
            const recipePage = await response.json();
            const recipes = recipePage.content;
            
            if (recipes.length === 0) {
                 tableBody.innerHTML = `<tr><td colspan="5">Chưa có món ăn nào.</td></tr>`;
                 return;
            }
            
            recipes.forEach(recipe => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${recipe.id}</td>
                    <td><img src="${recipe.image || 'images/default-placeholder.png'}" alt="${recipe.title}" class="table-thumbnail"></td>
                    <td>${recipe.title}</td>
                    <td>${recipe.description}</td>
                    <td class="table-actions">
                        <button class="btn btn-edit" data-id="${recipe.id}">Sửa</button>
                        <button class="btn btn-delete" data-id="${recipe.id}">Xóa</button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
            addTableEventListeners();
        } catch (error) {
            console.error("Lỗi khi tải bảng:", error);
            tableBody.innerHTML = `<tr><td colspan="5">Lỗi tải dữ liệu. Backend có đang chạy?</td></tr>`;
        }
    }

    // === HÀM 3: GẮN SỰ KIỆN SỬA/XÓA ===
    function addTableEventListeners() {
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', (e) => editRecipe(e.target.dataset.id));
        });
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => deleteRecipe(e.target.dataset.id));
        });
    }

    // === HÀM 4: HIỂN THỊ FORM (THÊM MỚI) ===
    function showAddForm() {
        form.reset();
        document.getElementById('recipe-id').value = '';
        formTitle.innerText = "Thêm công thức mới";
        formContainer.classList.remove('hidden');
        
        if (imagePreview) {
            imagePreview.src = "";
            imagePreview.classList.add('hidden');
        }
    }

    // === (SỬA LỖI) HÀM 5: HIỂN THỊ FORM (SỬA) ===
    async function editRecipe(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`);
            if (!response.ok) {
                alert("Lỗi! Không thể tải thông tin chi tiết của món ăn.");
                return;
            }
            const recipe = await response.json();

            // SỬA LỖI "reading 'id'":
            // Backend giờ đã gửi 'category' về
            if (!recipe.category) {
                alert("Lỗi dữ liệu: Món ăn này không có danh mục.");
                return;
            }

            // Điền dữ liệu cơ bản
            document.getElementById('recipe-id').value = recipe.id;
            document.getElementById('recipe-title-input').value = recipe.title;
            document.getElementById('recipe-description-input').value = recipe.description;
            document.getElementById('recipe-prep-time-input').value = recipe.prepTime;
            document.getElementById('recipe-servings-input').value = recipe.servings;
            document.getElementById('recipe-category-input').value = recipe.category.id;

            // SỬA LỖI "HÌNH ẢNH KHÔNG HIỆN":
            const imageInput = document.getElementById('recipe-image-input');
            if (imageInput.type === 'text') {
                 // Nếu là input link, điền link
                 imageInput.value = recipe.image;
            } else if (imagePreview) {
                // Nếu là input file, hiện ảnh preview
                imagePreview.src = recipe.image;
                imagePreview.classList.remove('hidden');
            }

            // SỬA LỖI: Điền dữ liệu cho Ingredients
            if (recipe.recipeIngredients && recipe.recipeIngredients.length > 0) {
                const ingredientText = recipe.recipeIngredients.map(item => {
                    return `${item.note || ''} ${item.ingredient.name}`;
                }).join('\n');
                document.getElementById('recipe-ingredients-input').value = ingredientText;
            } else {
                document.getElementById('recipe-ingredients-input').value = "";
            }
            
            // SỬA LỖI: Điền dữ liệu cho Instructions
            if (recipe.recipeSteps && recipe.recipeSteps.length > 0) {
                recipe.recipeSteps.sort((a, b) => a.stepNumber - b.stepNumber);
                const instructionText = recipe.recipeSteps.map(step => step.description).join('\n');
                document.getElementById('recipe-instructions-input').value = instructionText;
            } else {
                document.getElementById('recipe-instructions-input').value = "";
            }
            
            formTitle.innerText = `Sửa công thức (ID: ${recipe.id})`;
            formContainer.classList.remove('hidden');
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết món ăn:", error);
            alert("Lỗi khi tải chi tiết: " + error.message);
        }
    }

    // === HÀM 6: XÓA CÔNG THỨC (API THẬT) ===
    async function deleteRecipe(id) {
        if (confirm(`Bạn có chắc muốn xóa món ăn ID: ${id} không?`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    alert('Xóa thành công!');
                    loadRecipeTable();
                } else {
                    const error = await response.text();
                    alert(`Lỗi khi xóa: ${error}`);
                }
            } catch (error) {
                console.error("Lỗi khi xóa:", error);
                alert("Lỗi kết nối khi xóa.");
            }
        }
    }

    // === HÀM 7: SUBMIT FORM (LƯU) ===
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const id = document.getElementById('recipe-id').value;
            const categoryId = document.getElementById('recipe-category-input').value;
            
            if (!categoryId) {
                alert("Vui lòng chọn một danh mục!");
                return;
            }

            const ingredients = document.getElementById('recipe-ingredients-input').value.split('\n').filter(line => line.trim() !== '');
            const instructions = document.getElementById('recipe-instructions-input').value.split('\n').filter(line => line.trim() !== '');

            // CHÚ Ý: Code này chỉ xử lý input dạng TEXT (link ảnh)
            // Nếu bạn dùng <input type="file">, chúng ta phải viết lại toàn bộ hàm này
            const imageInput = document.getElementById('recipe-image-input');
            let imageUrl = "images/default-placeholder.png"; // Ảnh mặc định

            if (imageInput.type === 'text') {
                imageUrl = imageInput.value || imageUrl;
            }
            // (Chúng ta chưa xử lý upload file thật)

            const recipeData = {
                title: document.getElementById('recipe-title-input').value,
                description: document.getElementById('recipe-description-input').value,
                image: imageUrl, 
                prepTime: document.getElementById('recipe-prep-time-input').value,
                cookTime: "N/A",
                servings: document.getElementById('recipe-servings-input').value,
                categoryId: parseInt(categoryId),
                ingredients: ingredients,
                instructions: instructions
            };

            let url = `${API_BASE_URL}/api/recipes`;
            let method = 'POST';
            if (id) {
                url = `${API_BASE_URL}/api/recipes/${id}`;
                method = 'PUT';
            }

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(recipeData)
                });
                if (response.ok) {
                    alert('Lưu thành công!');
                    formContainer.classList.add('hidden');
                    loadRecipeTable();
                } else {
                    const error = await response.text();
                    alert(`Lỗi khi lưu: ${error}`);
                }
            } catch (error) {
                console.error("Lỗi khi lưu:", error);
                alert("Lỗi kết nối khi lưu.");
            }
        });
    }

    // === GỌI HÀM KHI TẢI TRANG ===
    loadCategories();
    loadRecipeTable();
    
    if (addNewBtn) addNewBtn.addEventListener('click', showAddForm);
    if (cancelBtn) cancelBtn.addEventListener('click', () => formContainer.classList.add('hidden'));

    // (Code logic xem trước ảnh, nếu bạn dùng input 'file')
    const imageInput = document.getElementById('recipe-image-input');
    if (imagePreview && imageInput && imageInput.type === 'file') {
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreview.classList.remove('hidden');
                }
                reader.readAsDataURL(file);
            } else {
                imagePreview.src = "";
                imagePreview.classList.add('hidden');
            }
        });
    }
});
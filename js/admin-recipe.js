// File: js/admin-recipe.js

// Dùng chung dữ liệu giả từ `recipe-detail.js`
const mockRecipeFull = [
    {
        id: 1,
        title: "Gà Nướng Mật Ong",
        description: "Món gà nướng thơm lừng, da giòn, thịt mềm.",
        image: "https://images.unsplash.com/photo-1598511757132-00356618e7d2?w=500",
        prepTime: "60 phút",
        servings: "4 người",
        ingredients: [
            "1 con gà (khoảng 1.2kg)",
            "3 muỗng canh mật ong",
            "2 muỗng canh nước tương"
        ],
        instructions: [
            "Gà làm sạch, để ráo.",
            "Trộn đều tất cả nguyên liệu ướp.",
            "Cho gà vào lò, nướng trong 45-60 phút."
        ]
    },
    {
        id: 2,
        title: "Cá Hồi Áp Chảo Sốt Bơ Tỏi",
        description: "Món ăn Tây sang trọng, giàu dinh dưỡng.",
        image: "https://images.unsplash.com/photo-1541795771680-bddf9191e3b1?w=500",
        prepTime: "20 phút",
        servings: "2 người",
        ingredients: [
            "2 miếng phi lê cá hồi (còn da)",
            "2 muỗng canh bơ lạt",
            "3 tép tỏi băm nhuyễn"
        ],
        instructions: [
            "Cá hồi rửa sạch, thấm khô. Ướp 2 mặt cá.",
            "Làm nóng chảo. Đặt mặt da cá xuống áp chảo.",
            "Rưới sốt bơ tỏi lên cá."
        ]
    },
    // (Bạn có thể thêm các món khác vào đây)
];

document.addEventListener('DOMContentLoaded', () => {
    
    // Lấy các đối tượng DOM
    const tableBody = document.getElementById('recipe-table-body');
    const formContainer = document.getElementById('recipe-form-container');
    const form = document.getElementById('recipe-form');
    const addNewBtn = document.getElementById('add-new-recipe-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const formTitle = document.getElementById('form-title');

    // Hàm 1: Tải dữ liệu vào bảng
    function loadRecipeTable() {
        if (!tableBody) return; // Thoát nếu không phải trang này
        tableBody.innerHTML = ''; // Xóa bảng cũ
        
        mockRecipeFull.forEach(recipe => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${recipe.id}</td>
                <td><img src="${recipe.image}" alt="${recipe.title}" class="table-thumbnail"></td>
                <td>${recipe.title}</td>
                <td>${recipe.description}</td>
                <td class="table-actions">
                    <button class="btn btn-edit" data-id="${recipe.id}">Sửa</button>
                    <button class="btn btn-delete" data-id="${recipe.id}">Xóa</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        // Thêm sự kiện cho các nút Sửa/Xóa
        addTableEventListeners();
    }

    // Hàm 2: Thêm sự kiện cho nút Sửa/Xóa
    function addTableEventListeners() {
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                editRecipe(id);
            });
        });
        
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                deleteRecipe(id);
            });
        });
    }

    // Hàm 3: Hiển thị form (cho Thêm mới)
    function showAddForm() {
        form.reset(); // Xóa trắng form
        document.getElementById('recipe-id').value = ''; // Xóa ID ẩn
        formTitle.innerText = "Thêm công thức mới";
        formContainer.classList.remove('hidden');
    }

    // Hàm 4: Hiển thị form (cho Chỉnh sửa)
    function editRecipe(id) {
        // Tìm công thức trong dữ liệu giả
        const recipe = mockRecipeFull.find(r => r.id == id);
        if (!recipe) return;
        
        // Điền dữ liệu vào form
        document.getElementById('recipe-id').value = recipe.id;
        document.getElementById('recipe-title-input').value = recipe.title;
        document.getElementById('recipe-description-input').value = recipe.description;
        document.getElementById('recipe-image-input').value = recipe.image;
        document.getElementById('recipe-prep-time-input').value = recipe.prepTime;
        document.getElementById('recipe-servings-input').value = recipe.servings;
        // Chuyển mảng thành text, mỗi phần tử 1 dòng
        document.getElementById('recipe-ingredients-input').value = recipe.ingredients.join('\n');
        document.getElementById('recipe-instructions-input').value = recipe.instructions.join('\n');
        
        // Hiển thị form
        formTitle.innerText = `Sửa công thức (ID: ${recipe.id})`;
        formContainer.classList.remove('hidden');
    }

    // Hàm 5: Xóa công thức (Giả lập)
    function deleteRecipe(id) {
        if (confirm(`Bạn có chắc muốn xóa món ăn ID: ${id} không?`)) {
            // Tìm vị trí của món ăn trong mảng
            const index = mockRecipeFull.findIndex(r => r.id == id);
            if (index > -1) {
                mockRecipeFull.splice(index, 1); // Xóa khỏi mảng
            }
            loadRecipeTable(); // Tải lại bảng
        }
    }
    
    // Kiểm tra xem các phần tử có tồn tại không trước khi gán sự kiện
    if(form) {
        // Hàm 6: Xử lý khi submit form (Lưu)
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Ngăn tải lại trang
            
            const id = document.getElementById('recipe-id').value;
            
            // Chuyển text (mỗi dòng 1) về mảng
            const ingredients = document.getElementById('recipe-ingredients-input').value.split('\n');
            const instructions = document.getElementById('recipe-instructions-input').value.split('\n');

            // Tạo đối tượng công thức mới
            const formData = {
                id: id ? parseInt(id) : Date.now(), // Nếu có ID thì giữ nguyên, không thì tạo ID mới
                title: document.getElementById('recipe-title-input').value,
                description: document.getElementById('recipe-description-input').value,
                image: document.getElementById('recipe-image-input').value,
                prepTime: document.getElementById('recipe-prep-time-input').value,
                servings: document.getElementById('recipe-servings-input').value,
                ingredients: ingredients,
                instructions: instructions
            };

            if (id) {
                // Chế độ Sửa: Tìm và thay thế
                const index = mockRecipeFull.findIndex(r => r.id == id);
                if (index > -1) {
                    mockRecipeFull[index] = formData;
                }
            } else {
                // Chế độ Thêm mới: Thêm vào mảng
                mockRecipeFull.push(formData);
            }

            formContainer.classList.add('hidden'); // Ẩn form
            loadRecipeTable(); // Tải lại bảng
        });
    }

    // === GỌI HÀM & GÁN SỰ KIỆN ===
    
    // 1. Tải bảng lần đầu
    loadRecipeTable();

    // 2. Bấm nút "Thêm món mới"
    if(addNewBtn) {
        addNewBtn.addEventListener('click', showAddForm);
    }

    // 3. Bấm nút "Hủy" trên form
    if(cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            formContainer.classList.add('hidden');
        });
    }
});
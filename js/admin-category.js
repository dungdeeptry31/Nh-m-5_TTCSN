// File: js/admin-category.js

const mockCategories = [
    { id: 1, name: "Món Chiên", image: "https://images.unsplash.com/photo-1599043513900-ed1e001c6868?w=300&auto=format&fit=crop" },
    { id: 2, name: "Món Xào", image: "https://images.unsplash.com/photo-1512423527246-01a6b0c2a7e7?w=300&auto=format&fit=crop" },
    { id: 3, name: "Món Canh", image: "https://images.unsplash.com/photo-1628113888361-56740b3c66f5?w=300&auto=format&fit=crop" },
    { id: 4, name: "Món Nướng", image: "https://images.unsplash.com/photo-1598511757132-00356618e7d2?w=300&auto=format&fit=crop" },
    { id: 5, name: "Món Lẩu", image: "https://plus.unsplash.com/premium_photo-1673830252112-715f53f1911a?w=300&auto=format&fit=crop" },
    { id: 6, name: "Món Chay", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&auto=format&fit=crop" }
];

document.addEventListener('DOMContentLoaded', () => {

    const tableBody = document.getElementById('category-table-body');
    const formContainer = document.getElementById('category-form-container');
    const form = document.getElementById('category-form');
    const addNewBtn = document.getElementById('add-new-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const formTitle = document.getElementById('form-title');

    function loadCategoryTable() {
        if (!tableBody) return;
        tableBody.innerHTML = ''; 

        mockCategories.forEach(category => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${category.id}</td>
                <td><img src="${category.image}" alt="${category.name}" class="table-thumbnail"></td>
                <td>${category.name}</td>
                <td class="table-actions">
                    <button class="btn btn-edit" data-id="${category.id}">Sửa</button>
                    <button class="btn btn-delete" data-id="${category.id}">Xóa</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        addTableEventListeners();
    }

    function addTableEventListeners() {
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', (e) => editCategory(e.target.dataset.id));
        });
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => deleteCategory(e.target.dataset.id));
        });
    }

    function showAddForm() {
        form.reset();
        document.getElementById('category-id').value = '';
        formTitle.innerText = "Thêm danh mục mới";
        formContainer.classList.remove('hidden');
    }

    function editCategory(id) {
        const category = mockCategories.find(c => c.id == id);
        if (!category) return;

        document.getElementById('category-id').value = category.id;
        document.getElementById('category-name-input').value = category.name;
        document.getElementById('category-image-input').value = category.image;
        
        formTitle.innerText = `Sửa danh mục (ID: ${category.id})`;
        formContainer.classList.remove('hidden');
    }

    function deleteCategory(id) {
        if (confirm(`Bạn có chắc muốn xóa danh mục ID: ${id} không?`)) {
            const index = mockCategories.findIndex(c => c.id == id);
            if (index > -1) {
                mockCategories.splice(index, 1);
            }
            loadCategoryTable();
        }
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('category-id').value;
            const formData = {
                id: id ? parseInt(id) : Date.now(),
                name: document.getElementById('category-name-input').value,
                image: document.getElementById('category-image-input').value
            };

            if (id) {
                const index = mockCategories.findIndex(c => c.id == id);
                if (index > -1) mockCategories[index] = formData;
            } else {
                mockCategories.push(formData);
            }
            formContainer.classList.add('hidden');
            loadCategoryTable();
        });
    }

    loadCategoryTable();

    if (addNewBtn) addNewBtn.addEventListener('click', showAddForm);
    if (cancelBtn) cancelBtn.addEventListener('click', () => formContainer.classList.add('hidden'));
});
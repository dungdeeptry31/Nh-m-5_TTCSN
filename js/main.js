// File: js/main.js (PHIÊN BẢN KẾT NỐI API THẬT)

document.addEventListener('DOMContentLoaded', function() {
    
    const recipeContainer = document.getElementById('recipe-list-container');
    const categoryContainer = document.getElementById('category-list-container');

    // === (GIỮ LẠI) DỮ LIỆU GIẢ CHO DANH MỤC ===
    // (Vì chúng ta chưa làm API "GET /api/categories")
    const mockCategories = [
        { name: "Món Chiên", image: "images/monchien.jpg" }, // Nhớ sửa lại tên ảnh cho đúng
        { name: "Món Xào", image: "images/moxao.webp" },
        { name: "Món Canh", image: "images/moncanh.jpg" },
        { name: "Món Nướng", image: "images/monnuong.webp" },
        { name: "Món Lẩu", image: "images/monlau.webp" },
        { name: "Món Chay", image: "images/monchay.jpg" }
    ];

    // === (MỚI) HÀM GỌI API LẤY CÔNG THỨC THẬT ===
    async function fetchRecipesFromBackend() {
        if (!recipeContainer) return;
        
        try {
            // Chỉ lấy 6 món ăn mới nhất (trang 0, kích thước 6)
            const response = await fetch('http://localhost:8080/api/recipes?page=0&size=6');
            if (!response.ok) throw new Error('Không thể tải công thức từ backend');
            
            const recipePage = await response.json(); // Lấy dữ liệu dạng Page
            const realRecipes = recipePage.content; // Mảng công thức nằm trong .content
            
            if (realRecipes.length === 0) {
                 recipeContainer.innerHTML = "<p>Chưa có công thức nào. Vui lòng thêm ở trang Admin.</p>";
                 return;
            }
            displayRecipes(realRecipes); // Dùng dữ liệu thật để "vẽ"
            
        } catch (error) {
            console.error("Lỗi khi tải công thức:", error);
            recipeContainer.innerHTML = "<p>Lỗi kết nối đến server. Backend có đang chạy?</p>";
        }
    }

    // === CÁC HÀM HIỂN THỊ ===

    // (Giữ nguyên) Hàm hiển thị Danh mục
    function displayCategories(categories) {
        if (!categoryContainer) return;
        categoryContainer.innerHTML = '';
        
        categories.forEach(category => {
            const categoryCardHTML = `
                <div class="category-card" onclick="location.href='search.html?category=${category.name}'">
                    <img src="${category.image}" alt="${category.name}">
                    <div class="category-title">${category.name}</div>
                </div>
            `;
            categoryContainer.innerHTML += categoryCardHTML;
        });
    }

    // (Giữ nguyên) Hàm này giờ sẽ nhận dữ liệu THẬT từ CSDL
    function displayRecipes(recipes) {
        recipeContainer.innerHTML = '';
        const userLoggedIn = isLoggedIn(); // Từ auth.js

        recipes.forEach(recipe => {
            const favoriteButtonHTML = userLoggedIn ? 
                `<div class="favorite-icon" data-recipe-id="${recipe.id}">&hearts;</div>` : '';
            
            // Dùng các trường từ CSDL (ví dụ: recipe.title, recipe.image)
            const recipeCardHTML = `
                <div class="recipe-card">
                    ${favoriteButtonHTML}
                    <a href="recipe-detail.html?id=${recipe.id}">
                        <img src="${recipe.image || 'https://via.placeholder.com/300x180'}" alt="${recipe.title}">
                        <h3>${recipe.title}</h3>
                        <p>${recipe.description}</p>
                    </a>
                </div>
            `;
            recipeContainer.innerHTML += recipeCardHTML;
        });

        if (userLoggedIn) { addFavoriteClickEvents(); }
    }

    // (Giữ nguyên) Hàm xử lý click Yêu thích
    function addFavoriteClickEvents() {
        document.querySelectorAll('.favorite-icon').forEach(icon => {
            icon.addEventListener('click', function(e) {
                e.stopPropagation(); 
                this.classList.toggle('favorited');
                console.log("Clicked favorite on recipe ID: " + this.dataset.recipeId);
            });
        });
    }

    // === GỌI HÀM KHI TẢI TRANG ===
    displayCategories(mockCategories); // Vẫn dùng data giả
    fetchRecipesFromBackend(); // (MỚI) Dùng API thật
});
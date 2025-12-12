// File: js/search.js
const API_BASE_URL = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Lấy tham số từ URL hiện tại
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get('categoryId');
    const keyword = params.get('keyword'); 

    // Lấy các thẻ HTML hiển thị kết quả
    const pageTitle = document.getElementById('page-title');
    const resultCount = document.getElementById('result-count');

    // 2. Logic hiển thị dữ liệu ban đầu
    if (categoryId) {
        await loadRecipesByCategory(categoryId);
    } else if (keyword) {
        if(pageTitle) pageTitle.innerText = `Kết quả tìm kiếm: "${keyword}"`;
        // Đổ lại từ khóa vào ô input để người dùng biết mình đang tìm gì
        const headerInput = document.querySelector('.search-bar input');
        if(headerInput) headerInput.value = keyword;
        
        await searchRecipesByKeyword(keyword);
    } else {
        if(pageTitle) pageTitle.innerText = "Tất cả món ăn";
        loadAllRecipes();
    }

    // --- 3. (MỚI) KÍCH HOẠT THANH TÌM KIẾM TRÊN HEADER ---
    // Đoạn này giúp bạn tìm kiếm tiếp khi đang ở trang search.html
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');

    if (searchInput && searchBtn) {
        function handleHeaderSearch() {
            const newKeyword = searchInput.value.trim();
            if (newKeyword) {
                // Load lại trang hiện tại với từ khóa mới
                window.location.href = `search.html?keyword=${encodeURIComponent(newKeyword)}`;
            } else {
                alert("Vui lòng nhập tên món ăn!");
            }
        }

        // Sự kiện Click nút Tìm
        searchBtn.addEventListener('click', handleHeaderSearch);

        // Sự kiện Enter trong ô input
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                handleHeaderSearch();
            }
        });
    }
});

// --- CÁC HÀM API (GIỮ NGUYÊN) ---

// 1. Lọc theo danh mục
async function loadRecipesByCategory(catId) {
    const pageTitle = document.getElementById('page-title');
    const resultCount = document.getElementById('result-count');
    const container = document.getElementById('recipe-list-container');

    try {
        const res = await fetch(`${API_BASE_URL}/api/recipes/category/${catId}`);
        if (!res.ok) throw new Error("Lỗi tải dữ liệu");
        
        const recipes = await res.json();
        
        if (recipes.length > 0) {
            const catName = recipes[0].category ? recipes[0].category.name : "Danh mục";
            if(pageTitle) pageTitle.innerText = `Món ngon: ${catName}`;
            if(resultCount) resultCount.innerText = `Tìm thấy ${recipes.length} công thức`;
        } else {
            if(pageTitle) pageTitle.innerText = "Danh mục này chưa có món ăn";
            if(resultCount) resultCount.innerText = "";
        }
        displayRecipes(recipes);

    } catch (err) {
        console.error(err);
        if(container) container.innerHTML = "<p class='no-result'>Lỗi kết nối Server!</p>";
    }
}

// 2. Tìm kiếm theo tên
async function searchRecipesByKeyword(keyword) {
    const resultCount = document.getElementById('result-count');
    const container = document.getElementById('recipe-list-container');

    try {
        const res = await fetch(`${API_BASE_URL}/api/recipes/search?keyword=${encodeURIComponent(keyword)}`);
        if (!res.ok) throw new Error("Lỗi tìm kiếm");
        
        const recipes = await res.json();
        
        if(resultCount) resultCount.innerText = `Tìm thấy ${recipes.length} kết quả`;
        displayRecipes(recipes);

    } catch (err) {
        console.error(err);
        if(container) container.innerHTML = "<p class='no-result'>Lỗi kết nối hoặc không tìm thấy!</p>";
    }
}

// 3. Lấy tất cả
async function loadAllRecipes() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/recipes?page=0&size=20`);
        const data = await res.json();
        displayRecipes(data.content);
    } catch(e) { console.error(e); }
}

// 4. Hiển thị ra HTML
function displayRecipes(recipes) {
    const container = document.getElementById('recipe-list-container');
    if(!container) return;
    
    container.innerHTML = '';

    if (recipes.length === 0) {
        container.innerHTML = "<p class='no-result'>Không tìm thấy món ăn nào phù hợp.</p>";
        return;
    }

    recipes.forEach(recipe => {
        let imgUrl = 'https://via.placeholder.com/300x200?text=No+Img';
        if (recipe.image) {
            if (recipe.image.startsWith('http')) {
                imgUrl = recipe.image;
            } else {
                imgUrl = `${API_BASE_URL}/uploads/${recipe.image}`;
            }
        }

        const card = `
            <div class="recipe-card" onclick="location.href='recipe-detail.html?id=${recipe.id}'" style="
                background: white; 
                border-radius: 12px; 
                overflow: hidden; 
                box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
                cursor: pointer; 
                transition: transform 0.3s;">
                
                <img src="${imgUrl}" 
                     alt="${recipe.title}" 
                     style="width: 100%; height: 200px; object-fit: cover;"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Error';">
                
                <div style="padding: 15px;">
                    <h3 style="margin: 0 0 10px; color: #333; font-size: 18px;">${recipe.title}</h3>
                    <p style="color: #666; font-size: 14px; margin: 0;">
                        ${recipe.description ? recipe.description.substring(0, 50) + '...' : 'Món ăn ngon...'}
                    </p>
                    <div style="margin-top: 10px; font-size: 13px; color: #888;">
                        ⏱ ${recipe.prepTime || '30p'} &nbsp; | &nbsp; 👤 ${recipe.servings || '2'} người
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}
// File: js/main.js

const API_BASE_URL = 'http://localhost:8080'; 

document.addEventListener('DOMContentLoaded', function() {
    
    const recipeContainer = document.getElementById('recipe-list-container');
    const categoryContainer = document.getElementById('category-list-container');

    // --- 1. LẤY DANH MỤC TỪ SERVER ---
    async function fetchCategories() {
        if (!categoryContainer) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/categories`);
            if (!response.ok) throw new Error('Không thể tải danh mục');
            
            const categories = await response.json();
            
            if (categories.length === 0) {
                categoryContainer.innerHTML = "<p style='width:100%; text-align:center; color:#666;'>Chưa có danh mục nào.</p>";
                return;
            }
            displayCategories(categories);
            
        } catch (error) {
            console.error("Lỗi tải danh mục:", error);
            displayCategories([
                { id: 0, name: "Món Mẫu", image: "https://via.placeholder.com/150" }
            ]);
        }
    }

    // --- 2. HIỂN THỊ DANH MỤC ---
    function displayCategories(categories) {
        categoryContainer.innerHTML = '';
        
        categories.forEach(category => {
            let catImg = 'https://via.placeholder.com/150?text=No+Img';
            if (category.image) {
                if (category.image.startsWith('http')) {
                    catImg = category.image;
                } else {
                    catImg = `${API_BASE_URL}/uploads/${category.image}`;
                }
            }

            const categoryCardHTML = `
                <div class="category-card" onclick="location.href='search.html?categoryId=${category.id}'" style="cursor: pointer;">
                    <img src="${catImg}" 
                         alt="${category.name}"
                         style="object-fit: cover; height: 150px; width: 100%;"
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/150?text=Error';">
                    <div class="category-title">${category.name}</div>
                </div>
            `;
            categoryContainer.innerHTML += categoryCardHTML;
        });
    }

    // --- 3. LẤY CÔNG THỨC TỪ SERVER ---
    async function fetchRecipesFromBackend() {
        if (!recipeContainer) return;
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/recipes?page=0&size=12`);
            
            if (!response.ok) throw new Error('Không thể tải công thức');
            
            const recipePage = await response.json(); 
            const realRecipes = recipePage.content;
            
            if (realRecipes.length === 0) {
                 recipeContainer.innerHTML = "<p style='text-align:center; width:100%; color:#666;'>Chưa có công thức nào.</p>";
                 return;
            }
            displayRecipes(realRecipes);
            
        } catch (error) {
            console.error("Lỗi:", error);
            recipeContainer.innerHTML = "<p style='text-align:center; width:100%; color:red;'>Lỗi kết nối Server.</p>";
        }
    }

    // --- 4. HIỂN THỊ MÓN ĂN ---
    function displayRecipes(recipes) {
        recipeContainer.innerHTML = '';
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const userLoggedIn = user && user.email;

        recipes.forEach(recipe => {
            const favoriteButtonHTML = userLoggedIn ? 
                `<div class="favorite-icon" data-recipe-id="${recipe.id}">&hearts;</div>` : '';
            
            let imageUrl = 'https://via.placeholder.com/300x200?text=No+Image';
            
            if (recipe.image) {
                if (recipe.image.startsWith('http')) {
                    imageUrl = recipe.image; 
                } else {
                    imageUrl = `${API_BASE_URL}/uploads/${recipe.image}`; 
                }
            }
            
            const recipeCardHTML = `
                <div class="recipe-card">
                    ${favoriteButtonHTML}
                    <a href="recipe-detail.html?id=${recipe.id}" style="text-decoration:none; color:inherit;">
                        <img src="${imageUrl}" 
                             alt="${recipe.title}" 
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Error';">
                        
                        <h3>${recipe.title}</h3>
                        <p>${recipe.description ? recipe.description.substring(0, 60) + '...' : 'Món ngon...'}</p>
                    </a>
                </div>
            `;
            recipeContainer.innerHTML += recipeCardHTML;
        });

        if (userLoggedIn) { 
            addFavoriteClickEvents(user.email); 
        }
    }

    // --- 5. XỬ LÝ CLICK TIM ---
    function addFavoriteClickEvents(email) {
        document.querySelectorAll('.favorite-icon').forEach(icon => {
            icon.addEventListener('click', async function(e) {
                e.stopPropagation(); 
                const recipeId = this.dataset.recipeId;
                const isFavorited = this.classList.contains('favorited');
                const action = isFavorited ? 'remove' : 'add'; 

                try {
                    const res = await fetch(`${API_BASE_URL}/api/favorites/${action}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email, recipeId: parseInt(recipeId) })
                    });

                    if (res.ok) {
                        this.classList.toggle('favorited'); 
                        if (isFavorited) {
                             this.style.color = '#ccc'; 
                        } else {
                             this.style.color = 'var(--primary-color)'; 
                        }
                    } else {
                        alert("Lỗi thao tác!");
                    }
                } catch (err) { console.error(err); }
            });
        });
    }

    // --- 6. XỬ LÝ THANH TÌM KIẾM (ĐÃ ĐƯA VÀO TRONG) ---
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');

    if (searchInput && searchBtn) {
        function handleSearch() {
            const keyword = searchInput.value.trim();
            if (keyword) {
                window.location.href = `search.html?keyword=${encodeURIComponent(keyword)}`;
            } else {
                alert("Vui lòng nhập tên món ăn!");
            }
        }

        searchBtn.addEventListener('click', handleSearch);

        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }

    // === CHẠY ===
    fetchCategories(); 
    fetchRecipesFromBackend(); 
});
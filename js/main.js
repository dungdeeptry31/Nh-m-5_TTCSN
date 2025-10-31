// File: js/main.js (DÙNG DỮ LIỆU GIẢ)

document.addEventListener('DOMContentLoaded', function() {
    
    const recipeContainer = document.getElementById('recipe-list-container');
    const categoryContainer = document.getElementById('category-list-container');

    // === DỮ LIỆU GIẢ (MOCK DATA) ===
    const mockCategories = [
        { name: "Món Chiên", image: "https://images.unsplash.com/photo-1599043513900-ed1e001c6868?w=200&auto=format&fit=crop" },
        { name: "Món Xào", image: "https://images.unsplash.com/photo-1512423527246-01a6b0c2a7e7?w=200&auto=format&fit=crop" },
        { name: "Món Canh", image: "https://images.unsplash.com/photo-1628113888361-56740b3c66f5?w=200&auto=format&fit=crop" },
        { name: "Món Nướng", image: "https://images.unsplash.com/photo-1598511757132-00356618e7d2?w=200&auto=format&fit=crop" },
        { name: "Món Lẩu", image: "https://plus.unsplash.com/premium_photo-1673830252112-715f53f1911a?w=200&auto=format&fit=crop" },
        { name: "Món Chay", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&auto=format&fit=crop" }
    ];

    const mockRecipes = [
        {
            id: 1,
            title: "Gà Nướng Mật Ong",
            description: "Món gà nướng thơm lừng, da giòn, thịt mềm.",
            image: "https://images.unsplash.com/photo-1598511757132-00356618e7d2?w=500&auto=format&fit=crop"
        },
        {
            id: 2,
            title: "Cá Hồi Áp Chảo Sốt Bơ Tỏi",
            description: "Món ăn Tây sang trọng, giàu dinh dưỡng và dễ làm.",
            image: "https://images.unsplash.com/photo-1541795771680-bddf9191e3b1?w=500&auto=format&fit=crop"
        },
        {
            id: 3,
            title: "Rau Xào Thập Cẩm",
            description: "Món xào nhanh gọn, thanh đạm và đầy đủ vitamin.",
            image: "https://images.unsplash.com/photo-1512423527246-01a6b0c2a7e7?w=500&auto=format&fit=crop"
        },
        {
            id: 4,
            title: "Bò Lúc Lắc Khoai Tây",
            description: "Thịt bò mềm mọng, đậm vị, ăn kèm khoai tây chiên.",
            image: "https://images.unsplash.com/photo-1594041682736-0f83c6788e0b?w=500&auto=format&fit=crop"
        },
        {
            id: 5,
            title: "Phở Bò Hà Nội",
            description: "Hương vị truyền thống của phở bò, nước dùng trong.",
            image: "https://images.unsplash.com/photo-1589304017356-6d00424597d8?w=500&auto=format&fit=crop"
        },
        {
            id: 6,
            title: "Salad Ức Gà Giảm Cân",
            description: "Bữa ăn lành mạnh, tươi mát với ức gà áp chảo.",
            image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop"
        }
    ];

    // === CÁC HÀM HIỂN THỊ ===

    // (MỚI) Hàm hiển thị Danh mục
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

    // Hàm hiển thị Công thức
    function displayRecipes(recipes) {
        if (!recipeContainer) return;
        recipeContainer.innerHTML = '';
        const userLoggedIn = isLoggedIn(); // Từ auth.js

        recipes.forEach(recipe => {
            const favoriteButtonHTML = userLoggedIn ? 
                `<div class="favorite-icon" data-recipe-id="${recipe.id}">&hearts;</div>` : '';
            
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
    displayCategories(mockCategories);
    displayRecipes(mockRecipes);
});
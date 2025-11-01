// File: js/recipe-detail.js (PHIÊN BẢN KẾT NỐI API THẬT)

// Dữ liệu giả (mockRecipeFull) đã bị XÓA

document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Lấy ID từ URL
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id');

    if (!recipeId) {
        displayError("Không tìm thấy món ăn!");
        return;
    }

    // 2. Gọi API Backend (Java) để lấy chi tiết 1 món ăn
    try {
        const response = await fetch(`http://localhost:8080/api/recipes/${recipeId}`);
        if (!response.ok) {
            throw new Error('Không tìm thấy công thức hoặc Backend bị lỗi.');
        }
        
        const recipe = await response.json(); // Lấy dữ liệu thật
        
        // 3. Nếu tìm thấy, "nhồi" dữ liệu vào HTML
        displayRecipeDetails(recipe);

        // 4. (GIỮ NGUYÊN) Logic Nút Yêu Thích (từ bước trước)
        // (Chúng ta phải đặt nó ở đây, SAU KHI đã lấy được recipe)
        if (typeof isLoggedIn === 'function' && isLoggedIn()) { 
            const favButton = document.getElementById('favorite-btn');
            
            if(favButton) {
                favButton.classList.remove('hidden');
                
                // TODO: Sau này, chúng ta cần gọi API /api/favorites/check
                // để xem user đã "like" món này từ trước chưa.
                // Tạm thời, vẫn giả lập là "chưa like".
                let isFavorited = false; 
                
                favButton.addEventListener('click', () => {
                    isFavorited = !isFavorited;
                    
                    if (isFavorited) {
                        favButton.classList.add('active');
                        favButton.innerHTML = '❤️ Đã lưu vào yêu thích';
                        // TODO: Gọi API POST /api/favorites/add
                        console.log(`(API Thật) Sẽ gọi POST /api/favorites/add với ID: ${recipe.id}`);
                    } else {
                        favButton.classList.remove('active');
                        favButton.innerHTML = '♡ Thêm vào yêu thích';
                         // TODO: Gọi API POST /api/favorites/remove
                        console.log(`(API Thật) Sẽ gọi POST /api/favorites/remove với ID: ${recipe.id}`);
                    }
                });
            }
        }
        
    } catch (error) {
        console.error("Lỗi khi tải chi tiết món ăn:", error);
        displayError(error.message);
    }
});


/**
 * Hàm hiển thị chi tiết công thức
 * (Sửa lại để đọc dữ liệu từ API)
 */
function displayRecipeDetails(recipe) {
    // Cập nhật tiêu đề trang
    document.title = recipe.title;

    // Nhồi dữ liệu cơ bản (tên trường phải khớp với Entity Java)
    document.getElementById('recipe-title').innerText = recipe.title;
    document.getElementById('recipe-image').src = recipe.image;
    document.getElementById('recipe-image').alt = recipe.title;
    document.getElementById('recipe-description').innerText = recipe.description;
    document.getElementById('recipe-prep-time').innerText = `Thời gian: ${recipe.prepTime}`;
    document.getElementById('recipe-servings').innerText = `Khẩu phần: ${recipe.servings}`;

    // Nhồi danh sách Nguyên liệu
    // (Lưu ý: API GET /api/recipes/{id} phải trả về cả recipeIngredients)
    const ingredientsList = document.getElementById('recipe-ingredients-list');
    ingredientsList.innerHTML = '';
    
    // (Kiểm tra xem backend có trả về recipeIngredients không)
    if (recipe.recipeIngredients && recipe.recipeIngredients.length > 0) {
        recipe.recipeIngredients.forEach(item => {
            const li = document.createElement('li');
            // Ghép Note (vd: "1kg") + Tên (vd: "Thịt bò")
            li.innerText = `${item.note || ''} ${item.ingredient.name}`;
            ingredientsList.appendChild(li);
        });
    } else {
        ingredientsList.innerHTML = '<li>(Chưa cập nhật nguyên liệu)</li>';
    }


    // Nhồi danh sách Hướng dẫn
    const instructionsList = document.getElementById('recipe-instructions-list');
    instructionsList.innerHTML = '';
    
    // (Kiểm tra xem backend có trả về recipeSteps không)
    if (recipe.recipeSteps && recipe.recipeSteps.length > 0) {
        // Sắp xếp các bước theo đúng thứ tự
        recipe.recipeSteps.sort((a, b) => a.stepNumber - b.stepNumber);
        
        recipe.recipeSteps.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item.description;
            instructionsList.appendChild(li);
        });
    } else {
         instructionsList.innerHTML = '<li>(Chưa cập nhật hướng dẫn)</li>';
    }
}

/**
 * Hàm hiển thị lỗi (Giữ nguyên)
 */
function displayError(message) {
    document.getElementById('recipe-title').innerText = "Lỗi";
    document.getElementById('recipe-description').innerText = `Không thể tải món ăn. (${message})`;
    
    const meta = document.querySelector('.recipe-meta');
    const image = document.querySelector('.recipe-hero-image');
    const content = document.querySelector('.recipe-content');
    const favButton = document.getElementById('favorite-btn');

    if (meta) meta.style.display = 'none';
    if (image) image.style.display = 'none';
    if (content) content.style.display = 'none';
    if (favButton) favButton.style.display = 'none';
}
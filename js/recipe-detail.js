// File: js/recipe-detail.js

// --- 1. KHAI BÁO ĐỊA CHỈ SERVER ---
const API_BASE_URL = 'http://localhost:8080'; 

document.addEventListener('DOMContentLoaded', async () => {
    
    // 2. Lấy ID từ URL
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id');

    if (!recipeId) {
        displayError("Không tìm thấy mã món ăn!");
        return;
    }

    // 3. Gọi API Backend để lấy chi tiết món ăn
    try {
        const response = await fetch(`${API_BASE_URL}/api/recipes/${recipeId}`);
        
        if (!response.ok) {
            throw new Error('Không thể tải dữ liệu.');
        }
        
        const recipe = await response.json(); 
        
        // 4. Hiển thị dữ liệu lên giao diện
        displayRecipeDetails(recipe);

        // --- (MỚI) 5. LƯU LỊCH SỬ XEM ---
        // Logic: Nếu đã đăng nhập -> Gọi API báo cho server biết user vừa xem món này
        if (typeof isLoggedIn !== 'undefined' && isLoggedIn()) { 
            const user = JSON.parse(localStorage.getItem('currentUser'));
            if (user) {
                saveHistory(user.email, recipeId); // <--- HÀM MỚI ĐƯỢC GỌI TẠI ĐÂY
            }

            // --- 6. Xử lý nút Yêu thích ---
            const favButton = document.getElementById('favorite-btn');
            if(favButton) {
                favButton.classList.remove('hidden');
                
                checkFavoriteStatus(user.email, recipeId, favButton);
                
                favButton.addEventListener('click', () => {
                    const isActive = favButton.classList.contains('active');
                    if (isActive) {
                        toggleFavorite('remove', user.email, recipeId);
                        favButton.classList.remove('active');
                        favButton.innerHTML = '♡ Thêm vào yêu thích';
                    } else {
                        toggleFavorite('add', user.email, recipeId);
                        favButton.classList.add('active');
                        favButton.innerHTML = '❤️ Đã lưu vào yêu thích';
                    }
                });
            }
        }
        
    } catch (error) {
        console.error("Lỗi chi tiết:", error);
        displayError(error.message);
    }
});

/**
 * (MỚI) Hàm gọi API lưu lịch sử xem
 */
async function saveHistory(email, recipeId) {
    try {
        // Gọi API ngầm, không cần chờ kết quả (fire and forget)
        fetch(`${API_BASE_URL}/api/history/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: email, 
                recipeId: recipeId 
            })
        });
    } catch (err) {
        console.error("Lỗi lưu lịch sử:", err);
    }
}

/**
 * Hàm hiển thị dữ liệu lên HTML
 */
function displayRecipeDetails(recipe) {
    document.title = recipe.title;

    document.getElementById('recipe-title').innerText = recipe.title;
    document.getElementById('recipe-description').innerText = recipe.description || '';
    document.getElementById('recipe-prep-time').innerText = `Thời gian: ${recipe.prepTime || 'N/A'}`;
    document.getElementById('recipe-servings').innerText = `Khẩu phần: ${recipe.servings || 'N/A'}`;

    // Xử lý ảnh
    let imageUrl = 'images/default-placeholder.png';
    if (recipe.image) {
        if (recipe.image.startsWith('http')) {
            imageUrl = recipe.image;
        } else {
            imageUrl = `${API_BASE_URL}/uploads/${recipe.image}`;
        }
    }
    
    const imgElement = document.getElementById('recipe-image');
    if (imgElement) {
        imgElement.src = imageUrl;
        imgElement.alt = recipe.title;
        imgElement.onerror = function() {
            this.onerror = null;
            this.src = 'https://via.placeholder.com/600x400?text=Image+Error';
        };
    }

    // Hiển thị Nguyên liệu
    const ingredientsList = document.getElementById('recipe-ingredients-list');
    if (ingredientsList) {
        ingredientsList.innerHTML = '';
        if (recipe.ingredients && recipe.ingredients.length > 0) {
            recipe.ingredients.forEach(item => {
                const li = document.createElement('li');
                const text = typeof item === 'object' ? (item.name || JSON.stringify(item)) : item;
                li.innerText = text;
                ingredientsList.appendChild(li);
            });
        } else {
            ingredientsList.innerHTML = '<li>Chưa cập nhật nguyên liệu.</li>';
        }
    }

    // Hiển thị Cách làm
    const instructionsList = document.getElementById('recipe-instructions-list');
    if (instructionsList) {
        instructionsList.innerHTML = ''; 
        let stepsData = recipe.steps || recipe.instructions || [];
        
        if (stepsData.length > 0) {
            if (stepsData[0].stepNumber) {
                stepsData.sort((a, b) => a.stepNumber - b.stepNumber);
            }
            stepsData.forEach((item, index) => {
                const li = document.createElement('li');
                let text = '';
                if (typeof item === 'object') {
                    text = item.instruction || item.description || JSON.stringify(item);
                } else {
                    text = item;
                }
                li.innerHTML = `<strong>Bước ${index + 1}:</strong> ${text}`;
                instructionsList.appendChild(li);
            });
        } else {
             instructionsList.innerHTML = '<li>Chưa cập nhật hướng dẫn.</li>';
        }
    }
}

/**
 * Hàm kiểm tra trạng thái yêu thích
 */
async function checkFavoriteStatus(email, recipeId, btn) {
    try {
        const res = await fetch(`${API_BASE_URL}/api/favorites/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, recipeId: parseInt(recipeId) })
        });
        if (res.ok) {
            const isFavorited = await res.json();
            if (isFavorited) {
                btn.classList.add('active');
                btn.innerHTML = '❤️ Đã lưu vào yêu thích';
            }
        }
    } catch (err) { console.error(err); }
}

/**
 * Hàm Thêm/Xóa yêu thích
 */
async function toggleFavorite(action, email, recipeId) {
    try {
        await fetch(`${API_BASE_URL}/api/favorites/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, recipeId: parseInt(recipeId) })
        });
    } catch (err) { console.error(err); }
}

function displayError(message) {
    const titleEl = document.getElementById('recipe-title');
    if(titleEl) titleEl.innerText = "Rất tiếc!";
    document.querySelector('.recipe-content').innerHTML = `<p style="text-align:center">${message}</p>`;
}
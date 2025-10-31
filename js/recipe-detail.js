// File: js/recipe-detail.js

// Dữ liệu mock NÂNG CẤP. 
// File này cần dữ liệu chi tiết (nguyên liệu, hướng dẫn)
// nên chúng ta phải định nghĩa lại nó ở đây.
const mockRecipeFull = [
    {
        id: 1,
        title: "Gà Nướng Mật Ong",
        description: "Món gà nướng thơm lừng, da giòn, thịt mềm, đậm đà hương vị mật ong.",
        image: "https://images.unsplash.com/photo-1598511757132-00356618e7d2?w=500",
        prepTime: "60 phút",
        servings: "4 người",
        ingredients: [
            "1 con gà (khoảng 1.2kg)",
            "3 muỗng canh mật ong",
            "2 muỗng canh nước tương",
            "1 muỗng canh dầu hào",
            "1 muỗng cà phê tỏi băm",
            "Gia vị: muối, tiêu, bột nêm"
        ],
        instructions: [
            "Gà làm sạch, để ráo. Khía vài đường trên đùi và ức để gà dễ thấm.",
            "Trộn đều tất cả nguyên liệu ướp (mật ong, nước tương, dầu hào, tỏi, gia vị).",
            "Phết đều sốt ướp lên mình gà, cả bên trong và bên ngoài. Ướp ít nhất 30 phút.",
            "Làm nóng lò nướng ở 180°C.",
            "Cho gà vào lò, nướng trong 45-60 phút. Cứ 15 phút lại phết thêm sốt ướp cho gà không bị khô và lên màu đẹp."
        ]
    },
    {
        id: 2,
        title: "Cá Hồi Áp Chảo Sốt Bơ Tỏi",
        description: "Món ăn Tây sang trọng, giàu dinh dưỡng và dễ làm, da cá giòn rụm.",
        image: "https://images.unsplash.com/photo-1541795771680-bddf9191e3b1?w=500",
        prepTime: "20 phút",
        servings: "2 người",
        ingredients: [
            "2 miếng phi lê cá hồi (còn da)",
            "2 muỗng canh bơ lạt",
            "3 tép tỏi băm nhuyễn",
            "1 muỗng canh nước cốt chanh",
            "Rau mùi tây, muối, tiêu"
        ],
        instructions: [
            "Cá hồi rửa sạch, thấm khô. Ướp 2 mặt cá với muối và tiêu.",
            "Làm nóng chảo (chảo không dính). Đặt mặt da cá xuống áp chảo trước.",
            "Áp chảo mặt da khoảng 5-7 phút cho đến khi da giòn vàng, mỡ cá chảy ra.",
            "Lật mặt cá, áp chảo thêm 2-3 phút.",
            "Gạt cá sang một bên chảo, cho bơ và tỏi vào phi thơm.",
            "Rưới nước cốt chanh vào, đảo đều. Tắt bếp, rưới sốt bơ tỏi lên cá và rắc rau mùi tây."
        ]
    },
    // (Thêm 10 món còn lại... Bạn có thể tự thêm vào theo cấu trúc này)
    // ...
    // Để cho nhanh, tôi sẽ copy 1 món nữa
    {
        id: 5,
        title: "Phở Bò Hà Nội",
        description: "Hương vị truyền thống của phở bò, nước dùng trong và ngọt thanh.",
        image: "https://images.unsplash.com/photo-1589304017356-6d00424597d8?w=500",
        prepTime: "4 giờ",
        servings: "4 người",
        ingredients: [
            "1 kg xương ống bò",
            "500g nạm bò (hoặc tái, gầu)",
            "Bánh phở tươi",
            "Hành tây, gừng, thảo quả, hoa hồi, quế chi",
            "Gia vị: Nước mắm, bột nêm, đường phèn",
            "Rau thơm: Hành lá, ngò rí, giá đỗ"
        ],
        instructions: [
            "Xương ống rửa sạch, chần qua nước sôi, rửa lại. Gừng và hành tây nướng thơm.",
            "Cho xương, gừng, hành nướng vào nồi nước, hầm ít nhất 3 tiếng.",
            "Hoa hồi, quế, thảo quả rang thơm, cho vào túi vải, thả vào nồi nước dùng.",
            "Nêm nếm nước dùng với nước mắm, bột nêm, đường phèn cho vừa miệng.",
            "Nạm bò luộc chín, thái mỏng. Thịt tái thái mỏng.",
            "Trụng bánh phở, cho vào bát. Xếp thịt lên trên, chan nước dùng và rắc hành ngò."
        ]
    },
];

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Lấy ID từ URL
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id');

    // 2. Tìm món ăn trong MOCK DATA
    // Dùng == vì `recipeId` từ URL là string, còn `r.id` là number
    const recipe = mockRecipeFull.find(r => r.id == recipeId);

    if (recipe) {
        // 3. Nếu tìm thấy, "nhồi" dữ liệu vào HTML
        
        // Cập nhật tiêu đề trang
        document.title = recipe.title;

        // Nhồi dữ liệu cơ bản
        document.getElementById('recipe-title').innerText = recipe.title;
        document.getElementById('recipe-image').src = recipe.image;
        document.getElementById('recipe-image').alt = recipe.title;
        document.getElementById('recipe-description').innerText = recipe.description;
        document.getElementById('recipe-prep-time').innerText = `Thời gian: ${recipe.prepTime}`;
        document.getElementById('recipe-servings').innerText = `Khẩu phần: ${recipe.servings}`;

        // Nhồi danh sách Nguyên liệu
        const ingredientsList = document.getElementById('recipe-ingredients-list');
        recipe.ingredients.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item;
            ingredientsList.appendChild(li);
        });

        // Nhồi danh sách Hướng dẫn
        const instructionsList = document.getElementById('recipe-instructions-list');
        recipe.instructions.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item;
            instructionsList.appendChild(li);
        });

    } else {
        // 4. Nếu không tìm thấy
        document.getElementById('recipe-title').innerText = "Không tìm thấy món ăn!";
        document.getElementById('recipe-description').innerText = "Vui lòng quay lại trang chủ và thử lại.";
    }
});
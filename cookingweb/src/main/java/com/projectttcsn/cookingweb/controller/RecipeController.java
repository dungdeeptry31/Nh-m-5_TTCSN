package com.projectttcsn.cookingweb.controller;

import com.projectttcsn.cookingweb.dto.CreateRecipeRequest;
import com.projectttcsn.cookingweb.entity.Recipe;
import com.projectttcsn.cookingweb.service.RecipeService;
import com.projectttcsn.cookingweb.filestorage.FileStorageService; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; 

import java.util.List;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "*")
public class RecipeController {

    @Autowired private RecipeService recipeService;
    @Autowired private FileStorageService fileStorageService;

    // 1. GET ALL (Phân trang)
    @GetMapping
    public ResponseEntity<Page<Recipe>> getRecipes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size
    ) {
        return ResponseEntity.ok(recipeService.getRecipes(page, size));
    }

    // 2. TÌM KIẾM (QUAN TRỌNG: Phải đặt trên getRecipeById để không bị nhầm lẫn)
    @GetMapping("/search")
    public ResponseEntity<?> searchRecipes(@RequestParam String keyword) {
        try {
            return ResponseEntity.ok(recipeService.searchRecipes(keyword));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // 3. LẤY MÓN ĂN THEO DANH MỤC
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getRecipesByCategory(@PathVariable Integer categoryId) {
        try {
            List<Recipe> recipes = recipeService.getRecipesByCategory(categoryId);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // 4. GET ONE (Lấy chi tiết theo ID)
    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(recipeService.getRecipeById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 5. POST (THÊM MỚI)
    @PostMapping
    public ResponseEntity<?> createRecipe(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("prepTime") String prepTime,
            @RequestParam("servings") String servings,
            @RequestParam("categoryId") Integer categoryId,
            @RequestParam(value = "file", required = false) MultipartFile file, 
            @RequestParam("ingredients") List<String> ingredients,
            @RequestParam("instructions") List<String> instructions
    ) {
        try {
            String imagePath = "images/default-placeholder.png";
            if (file != null && !file.isEmpty()) {
                imagePath = fileStorageService.storeFile(file);
            }

            CreateRecipeRequest request = new CreateRecipeRequest();
            request.setTitle(title);
            request.setDescription(description);
            request.setImage(imagePath);
            request.setPrepTime(prepTime);
            request.setServings(servings);
            request.setCategoryId(categoryId);
            request.setIngredients(ingredients);
            request.setInstructions(instructions);
            request.setCookTime("N/A");

            // Lưu ý: Thay "admin@gmail.com" bằng email thật nếu đã có login
            Recipe createdRecipe = recipeService.createRecipe(request, "admin@gmail.com");
            return ResponseEntity.ok(createdRecipe);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // 6. PUT (CẬP NHẬT)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecipe(
            @PathVariable Integer id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("prepTime") String prepTime,
            @RequestParam("servings") String servings,
            @RequestParam("categoryId") Integer categoryId,
            @RequestParam(value = "file", required = false) MultipartFile file, 
            @RequestParam("currentImage") String currentImage, 
            @RequestParam("ingredients") List<String> ingredients,
            @RequestParam("instructions") List<String> instructions
    ) {
        try {
            String imagePath = currentImage;
            if (file != null && !file.isEmpty()) {
                imagePath = fileStorageService.storeFile(file);
            }

            CreateRecipeRequest request = new CreateRecipeRequest();
            request.setTitle(title);
            request.setDescription(description);
            request.setImage(imagePath);
            request.setPrepTime(prepTime);
            request.setServings(servings);
            request.setCategoryId(categoryId);
            request.setIngredients(ingredients);
            request.setInstructions(instructions);
            request.setCookTime("N/A");

            Recipe updatedRecipe = recipeService.updateRecipe(id, request);
            return ResponseEntity.ok(updatedRecipe);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
    
    // 7. DELETE (XÓA)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable Integer id) {
        try {
            recipeService.deleteRecipe(id);
            return ResponseEntity.ok("Đã xóa thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}
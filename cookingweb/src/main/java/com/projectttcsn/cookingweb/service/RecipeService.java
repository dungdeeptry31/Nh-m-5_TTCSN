package com.projectttcsn.cookingweb.service;

import com.projectttcsn.cookingweb.dto.CreateRecipeRequest;
import com.projectttcsn.cookingweb.entity.*;
import com.projectttcsn.cookingweb.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecipeService {

    @Autowired private RecipeRepository recipeRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private IngredientRepository ingredientRepository;

    // ... (Giữ nguyên các hàm get, search ...)
    public Page<Recipe> getRecipes(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return recipeRepository.findAll(pageable);
    }

    public Recipe getRecipeById(Integer id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy công thức với ID: " + id));
    }

    public List<Recipe> getRecipesByCategory(Integer categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new RuntimeException("Danh mục không tồn tại!");
        }
        return recipeRepository.findByCategoryId(categoryId);
    }

    public List<Recipe> searchRecipes(String keyword) {
        return recipeRepository.findByTitleContainingIgnoreCase(keyword);
    }

    // --- CREATE RECIPE (Đã sửa để debug) ---
    @Transactional
    public Recipe createRecipe(CreateRecipeRequest request, String userEmail) {
        // LOG KIỂM TRA DỮ LIỆU ĐẦU VÀO
        System.out.println("=== BẮT ĐẦU TẠO CÔNG THỨC ===");
        System.out.println("Title: " + request.getTitle());
        System.out.println("Số lượng Steps gửi lên: " + (request.getInstructions() != null ? request.getInstructions().size() : "NULL"));
        System.out.println("Số lượng Ingredients gửi lên: " + (request.getIngredients() != null ? request.getIngredients().size() : "NULL"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found: " + request.getCategoryId()));

        Recipe newRecipe = new Recipe();
        newRecipe.setTitle(request.getTitle());
        newRecipe.setDescription(request.getDescription());
        newRecipe.setImage(request.getImage());
        newRecipe.setPrepTime(request.getPrepTime());
        newRecipe.setCookTime(request.getCookTime());
        newRecipe.setServings(request.getServings());
        newRecipe.setUser(user);
        newRecipe.setCategory(category);

        // Chuẩn bị dữ liệu
        prepareRecipeSteps(newRecipe, request.getInstructions());
        prepareRecipeIngredients(newRecipe, request.getIngredients());

        // Lưu
        Recipe saved = recipeRepository.save(newRecipe);
        System.out.println("=== ĐÃ LƯU XONG. ID: " + saved.getId() + " ===");
        return saved;
    }

    @Transactional
    public Recipe updateRecipe(Integer id, CreateRecipeRequest request) {
        Recipe existingRecipe = getRecipeById(id);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found: " + request.getCategoryId()));

        existingRecipe.setTitle(request.getTitle());
        existingRecipe.setDescription(request.getDescription());
        existingRecipe.setImage(request.getImage());
        existingRecipe.setPrepTime(request.getPrepTime());
        existingRecipe.setCookTime(request.getCookTime());
        existingRecipe.setServings(request.getServings());
        existingRecipe.setCategory(category);

        // Xóa cũ thêm mới
        existingRecipe.getRecipeSteps().clear();
        existingRecipe.getRecipeIngredients().clear();

        prepareRecipeSteps(existingRecipe, request.getInstructions());
        prepareRecipeIngredients(existingRecipe, request.getIngredients());

        return recipeRepository.save(existingRecipe);
    }

    @Transactional
    public void deleteRecipe(Integer id) {
        Recipe recipe = getRecipeById(id);
        recipeRepository.delete(recipe);
    }

    // === HELPER ===
    private void prepareRecipeSteps(Recipe recipe, List<String> instructions) {
        if (instructions == null) return;
        int stepNumber = 1;
        for (String instructionText : instructions) {
            if (instructionText != null && !instructionText.isBlank()) {
                RecipeStep step = new RecipeStep();
                step.setStepNumber(stepNumber++);
                step.setDescription(instructionText);
                recipe.addStep(step);
            }
        }
    }

    private void prepareRecipeIngredients(Recipe recipe, List<String> ingredients) {
        if (ingredients == null) return;
        for (String ingredientLine : ingredients) {
            if (ingredientLine != null && !ingredientLine.isBlank()) {
                String[] parts = ingredientLine.split(" ", 2);
                String quantityNote = parts.length > 0 ? parts[0] : "";
                String ingredientName = parts.length > 1 ? parts[1] : ingredientLine;

                Optional<Ingredient> existingIngredient = ingredientRepository.findByName(ingredientName);
                Ingredient ingredient;
                if (existingIngredient.isPresent()) {
                    ingredient = existingIngredient.get();
                } else {
                    ingredient = new Ingredient();
                    ingredient.setName(ingredientName);
                    ingredient = ingredientRepository.save(ingredient);
                }

                RecipeIngredient recipeIngredient = new RecipeIngredient();
                recipeIngredient.setIngredient(ingredient);
                recipeIngredient.setNote(quantityNote);
                recipe.addRecipeIngredient(recipeIngredient);
            }
        }
    }
}
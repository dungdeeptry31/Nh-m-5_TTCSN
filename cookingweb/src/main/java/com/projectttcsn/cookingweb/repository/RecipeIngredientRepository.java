package com.projectttcsn.cookingweb.repository;

import com.projectttcsn.cookingweb.entity.Recipe; // <-- THÊM DÒNG NÀY
import com.projectttcsn.cookingweb.entity.RecipeIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient, Integer> {

    // (THÊM MỚI) Tự động xóa tất cả Ingredient theo Recipe
    void deleteAllByRecipe(Recipe recipe);
}
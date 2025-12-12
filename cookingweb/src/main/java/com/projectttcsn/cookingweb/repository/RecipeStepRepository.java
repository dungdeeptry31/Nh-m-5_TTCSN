package com.projectttcsn.cookingweb.repository;

import com.projectttcsn.cookingweb.entity.Recipe; // <-- THÊM DÒNG NÀY
import com.projectttcsn.cookingweb.entity.RecipeStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeStepRepository extends JpaRepository<RecipeStep, Integer> {

    // (THÊM MỚI) Tự động xóa tất cả Step theo Recipe
    void deleteAllByRecipe(Recipe recipe); 
}
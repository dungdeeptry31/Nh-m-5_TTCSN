package com.projectttcsn.cookingweb.repository;

import com.projectttcsn.cookingweb.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional; // <-- THÊM DÒNG NÀY

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Integer> {
    
    // (THÊM HÀM NÀY)
    // Spring sẽ tự tạo: SELECT * FROM ingredient WHERE name = ?
    Optional<Ingredient> findByName(String name);
}
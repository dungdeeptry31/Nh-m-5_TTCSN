package com.projectttcsn.cookingweb.repository;

import com.projectttcsn.cookingweb.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; 

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Integer> {

    // 1. Lọc theo danh mục
    List<Recipe> findByCategoryId(Integer categoryId);

    // 2. Tìm kiếm theo tên (BẮT BUỘC PHẢI CÓ DÒNG NÀY ĐỂ SEARCH)
    List<Recipe> findByTitleContainingIgnoreCase(String title);
}
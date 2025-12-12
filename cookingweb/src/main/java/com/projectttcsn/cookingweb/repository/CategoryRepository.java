package com.projectttcsn.cookingweb.repository; // <-- Chú ý tên package

import com.projectttcsn.cookingweb.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
package com.projectttcsn.cookingweb.service;

import com.projectttcsn.cookingweb.entity.Category;
import com.projectttcsn.cookingweb.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Hàm lấy tất cả danh mục từ CSDL
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}
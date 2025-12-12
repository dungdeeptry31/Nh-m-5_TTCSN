package com.projectttcsn.cookingweb.dto; // <-- Phải đúng tên package

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateRecipeRequest {
    private String title;
    private String description;
    private String image;
    private String prepTime;
    private String cookTime;
    private String servings;
    private Integer categoryId; // ID của danh mục (vd: 1 = "Món nướng")
    
    // ["1kg Thịt bò", "2 củ hành"]
    private List<String> ingredients; 
    
    // ["Bước 1: Sơ chế", "Bước 2: Nấu"]
    private List<String> instructions; 
}
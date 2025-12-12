package com.projectttcsn.cookingweb.entity;

import com.fasterxml.jackson.annotation.JsonIgnore; // <-- THÊM DÒNG NÀY
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "INGREDIENT")
@Getter
@Setter
public class Ingredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "Name", length = 120)
    private String name;

    @Column(name = "Unit", length = 50)
    private String unit;

    // --- (SỬA) Mối quan hệ Một-Nhiều (1-N) ---
    
    @JsonIgnore // <-- THÊM DÒNG NÀY ĐỂ NGẮT VÒNG LẶP
    @OneToMany(mappedBy = "ingredient")
    private Set<RecipeIngredient> recipeIngredients;
}
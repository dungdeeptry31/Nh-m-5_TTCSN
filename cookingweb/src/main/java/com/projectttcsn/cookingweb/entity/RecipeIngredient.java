package com.projectttcsn.cookingweb.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "RECIPE_INGREDIENT")
@Getter
@Setter
public class RecipeIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "Quantity")
    private Integer quantity;

    @Column(name = "Note", length = 100)
    private String note;

    // --- QUAN TRỌNG: MỐI QUAN HỆ VỚI CHA (RECIPE) ---
    @JsonBackReference // Ngăn chặn vòng lặp vô hạn
    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "RECIPE_ID", nullable = false)
    private Recipe recipe;

    // Quan hệ với bảng danh mục nguyên liệu (Ingredient)
    @ManyToOne
    @JoinColumn(name = "INGREDIENT_ID", nullable = false)
    private Ingredient ingredient;
}
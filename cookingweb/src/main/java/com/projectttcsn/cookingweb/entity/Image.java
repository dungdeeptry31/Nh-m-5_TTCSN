package com.projectttcsn.cookingweb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "IMAGE")
@Getter
@Setter
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "Image", length = 255)
    private String image; // Đây là URL hoặc đường dẫn tới file ảnh

    // --- Mối quan hệ Nhiều-Một (N-1) ---

    @ManyToOne
    @JoinColumn(name = "RECIPE_ID") // Có thể null
    private Recipe recipe; // Liên kết đến công thức (nếu đây là ảnh của công thức)

    @ManyToOne
    @JoinColumn(name = "INGREDIENT_ID") // Có thể null
    private Ingredient ingredient; // Liên kết đến nguyên liệu (nếu đây là ảnh của nguyên liệu)
}
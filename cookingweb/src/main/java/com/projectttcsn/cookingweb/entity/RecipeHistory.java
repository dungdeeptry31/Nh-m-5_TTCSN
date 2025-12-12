package com.projectttcsn.cookingweb.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // <-- NHỚ IMPORT CÁI NÀY
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "RECIPE_HISTORY")
@Getter
@Setter
public class RecipeHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "View_at") 
    private LocalDateTime viewedAt;

    // 1. Ngắt vòng lặp User (User -> History -> User)
    @JsonIgnore 
    @ManyToOne
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user; 

    // 2. SỬA QUAN TRỌNG TẠI ĐÂY:
    // Vẫn lấy thông tin Recipe, NHƯNG bỏ qua trường "user" bên trong Recipe đó
    // để tránh vòng lặp: History -> Recipe -> User -> History...
    @JsonIgnoreProperties({"user", "recipeHistories", "steps", "ingredients"}) 
    @ManyToOne
    @JoinColumn(name = "RECIPE_ID", nullable = false)
    private Recipe recipe;

    @PrePersist
    protected void onCreate() {
        this.viewedAt = LocalDateTime.now();
    }
}
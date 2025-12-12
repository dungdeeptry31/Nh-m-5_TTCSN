package com.projectttcsn.cookingweb.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "RECIPE")
@Getter
@Setter
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "Title", length = 255)
    private String title;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "Content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "Image", length = 255)
    private String image;

    @Column(name = "Prep_time")
    private String prepTime;

    @Column(name = "Cook_time")
    private String cookTime;

    @Column(name = "Servings")
    private String servings;

    @Column(name = "Created_at")
    private LocalDate createdAt;

    @Column(name = "Updated_at")
    private LocalDate updatedAt;

    @ManyToOne
    @JoinColumn(name = "User_ID", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "CATEGORY_ID", nullable = false)
    private Category category;

    // --- SỬA LOGIC HIỂN THỊ TẠI ĐÂY ---

    // 1. ẨN luông cái list Object phức tạp này đi để Form không bị rối
    @JsonIgnore 
    @OneToMany(mappedBy = "recipe", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecipeStep> recipeSteps = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "recipe")
    private List<Favorite> favorites;

    @OneToMany(mappedBy = "recipe")
    private List<RecipeHistory> recipeHistories;

    @OneToMany(mappedBy = "recipe")
    private List<Image> images;

    // 2. ẨN luôn list Object nguyên liệu
    @JsonIgnore 
    @OneToMany(mappedBy = "recipe", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RecipeIngredient> recipeIngredients = new ArrayList<>();


    // --- CÁC HÀM "GETTER" ẢO ĐỂ PHỤC VỤ FRONTEND ---
    // Frontend gọi tên nào cũng sẽ có dữ liệu trả về

    // A. Dành cho Nguyên liệu (Ingredients)
    @JsonProperty("ingredients") // Trả về danh sách chuỗi: ["500g Thịt", "1 quả trứng"]
    public List<String> getIngredientsList() {
        if (recipeIngredients == null) return new ArrayList<>();
        return recipeIngredients.stream()
                .map(ri -> {
                    String note = (ri.getNote() != null) ? ri.getNote() : "";
                    String name = (ri.getIngredient() != null) ? ri.getIngredient().getName() : "";
                    return (note + " " + name).trim();
                })
                .collect(Collectors.toList());
    }

    // B. Dành cho Các bước (Steps/Instructions)
    // Trường hợp 1: Frontend tìm tên là "instructions"
    @JsonProperty("instructions") 
    public List<String> getInstructionsList() {
        return convertStepsToStrings();
    }

    // Trường hợp 2: Frontend tìm tên là "steps" (Dự phòng)
    @JsonProperty("steps")
    public List<String> getStepsList() {
        return convertStepsToStrings();
    }

    // Hàm phụ trợ để chuyển đổi
    private List<String> convertStepsToStrings() {
        if (recipeSteps == null) return new ArrayList<>();
        return recipeSteps.stream()
                .sorted((s1, s2) -> Integer.compare(s1.getStepNumber(), s2.getStepNumber()))
                .map(RecipeStep::getDescription)
                .collect(Collectors.toList());
    }

    // --- EVENTS & HELPERS ---
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDate.now();
        this.updatedAt = LocalDate.now();
    }
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDate.now();
    }

    public void addStep(RecipeStep step) {
        this.recipeSteps.add(step);
        step.setRecipe(this);
    }

    public void addRecipeIngredient(RecipeIngredient recipeIngredient) {
        this.recipeIngredients.add(recipeIngredient);
        recipeIngredient.setRecipe(this);
    }
}
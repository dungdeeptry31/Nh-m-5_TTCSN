package com.projectttcsn.cookingweb.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "RECIPE_STEP")
@Getter
@Setter
public class RecipeStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "Step_number") // Sửa lại tên cột cho chuẩn convention (nếu DB của bạn là StepNumber thì giữ nguyên)
    private Integer stepNumber;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    // --- QUAN TRỌNG: MỐI QUAN HỆ VỚI CHA (RECIPE) ---
    @JsonBackReference // Ngăn chặn vòng lặp vô hạn khi chuyển sang JSON
    @ManyToOne(fetch = FetchType.LAZY) // Thêm LAZY để tối ưu hiệu suất
    @JoinColumn(name = "RECIPE_ID", nullable = false)
    private Recipe recipe;
}
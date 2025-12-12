package com.projectttcsn.cookingweb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "FAVORITE")
@Getter
@Setter
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "Created_at")
    private LocalDate createdAt;

    // --- Mối quan hệ Nhiều-Một (N-1) ---

    @ManyToOne
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user; // Liên kết đến người dùng đã lưu

    @ManyToOne
    @JoinColumn(name = "RECIPE_ID", nullable = false)
    private Recipe recipe; // Liên kết đến công thức được lưu

    // --- Xử lý ngày tháng tự động ---
    @PrePersist // Hàm này sẽ chạy trước khi lưu mới
    protected void onCreate() {
        this.createdAt = LocalDate.now();
    }
}
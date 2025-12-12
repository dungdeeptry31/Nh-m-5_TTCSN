package com.projectttcsn.cookingweb.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Entity
@Table(name = "USER")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "UserName", length = 200)
    private String userName;

    @Column(name = "Email", length = 50, unique = true)
    private String email;

    @Column(name = "Password", length = 255)
    private String password;

    @Column(name = "Role", length = 20)
    private String role = "USER"; 

    // --- THÊM MỚI: TRƯỜNG TÊN HIỂN THỊ ---
    // Lombok (@Setter) sẽ tự động tạo hàm setDisplayName() cho biến này
    @Column(name = "DisplayName", length = 200)
    private String displayName;
    // -------------------------------------

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Recipe> recipes;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Favorite> favorites;

    @JsonIgnore
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<RecipeHistory> recipeHistories;
}
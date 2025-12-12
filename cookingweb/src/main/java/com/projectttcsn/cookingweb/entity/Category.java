package com.projectttcsn.cookingweb.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "CATEGORY")
@Getter
@Setter
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @Column(name = "Name", length = 255)
    private String name;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    // Thêm trường image
    @Column(name = "Image")
    private String image;

    @JsonIgnore
    @OneToMany(mappedBy = "category")
    private Set<Recipe> recipes;
}
package com.projectttcsn.cookingweb.repository;

import com.projectttcsn.cookingweb.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Image, Integer> {
}
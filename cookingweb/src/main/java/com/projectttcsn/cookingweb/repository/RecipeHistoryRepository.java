package com.projectttcsn.cookingweb.repository;

import com.projectttcsn.cookingweb.entity.RecipeHistory;
import com.projectttcsn.cookingweb.entity.User;
import com.projectttcsn.cookingweb.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipeHistoryRepository extends JpaRepository<RecipeHistory, Integer> {

    // 1. Lấy danh sách lịch sử của User, sắp xếp giảm dần theo thời gian (Mới xem -> Lên đầu)
    List<RecipeHistory> findByUserOrderByViewedAtDesc(User user);

    // 2. Tìm xem User này đã xem Món này chưa
    Optional<RecipeHistory> findByUserAndRecipe(User user, Recipe recipe);
}
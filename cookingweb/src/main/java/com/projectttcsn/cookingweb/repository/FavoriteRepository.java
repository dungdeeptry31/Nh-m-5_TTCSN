package com.projectttcsn.cookingweb.repository;

import com.projectttcsn.cookingweb.entity.Favorite;
import com.projectttcsn.cookingweb.entity.Recipe;
import com.projectttcsn.cookingweb.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {
    
    // Tìm xem user đã like món này chưa
    Optional<Favorite> findByUserAndRecipe(User user, Recipe recipe);

    // Lấy danh sách yêu thích của user
    List<Favorite> findByUser(User user);
}
package com.projectttcsn.cookingweb.service;

import com.projectttcsn.cookingweb.entity.Favorite;
import com.projectttcsn.cookingweb.entity.Recipe;
import com.projectttcsn.cookingweb.entity.User;
import com.projectttcsn.cookingweb.repository.FavoriteRepository;
import com.projectttcsn.cookingweb.repository.RecipeRepository;
import com.projectttcsn.cookingweb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    @Autowired private FavoriteRepository favoriteRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RecipeRepository recipeRepository;

    // 1. Thêm yêu thích
    public void addFavorite(String email, Integer recipeId) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Recipe recipe = recipeRepository.findById(recipeId).orElseThrow(() -> new RuntimeException("Recipe not found"));

        // Kiểm tra xem đã like chưa, nếu chưa thì mới thêm
        if (favoriteRepository.findByUserAndRecipe(user, recipe).isEmpty()) {
            Favorite favorite = new Favorite();
            favorite.setUser(user);
            favorite.setRecipe(recipe);
            favoriteRepository.save(favorite);
        }
    }

    // 2. Xóa yêu thích
    public void removeFavorite(String email, Integer recipeId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();

        Optional<Favorite> favorite = favoriteRepository.findByUserAndRecipe(user, recipe);
        favorite.ifPresent(value -> favoriteRepository.delete(value));
    }

    // 3. Kiểm tra trạng thái (đã like hay chưa)
    public boolean isFavorited(String email, Integer recipeId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();
        return favoriteRepository.findByUserAndRecipe(user, recipe).isPresent();
    }

    // 4. Lấy danh sách công thức yêu thích của User
    public List<Recipe> getUserFavorites(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Favorite> favorites = favoriteRepository.findByUser(user);
        
        // Chuyển từ List<Favorite> sang List<Recipe>
        return favorites.stream()
                .map(Favorite::getRecipe)
                .collect(Collectors.toList());
    }
}
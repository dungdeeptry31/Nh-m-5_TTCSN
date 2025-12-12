package com.projectttcsn.cookingweb.controller;

import com.projectttcsn.cookingweb.entity.Recipe;
import com.projectttcsn.cookingweb.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    // API Thêm: POST /api/favorites/add
    // Body: { "email": "...", "recipeId": 1 }
    @PostMapping("/add")
    public ResponseEntity<?> addFavorite(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        Integer recipeId = (Integer) payload.get("recipeId");
        favoriteService.addFavorite(email, recipeId);
        return ResponseEntity.ok("Đã thêm vào yêu thích");
    }

    // API Xóa: POST /api/favorites/remove
    @PostMapping("/remove")
    public ResponseEntity<?> removeFavorite(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        Integer recipeId = (Integer) payload.get("recipeId");
        favoriteService.removeFavorite(email, recipeId);
        return ResponseEntity.ok("Đã xóa khỏi yêu thích");
    }

    // API Kiểm tra: POST /api/favorites/check
    @PostMapping("/check")
    public ResponseEntity<?> checkFavorite(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        Integer recipeId = (Integer) payload.get("recipeId");
        boolean isFavorited = favoriteService.isFavorited(email, recipeId);
        return ResponseEntity.ok(isFavorited);
    }

    // API Lấy danh sách: GET /api/favorites/user/{email}
    @GetMapping("/user/{email}")
    public ResponseEntity<List<Recipe>> getUserFavorites(@PathVariable String email) {
        return ResponseEntity.ok(favoriteService.getUserFavorites(email));
    }
}
package com.projectttcsn.cookingweb.controller;

import com.projectttcsn.cookingweb.entity.*;
import com.projectttcsn.cookingweb.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
public class HistoryController {

    @Autowired private RecipeHistoryRepository historyRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RecipeRepository recipeRepository;

    // 1. API LƯU LỊCH SỬ (Gọi khi người dùng bấm vào xem chi tiết món ăn)
    @PostMapping("/save")
    public ResponseEntity<?> saveHistory(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String recipeIdStr = request.get("recipeId");

        if (email == null || recipeIdStr == null) {
            return ResponseEntity.badRequest().body("Thiếu email hoặc recipeId");
        }

        try {
            Integer recipeId = Integer.parseInt(recipeIdStr);
            
            User user = userRepository.findByEmail(email).orElse(null);
            Recipe recipe = recipeRepository.findById(recipeId).orElse(null);

            if (user != null && recipe != null) {
                // Kiểm tra xem user đã từng xem món này chưa
                Optional<RecipeHistory> existingHistory = historyRepository.findByUserAndRecipe(user, recipe);

                RecipeHistory history;
                if (existingHistory.isPresent()) {
                    // Nếu xem rồi -> Cập nhật thời gian xem thành mới nhất
                    history = existingHistory.get();
                } else {
                    // Nếu chưa xem -> Tạo mới
                    history = new RecipeHistory();
                    history.setUser(user);
                    history.setRecipe(recipe);
                }
                
                history.setViewedAt(LocalDateTime.now());
                historyRepository.save(history);
                
                return ResponseEntity.ok("Đã lưu lịch sử");
            }
            return ResponseEntity.badRequest().body("User hoặc Recipe không tồn tại");
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // 2. API LẤY DANH SÁCH LỊCH SỬ CỦA USER
    @GetMapping("/{email}")
    public ResponseEntity<?> getUserHistory(@PathVariable String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        // Lấy danh sách, sắp xếp cái nào mới xem thì lên đầu
        List<RecipeHistory> histories = historyRepository.findByUserOrderByViewedAtDesc(user);
        return ResponseEntity.ok(histories);
    }
}
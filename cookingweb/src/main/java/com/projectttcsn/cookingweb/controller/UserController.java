package com.projectttcsn.cookingweb.controller;

import com.projectttcsn.cookingweb.entity.User; // <-- Nhớ Import User
import com.projectttcsn.cookingweb.repository.UserRepository; // <-- Nhớ Import UserRepository
import com.projectttcsn.cookingweb.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository; // <-- THÊM MỚI: Để dùng cho hàm updateProfile

    // --- 1. LẤY TẤT CẢ (Giữ nguyên) ---
    @GetMapping("")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // --- 2. UPDATE USER BẰNG ID (Giữ nguyên - Dùng cho Admin) ---
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody Map<String, Object> payload) {
        try {
            return ResponseEntity.ok(userService.updateUser(id, payload));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi cập nhật: " + e.getMessage());
        }
    }

    // --- 3. CẬP NHẬT QUYỀN (Giữ nguyên) ---
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Integer id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(userService.updateUserRole(id, payload.get("role")));
    }

    // --- 4. XÓA USER (Giữ nguyên) ---
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("Đã xóa thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi xóa: " + e.getMessage());
        }
    }

    // --- 5. LẤY THÔNG TIN USER (Giữ nguyên) ---
    @GetMapping("/info/{email}")
    public ResponseEntity<?> getUserInfo(@PathVariable String email) {
        try {
            return ResponseEntity.ok(userService.getUserByEmail(email));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // --- 6. (MỚI) CẬP NHẬT THÔNG TIN CÁ NHÂN (ĐỔI TÊN HIỂN THỊ) ---
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newName = request.get("displayName");

        if (email == null || newName == null) {
            return ResponseEntity.badRequest().body("Thiếu thông tin email hoặc tên hiển thị.");
        }

        try {
            // Tìm user trong database
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

            // Cập nhật tên hiển thị
            user.setDisplayName(newName);
            
            // Lưu lại vào DB
            User updatedUser = userRepository.save(user);

            return ResponseEntity.ok(updatedUser);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}
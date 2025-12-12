package com.projectttcsn.cookingweb.controller;

import com.projectttcsn.cookingweb.dto.AuthRequest;
import com.projectttcsn.cookingweb.dto.AuthResponse;
import com.projectttcsn.cookingweb.entity.User;
import com.projectttcsn.cookingweb.repository.UserRepository; // <-- Thêm dòng này
import com.projectttcsn.cookingweb.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap; // <-- Thêm dòng này
import java.util.Map;     // <-- Thêm dòng này

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository; // <-- Cần cái này để lấy Role từ DB

    // --- API ĐĂNG KÝ (Giữ nguyên) ---
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AuthRequest authRequest) {
        try {
            User registeredUser = authService.registerUser(authRequest);
            return ResponseEntity.ok("Đăng ký thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- API ĐĂNG NHẬP (ĐÃ SỬA ĐỂ TRẢ VỀ ROLE) ---
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody AuthRequest authRequest) {
        try {
            // 1. Gọi Service để lấy Token (Xác thực)
            AuthResponse authResponse = authService.loginUser(authRequest);
            
            // 2. Lấy thông tin User chi tiết từ Database (để lấy Role)
            User user = userRepository.findByEmail(authRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

            // 3. Tạo một gói dữ liệu đầy đủ để trả về cho Frontend
            Map<String, Object> responseMap = new HashMap<>();
            responseMap.put("token", authResponse.getToken()); // Token đăng nhập
            responseMap.put("type", "Bearer");
            responseMap.put("username", user.getUserName());
            responseMap.put("email", user.getEmail());
            
            // --- QUAN TRỌNG NHẤT: Gửi Role về cho Frontend ---
            responseMap.put("role", user.getRole()); 
            // -------------------------------------------------

            return ResponseEntity.ok(responseMap);

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Đăng nhập thất bại: " + e.getMessage());
        }
    }
}
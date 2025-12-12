package com.projectttcsn.cookingweb.service;

import com.projectttcsn.cookingweb.dto.AuthRequest;
import com.projectttcsn.cookingweb.dto.AuthResponse; // THÊM DÒNG NÀY
import com.projectttcsn.cookingweb.entity.User;
import com.projectttcsn.cookingweb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil; // THÊM DÒNG NÀY

    /**
     * Logic cho Đăng Ký (Use Case #2)
     */
    public User registerUser(AuthRequest authRequest) throws Exception {
        // ... (Code cũ của hàm registerUser giữ nguyên) ...
        Optional<User> existingUser = userRepository.findByEmail(authRequest.getEmail());
        if (existingUser.isPresent()) {
            throw new Exception("Email đã tồn tại");
        }
        User newUser = new User();
        newUser.setUserName(authRequest.getUsername());
        newUser.setEmail(authRequest.getEmail());
        String hashedPassword = passwordEncoder.encode(authRequest.getPassword());
        newUser.setPassword(hashedPassword);
        return userRepository.save(newUser);
    }

    // === (MỚI) HÀM MỚI CHO ĐĂNG NHẬP ===
    /**
     * Logic cho Đăng Nhập (Use Case #1)
     */
    public AuthResponse loginUser(AuthRequest authRequest) throws Exception {
        // 1. Tìm user bằng email
        User user = userRepository.findByEmail(authRequest.getEmail())
                .orElseThrow(() -> new Exception("Email không tồn tại"));

        // 2. So sánh mật khẩu
        // authRequest.getPassword() = mật khẩu thô (vd: "123456")
        // user.getPassword() = mật khẩu đã băm (vd: "$2a$10...")
        if (passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
            // Nếu mật khẩu khớp

            // 3. Tạo JWT Token
            String token = jwtUtil.generateToken(user.getEmail(), user.getUserName());

            // 4. Trả về Response cho Frontend
            return new AuthResponse(user.getEmail(), user.getUserName(), token);
        } else {
            // Nếu mật khẩu sai
            throw new Exception("Mật khẩu không chính xác");
        }
    }
}
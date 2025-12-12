package com.projectttcsn.cookingweb.service;

import com.projectttcsn.cookingweb.entity.User;
import com.projectttcsn.cookingweb.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map; // Import Map

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // --- SỬA HÀM NÀY ĐỂ TRÁNH BỊ NULL TÊN ---
    public User updateUser(Integer id, Map<String, Object> payload) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Kiểm tra kỹ trước khi set
        if (payload.containsKey("userName")) {
            user.setUserName((String) payload.get("userName"));
        }
        if (payload.containsKey("email")) {
            user.setEmail((String) payload.get("email"));
        }
        
        return userRepository.save(user);
    }

    public User updateUserRole(Integer id, String newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(newRole);
        return userRepository.save(user);
    }

    public void deleteUser(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với email: " + email));
    }
}

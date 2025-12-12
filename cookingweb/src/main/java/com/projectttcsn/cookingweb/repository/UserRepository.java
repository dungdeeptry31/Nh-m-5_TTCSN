package com.projectttcsn.cookingweb.repository;

import com.projectttcsn.cookingweb.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    // JpaRepository<User, Integer>
    // User: Tên Entity mà nó quản lý
    // Integer: Kiểu dữ liệu của Khóa chính (ID)

    // Spring Data JPA sẽ tự động hiểu hàm này
    // "Hãy viết một câu SQL SELECT * FROM USER WHERE Email = ?"
    Optional<User> findByEmail(String email);
}
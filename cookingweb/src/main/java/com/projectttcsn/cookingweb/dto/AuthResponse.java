package com.projectttcsn.cookingweb.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor // Lombok: Tự tạo constructor với tất cả tham số
public class AuthResponse {
    private String email;
    private String username;
    private String token; // JWT Token (sẽ làm sau)
}
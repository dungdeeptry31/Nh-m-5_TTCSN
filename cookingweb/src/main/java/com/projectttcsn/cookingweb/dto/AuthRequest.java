package com.projectttcsn.cookingweb.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRequest {
    private String username; // Dùng cho đăng ký
    private String email;
    private String password;
}
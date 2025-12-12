package com.projectttcsn.cookingweb.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {
    private String username; // Chúng ta chỉ cho phép sửa tên hiển thị
}
package com.projectttcsn.cookingweb.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtUtil {

    // Tạo một khóa bí mật (secret key) an toàn.
    // Phải đủ dài để dùng với thuật toán HS256
    private final Key SECRET_KEY = Keys.hmacShaKeyFor("daylamotchuoiBiMatRatAnToanDeTaoJWTTokenChoDoAn".getBytes());

    // Hàm tạo Token từ email
    public String generateToken(String email, String username) {
        return Jwts.builder()
                .setSubject(email) // Lưu email vào token
                .claim("username", username) // Thêm thông tin username
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // Hạn 10 tiếng
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // --- Các hàm tiện ích để đọc token (sẽ dùng sau) ---
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token).getBody();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }
}
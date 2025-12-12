package com.projectttcsn.cookingweb.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; 
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // === CẤU HÌNH CORS ===
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*")); 
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // === CẤU HÌNH BẢO MẬT API ===
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // 1. File tĩnh
                .requestMatchers("/uploads/**", "/images/**", "/css/**", "/js/**").permitAll()
                
                // 2. Auth
                .requestMatchers("/api/auth/**").permitAll()
                
                // 3. Users (Lấy info & Cập nhật profile) - MỚI
                .requestMatchers("/api/users/**").permitAll()
                
                // 4. Danh mục
                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                
                // 5. Món ăn (Bao gồm cả Tìm kiếm)
                .requestMatchers(HttpMethod.GET, "/api/recipes/search").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/recipes/category/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/recipes/{id}").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/recipes").permitAll()
                
                // 6. Tính năng khác (Chat, Yêu thích, Lịch sử - MỚI)
                .requestMatchers("/api/chat/**").permitAll()
                .requestMatchers("/api/favorites/**").permitAll()
                .requestMatchers("/api/history/**").permitAll() // <-- QUAN TRỌNG CHO LỊCH SỬ
                
                // Các request còn lại
                .anyRequest().permitAll()
            );
        
        return http.build();
    }
}
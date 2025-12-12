package com.projectttcsn.cookingweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean; // <-- THÊM
import org.springframework.web.client.RestTemplate; // <-- THÊM

@SpringBootApplication
public class CookingwebApplication {

    public static void main(String[] args) {
        SpringApplication.run(CookingwebApplication.class, args);
    }
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
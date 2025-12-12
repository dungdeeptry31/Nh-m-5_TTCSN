package com.projectttcsn.cookingweb.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Paths;

@Configuration
public class MvcConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadPath = Paths.get("./uploads").toFile().getAbsolutePath();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:/" + uploadPath + "/");
    }
}
package com.projectttcsn.cookingweb.filestorage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path root = Paths.get("uploads");

    public FileStorageService() {
        try {
            Files.createDirectories(root);
        } catch (Exception e) {
            throw new RuntimeException("Không thể tạo thư mục uploads!");
        }
    }

    public String storeFile(MultipartFile file) {
        try {
            // Tạo tên file ngẫu nhiên để tránh trùng tên
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.root.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi lưu file: " + e.getMessage());
        }
    }
}
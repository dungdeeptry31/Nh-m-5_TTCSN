package com.projectttcsn.cookingweb.controller;

import com.projectttcsn.cookingweb.entity.Category;
import com.projectttcsn.cookingweb.filestorage.FileStorageService;
import com.projectttcsn.cookingweb.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // 1. LẤY TẤT CẢ
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    // 2. LẤY CHI TIẾT
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Integer id) {
        return ResponseEntity.ok(categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục")));
    }

    // 3. THÊM MỚI (SỬA LỖI CÚ PHÁP)
    @PostMapping
    public ResponseEntity<?> createCategory(
            @RequestParam("name") String name,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        try {
            String imagePath = null;
            if (file != null && !file.isEmpty()) {
                imagePath = fileStorageService.storeFile(file);
            }

            Category category = new Category();
            category.setName(name);
            category.setImage(imagePath); // <-- ĐÃ SỬA: setImage(...)

            return ResponseEntity.ok(categoryRepository.save(category));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // 4. CẬP NHẬT
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Integer id,
            @RequestParam("name") String name,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "currentImage", required = false) String currentImage
    ) {
        try {
            Category category = categoryRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy"));

            String imagePath = currentImage;
            if (file != null && !file.isEmpty()) {
                imagePath = fileStorageService.storeFile(file);
            }

            category.setName(name);
            category.setImage(imagePath); // <-- ĐÃ SỬA: setImage(...)

            return ResponseEntity.ok(categoryRepository.save(category));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // 5. XÓA
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Integer id) {
        try {
            categoryRepository.deleteById(id);
            return ResponseEntity.ok("Đã xóa thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Không thể xóa (Danh mục này có thể đang chứa món ăn)");
        }
    }
}
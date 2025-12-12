package com.projectttcsn.cookingweb.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.List;
import java.util.HashMap;

@Service
public class ChatService {

    @Autowired
    private RestTemplate restTemplate;

    // 1. API Key của bạn
    private final String API_KEY = "AIzaSyCX25PxRvtSi_zYctUZYwuyFWPkp5TPzVk"; 
    
    // 2. URL CHÍNH XÁC CHO GEMINI 2.5 FLASH
    private final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    public String getChatResponse(String userPrompt) {
        String finalUrl = API_URL + "?key=" + API_KEY;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Cấu trúc Body
        Map<String, Object> part = new HashMap<>();
        part.put("text", "Bạn là trợ lý đầu bếp. Hãy trả lời ngắn gọn: " + userPrompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(part));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(content));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            // Gửi yêu cầu
            ResponseEntity<Map> response = restTemplate.postForEntity(finalUrl, entity, Map.class);
            
            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null) return "Lỗi: Google trả về rỗng.";

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            if (candidates == null || candidates.isEmpty()) return "AI không biết trả lời.";

            Map<String, Object> firstCandidate = candidates.get(0);
            
            // Kiểm tra nội dung
            if (!firstCandidate.containsKey("content") || firstCandidate.get("content") == null) {
                 return "AI từ chối trả lời (Safety Block).";
            }

            Map<String, Object> contentRes = (Map<String, Object>) firstCandidate.get("content");
            List<Map<String, Object>> partsRes = (List<Map<String, Object>>) contentRes.get("parts");
            
            return (String) partsRes.get(0).get("text");

        } catch (HttpClientErrorException e) {
            System.err.println("========== LỖI GOOGLE API ==========");
            System.err.println("URL: " + finalUrl);
            System.err.println("Response: " + e.getResponseBodyAsString());
            System.err.println("====================================");
            return "Lỗi API (" + e.getStatusCode() + "): " + e.getStatusText();
        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi hệ thống: " + e.getMessage();
        }
    }
}
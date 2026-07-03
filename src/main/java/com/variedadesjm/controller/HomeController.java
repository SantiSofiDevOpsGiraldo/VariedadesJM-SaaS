package com.variedadesjm.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
                "project", "Variedades JM",
                "status", "online",
                "version", "1.0.0",
                "framework", "Spring Boot 3",
                "database", "MySQL",
                "cloud", "Render",
                "author", "Enrique Giraldo"
        );
    }
}
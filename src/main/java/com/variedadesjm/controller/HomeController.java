package com.variedadesjm.controller;

import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
                "application", "Variedades JM API",
                "status", "online",
                "message", "Backend operativo y listo para la sustentación",
                "version", "1.0.0",
                "framework", "Spring Boot 3",
                "database", "MySQL",
                "author", "Enrique Giraldo"
        );
    }
}
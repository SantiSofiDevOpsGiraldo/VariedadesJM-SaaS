package com.variedadesjm.controller;

import com.variedadesjm.model.dto.auth.AuthResponse;
import com.variedadesjm.model.dto.auth.LoginRequest;
import com.variedadesjm.model.dto.auth.OnboardingRequest;
import com.variedadesjm.model.dto.auth.RegisterRequest;
import com.variedadesjm.model.dto.auth.OAuthRequest;
import com.variedadesjm.model.dto.auth.GoogleCallbackRequest;
import com.variedadesjm.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(
        origins = {
                "http://localhost",
                "http://localhost:*",
                "http://127.0.0.1",
                "http://127.0.0.1:*",
                "https://*.vercel.app",
                "https://variedades-jm.vercel.app",
                "https://variedades-jm-saa-s.vercel.app"
        },
        allowCredentials = "true",
        allowedHeaders = {"*"},
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS}
)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/oauth/google")
    public ResponseEntity<AuthResponse> oauthGoogle(@Valid @RequestBody OAuthRequest request) {
        AuthResponse response = authService.oauthGoogle(request.getIdToken());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/oauth/google/callback")
    public ResponseEntity<AuthResponse> oauthGoogleCallback(@Valid @RequestBody GoogleCallbackRequest request) {
        AuthResponse response = authService.oauthGoogleCallback(request.getCode());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/onboarding/company")
    public ResponseEntity<AuthResponse> completeOnboarding(Authentication authentication,
                                                           @Valid @RequestBody OnboardingRequest request) {
        return ResponseEntity.ok(authService.completeOnboarding(authentication.getName(), request));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(Authentication authentication) {
        return ResponseEntity.ok(authService.me(authentication.getName()));
    }
}

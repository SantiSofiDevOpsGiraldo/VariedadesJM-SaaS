package com.variedadesjm.service;

import com.variedadesjm.exception.BusinessException;
import com.variedadesjm.exception.ResourceNotFoundException;
import com.variedadesjm.model.dto.auth.AuthResponse;
import com.variedadesjm.model.dto.auth.LoginRequest;
import com.variedadesjm.model.dto.auth.OnboardingRequest;
import com.variedadesjm.model.dto.auth.RegisterRequest;
import com.variedadesjm.model.entity.Company;
import com.variedadesjm.model.entity.User;
import com.variedadesjm.model.enums.IdentityProvider;
import com.variedadesjm.model.enums.UserRole;
import com.variedadesjm.repository.CompanyRepository;
import com.variedadesjm.repository.UserRepository;
import com.variedadesjm.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${google.client.clientId:}")
    private String googleClientId;

    @Value("${google.client.clientSecret:}")
    private String googleClientSecret;

    @Value("${google.oauth.redirectUri:http://localhost:5173/auth/google/callback}")
    private String googleRedirectUri;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = getCurrentUser(request.getUsername());
        return toAuthResponse(user, tokenProvider.generateToken(user));
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Ya existe un usuario con el nombre: " + request.getUsername());
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Ya existe un usuario con el email: " + request.getEmail());
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .authProvider(IdentityProvider.EMAIL)
                .role(UserRole.EMPLOYEE)
                .onboardingCompleted(false)
                .active(true)
                .build();

        user = userRepository.save(user);
        return toAuthResponse(user, tokenProvider.generateToken(user));
    }

    public User getCurrentUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "username", username));
    }

    @Transactional
    public AuthResponse oauthGoogle(String idToken) {
        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            java.net.http.HttpRequest req = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken))
                    .GET()
                    .build();

            java.net.http.HttpResponse<String> resp = client.send(req, java.net.http.HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() != 200) {
                throw new BusinessException("Token de Google inválido");
            }

            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            java.util.Map<String, Object> payload = mapper.readValue(resp.body(), java.util.Map.class);

            String email = (String) payload.get("email");
            String name = (String) payload.get("name");
            if (email == null) throw new BusinessException("Google token no contiene email");

            User user = userRepository.findByEmail(email).orElseGet(() -> createIdentityUser(email, name, IdentityProvider.GOOGLE));
            return toAuthResponse(user, tokenProvider.generateToken(user));

        } catch (java.io.IOException | InterruptedException e) {
            throw new BusinessException("Error validando token de Google: " + e.getMessage());
        }
    }

    @Transactional
    public AuthResponse oauthGoogleCallback(String code) {
        if (googleClientId == null || googleClientId.isBlank() || googleClientSecret == null || googleClientSecret.isBlank()) {
            throw new BusinessException("Google OAuth client ID/secret no están configurados en el servidor");
        }

        try {
            String form = new StringBuilder()
                    .append("code=")
                    .append(java.net.URLEncoder.encode(code, java.nio.charset.StandardCharsets.UTF_8))
                    .append("&client_id=")
                    .append(java.net.URLEncoder.encode(googleClientId, java.nio.charset.StandardCharsets.UTF_8))
                    .append("&client_secret=")
                    .append(java.net.URLEncoder.encode(googleClientSecret, java.nio.charset.StandardCharsets.UTF_8))
                    .append("&redirect_uri=")
                    .append(java.net.URLEncoder.encode(googleRedirectUri, java.nio.charset.StandardCharsets.UTF_8))
                    .append("&grant_type=authorization_code")
                    .toString();

            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            java.net.http.HttpRequest req = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://oauth2.googleapis.com/token"))
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(java.net.http.HttpRequest.BodyPublishers.ofString(form))
                    .build();

            java.net.http.HttpResponse<String> resp = client.send(req, java.net.http.HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() != 200) {
                throw new BusinessException("Error intercambiando código de Google: " + resp.body());
            }

            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            java.util.Map<String, Object> tokenResp = mapper.readValue(resp.body(), java.util.Map.class);
            String idToken = (String) tokenResp.get("id_token");
            if (idToken == null) throw new BusinessException("Google token endpoint no devolvió id_token");

            java.net.http.HttpRequest validateReq = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken))
                    .GET()
                    .build();

            java.net.http.HttpResponse<String> validateResp = client.send(validateReq, java.net.http.HttpResponse.BodyHandlers.ofString());
            if (validateResp.statusCode() != 200) {
                throw new BusinessException("Token de Google inválido durante validación");
            }

            java.util.Map<String, Object> payload = mapper.readValue(validateResp.body(), java.util.Map.class);
            String email = (String) payload.get("email");
            String name = (String) payload.get("name");
            if (email == null) throw new BusinessException("Google token no contiene email");

            User user = userRepository.findByEmail(email).orElseGet(() -> createIdentityUser(email, name, IdentityProvider.GOOGLE));
            return toAuthResponse(user, tokenProvider.generateToken(user));

        } catch (java.io.IOException | InterruptedException e) {
            throw new BusinessException("Error intercambiando/validando token de Google: " + e.getMessage());
        }
    }

    @Transactional
    public AuthResponse completeOnboarding(String username, OnboardingRequest request) {
        User user = getCurrentUser(username);

        if (Boolean.TRUE.equals(user.getOnboardingCompleted()) && user.getCompany() != null) {
            return toAuthResponse(user, tokenProvider.generateToken(user));
        }

        if (companyRepository.existsByName(request.getCompanyName())) {
            throw new BusinessException("Ya existe una empresa con el nombre: " + request.getCompanyName());
        }

        if (companyRepository.existsByTaxId(request.getTaxId())) {
            throw new BusinessException("Ya existe una empresa con el NIT/ID fiscal: " + request.getTaxId());
        }

        Company company = Company.builder()
                .name(request.getCompanyName())
                .legalName(request.getLegalName())
                .taxId(request.getTaxId())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .city(request.getCity())
                .country(request.getCountry())
                .active(true)
                .build();
        company = companyRepository.save(company);

        user.setCompany(company);
        user.setRole(UserRole.OWNER);
        user.setOnboardingCompleted(true);
        if (user.getAuthProvider() == null) {
            user.setAuthProvider(IdentityProvider.EMAIL);
        }
        user = userRepository.save(user);

        return toAuthResponse(user, tokenProvider.generateToken(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse me(String username) {
        User user = getCurrentUser(username);
        return toAuthResponse(user, tokenProvider.generateToken(user));
    }

    private User createIdentityUser(String email, String name, IdentityProvider provider) {
        User user = User.builder()
                .username(email.split("@")[0])
                .email(email)
                .password(passwordEncoder.encode(java.util.UUID.randomUUID().toString()))
                .fullName(name != null ? name : email)
                .authProvider(provider)
                .role(UserRole.EMPLOYEE)
                .active(true)
                .onboardingCompleted(false)
                .build();
        return userRepository.save(user);
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .companyId(user.getCompany() != null ? user.getCompany().getId() : null)
                .companyName(user.getCompany() != null ? user.getCompany().getName() : null)
                .onboardingCompleted(Boolean.TRUE.equals(user.getOnboardingCompleted()))
                .authProvider(user.getAuthProvider() != null ? user.getAuthProvider().name() : null)
                .build();
    }
}

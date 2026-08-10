package com.variedadesjm.service;

import com.variedadesjm.exception.BusinessException;
import com.variedadesjm.exception.ResourceNotFoundException;
import com.variedadesjm.model.dto.auth.AuthResponse;
import com.variedadesjm.model.dto.auth.LoginRequest;
import com.variedadesjm.model.dto.auth.OnboardingRequest;
import com.variedadesjm.model.dto.auth.RegisterRequest;
import com.variedadesjm.model.entity.Company;
import com.variedadesjm.model.entity.UserIdentity;
import com.variedadesjm.model.entity.User;
import com.variedadesjm.model.enums.IdentityProvider;
import com.variedadesjm.model.enums.UserRole;
import com.variedadesjm.repository.CompanyRepository;
import com.variedadesjm.repository.UserIdentityRepository;
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
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.jwt.JwtValidators;

import java.util.Objects;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final UserIdentityRepository userIdentityRepository;
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
    @SuppressWarnings("null")
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

        user = Objects.requireNonNull(userRepository.save(user));
        return toAuthResponse(user, tokenProvider.generateToken(user));
    }

    public User getCurrentUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "username", username));
    }

    @Transactional
    public AuthResponse oauthGoogle(String idToken) {
        try {
            Jwt payload = verifyGoogleIdToken(idToken);
            return authenticateGooglePayload(payload);

        } catch (JwtException e) {
            throw new BusinessException("Error validando token de Google: " + e.getMessage());
        }
    }

    @Transactional
    @SuppressWarnings("null")
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
                Map<String, Object> tokenResp = mapper.readValue(
                    resp.body(),
                    new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {}
                );
            String idToken = (String) tokenResp.get("id_token");
            if (idToken == null) {
                throw new BusinessException("Google token endpoint no devolvió id_token");
            }

            Jwt payload = verifyGoogleIdToken(idToken);
            return authenticateGooglePayload(payload);

        } catch (java.io.IOException | InterruptedException e) {
            throw new BusinessException("Error intercambiando/validando token de Google: " + e.getMessage());
        } catch (JwtException e) {
            throw new BusinessException("Error validando token de Google: " + e.getMessage());
        }
    }

    @Transactional
    @SuppressWarnings("null")
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
        company = Objects.requireNonNull(companyRepository.save(company));

        user.setCompany(company);
        user.setRole(UserRole.OWNER);
        user.setOnboardingCompleted(true);
        if (user.getAuthProvider() == null) {
            user.setAuthProvider(IdentityProvider.EMAIL);
        }
        user = Objects.requireNonNull(userRepository.save(user));

        return toAuthResponse(user, tokenProvider.generateToken(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse me(String username) {
        User user = getCurrentUser(username);
        return toAuthResponse(user, tokenProvider.generateToken(user));
    }

    @SuppressWarnings("null")
    private User createIdentityUser(String email, String name, IdentityProvider provider) {
        String baseUsername = buildUniqueUsername(email);
        User user = User.builder()
                .username(baseUsername)
                .email(email)
                .password(null)
                .fullName(name != null ? name : email)
                .authProvider(provider)
                .role(UserRole.EMPLOYEE)
                .active(true)
                .onboardingCompleted(false)
                .build();
        return Objects.requireNonNull(userRepository.save(user));
    }

    private AuthResponse authenticateGooglePayload(Jwt payload) {
        String email = payload.getClaimAsString("email");
        Boolean emailVerified = payload.getClaimAsBoolean("email_verified");
        String providerUserId = payload.getSubject();
        String name = payload.getClaimAsString("name");

        if (email == null || email.isBlank()) {
            throw new BusinessException("Google token no contiene email");
        }
        if (providerUserId == null || providerUserId.isBlank()) {
            throw new BusinessException("Google token no contiene sub");
        }

        UserIdentity linkedIdentity = userIdentityRepository
                .findByProviderAndProviderUserId(IdentityProvider.GOOGLE, providerUserId)
                .orElse(null);

        User user;
        if (linkedIdentity != null) {
            user = linkedIdentity.getUser();
        } else {
            Optional<User> existingUser = userRepository.findByEmail(email);
            if (existingUser.isPresent()) {
                if (!Boolean.TRUE.equals(emailVerified)) {
                    throw new BusinessException("El correo de Google no está verificado, no se puede vincular la cuenta.");
                }
                user = existingUser.get();
                linkGoogleIdentity(user, providerUserId);
            } else {
                user = createIdentityUser(email, name, IdentityProvider.GOOGLE);
                linkGoogleIdentity(user, providerUserId);
            }
        }

        return toAuthResponse(user, tokenProvider.generateToken(user));
    }

    @SuppressWarnings("null")
    private void linkGoogleIdentity(User user, String providerUserId) {
        if (userIdentityRepository.existsByUser_IdAndProvider(user.getId(), IdentityProvider.GOOGLE)) {
            return;
        }

        UserIdentity identity = UserIdentity.builder()
                .user(user)
                .provider(IdentityProvider.GOOGLE)
                .providerUserId(providerUserId)
                .build();
        userIdentityRepository.save(Objects.requireNonNull(identity));
    }

    private String buildUniqueUsername(String email) {
        String localPart = email.split("@")[0].toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9._-]", "");
        String candidate = localPart.isBlank() ? "usuario" : localPart;
        int suffix = 1;

        while (userRepository.existsByUsername(candidate)) {
            candidate = localPart + "_" + suffix++;
        }

        return candidate;
    }

    private Jwt verifyGoogleIdToken(String idToken) {
        return buildGoogleJwtDecoder().decode(idToken);
    }

    private JwtDecoder buildGoogleJwtDecoder() {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withJwkSetUri("https://www.googleapis.com/oauth2/v3/certs").build();
        OAuth2TokenValidator<Jwt> validator = new DelegatingOAuth2TokenValidator<>(
                JwtValidators.createDefault(),
                jwt -> {
                    String issuer = jwt.getClaimAsString("iss");
                    boolean validIssuer = "https://accounts.google.com".equals(issuer) || "accounts.google.com".equals(issuer);
                    if (!validIssuer) {
                        return org.springframework.security.oauth2.core.OAuth2TokenValidatorResult.failure(
                                new OAuth2Error("invalid_token", "Issuer de Google inválido", null)
                        );
                    }
                    return org.springframework.security.oauth2.core.OAuth2TokenValidatorResult.success();
                },
                jwt -> {
                    Object audience = jwt.getClaims().get("aud");
                    boolean matches = false;
                    if (audience instanceof String audString) {
                        matches = googleClientId.equals(audString);
                    } else if (audience instanceof List<?> audList) {
                        matches = audList.contains(googleClientId);
                    }

                    if (!matches) {
                        return org.springframework.security.oauth2.core.OAuth2TokenValidatorResult.failure(
                                new OAuth2Error("invalid_token", "Google token con audience incorrecta", null)
                        );
                    }

                    return org.springframework.security.oauth2.core.OAuth2TokenValidatorResult.success();
                }
        );
        decoder.setJwtValidator(validator);
        return decoder;
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

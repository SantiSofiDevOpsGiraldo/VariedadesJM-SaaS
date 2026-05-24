package com.variedadesjm.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = getTokenFromRequest(request);

        if (StringUtils.hasText(token) && tokenProvider.validateToken(token)) {
            String username = tokenProvider.getUsernameFromToken(token);
            String role = tokenProvider.getRoleFromToken(token);
            Long companyId = tokenProvider.getCompanyIdFromToken(token);
            Boolean onboardingCompleted = tokenProvider.getOnboardingCompletedFromToken(token);

            if (Boolean.FALSE.equals(onboardingCompleted) && !isOnboardingAllowedRequest(request)) {
                throw new AccessDeniedException("Debe completar el onboarding empresarial para continuar");
            }
            if (companyId == null && !isAuthInitializationRequest(request)) {
                throw new AccessDeniedException("La sesión no contiene contexto de empresa");
            }

            List<SimpleGrantedAuthority> authorities = List.of(
                    new SimpleGrantedAuthority("ROLE_" + role)
            );

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(username, null, authorities);
            authentication.setDetails(new JwtTenantContext(companyId, onboardingCompleted));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            TenantContext.setCompanyId(companyId);
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private boolean isOnboardingAllowedRequest(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/onboarding/") || path.equals("/api/auth/me");
    }

    private boolean isAuthInitializationRequest(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/");
    }

    public record JwtTenantContext(Long companyId, Boolean onboardingCompleted) {}
}

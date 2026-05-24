package com.variedadesjm.model.dto.auth;

import com.variedadesjm.model.enums.UserRole;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String username;
    private String fullName;
    private UserRole role;
    private Long companyId;
    private String companyName;
    private Boolean onboardingCompleted;
    private String authProvider;
}

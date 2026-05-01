package com.cajaclara.model.dto.auth;

import com.cajaclara.model.enums.UserRole;
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
}

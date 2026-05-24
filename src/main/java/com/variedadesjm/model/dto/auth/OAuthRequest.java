package com.variedadesjm.model.dto.auth;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;

@Data
public class OAuthRequest {
    @NotBlank
    private String idToken;
}

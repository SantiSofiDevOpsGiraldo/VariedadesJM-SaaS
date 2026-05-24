package com.variedadesjm.model.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OnboardingRequest {
    @NotBlank private String companyName;
    @NotBlank private String legalName;
    @NotBlank private String taxId;
    @NotBlank private String email;
    @NotBlank private String phone;
    @NotBlank private String address;
    @NotBlank private String city;
    @NotBlank private String country;
}

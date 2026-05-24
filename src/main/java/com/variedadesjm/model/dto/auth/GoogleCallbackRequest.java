package com.variedadesjm.model.dto.auth;

import lombok.Data;

@Data
public class GoogleCallbackRequest {
    private String code;
}

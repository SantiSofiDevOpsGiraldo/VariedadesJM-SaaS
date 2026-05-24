package com.variedadesjm.model.dto.service;

import com.variedadesjm.model.enums.ServiceStatus;
import com.variedadesjm.model.enums.ServiceType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceResponse {

    private Long id;
    private String title;
    private String clientName;
    private String phone;
    private ServiceStatus status;
    private BigDecimal budget;
    private BigDecimal advance;
    private ServiceType type;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ServicePaymentResponse> payments;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ServicePaymentResponse {
        private Long id;
        private BigDecimal amount;
        private String method;
        private String description;
        private LocalDateTime createdAt;
    }
}

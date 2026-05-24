package com.variedadesjm.mapper;

import com.variedadesjm.model.dto.service.ServiceRequest;
import com.variedadesjm.model.dto.service.ServiceResponse;
import com.variedadesjm.model.entity.Service;
import com.variedadesjm.model.entity.ServicePayment;
import com.variedadesjm.model.enums.ServiceStatus;

import java.math.BigDecimal;
import java.util.stream.Collectors;

public class ServiceMapper {

    private ServiceMapper() {}

    public static Service toEntity(ServiceRequest request) {
        return Service.builder()
                .title(request.getTitle())
                .clientName(request.getClientName())
                .phone(request.getPhone())
                .type(request.getType())
                .budget(request.getBudget())
                .advance(BigDecimal.ZERO)
                .status(ServiceStatus.PENDIENTE)
                .build();
    }

    public static ServiceResponse toResponse(Service service) {
        return ServiceResponse.builder()
                .id(service.getId())
                .title(service.getTitle())
                .clientName(service.getClientName())
                .phone(service.getPhone())
                .status(service.getStatus())
                .budget(service.getBudget())
                .advance(service.getAdvance())
                .type(service.getType())
                .createdAt(service.getCreatedAt())
                .updatedAt(service.getUpdatedAt())
                .payments(service.getPayments().stream()
                        .map(ServiceMapper::toPaymentResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    public static ServiceResponse.ServicePaymentResponse toPaymentResponse(ServicePayment payment) {
        return ServiceResponse.ServicePaymentResponse.builder()
                .id(payment.getId())
                .amount(payment.getAmount())
                .method(payment.getMethod().name())
                .description(payment.getDescription())
                .createdAt(payment.getCreatedAt())
                .build();
    }

    public static void updateEntity(Service service, ServiceRequest request) {
        service.setTitle(request.getTitle());
        service.setClientName(request.getClientName());
        service.setPhone(request.getPhone());
        service.setType(request.getType());
        service.setBudget(request.getBudget());
    }
}

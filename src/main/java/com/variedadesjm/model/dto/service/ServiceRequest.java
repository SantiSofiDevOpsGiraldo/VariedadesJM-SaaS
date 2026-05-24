package com.variedadesjm.model.dto.service;

import com.variedadesjm.model.enums.ServiceType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRequest {

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 200)
    private String title;

    @NotBlank(message = "El nombre del cliente es obligatorio")
    @Size(max = 100)
    private String clientName;

    @Size(max = 20)
    private String phone;

    @NotNull(message = "El tipo de servicio es obligatorio")
    private ServiceType type;

    @NotNull(message = "El presupuesto es obligatorio")
    @DecimalMin(value = "0.01", message = "El presupuesto debe ser mayor a 0")
    private BigDecimal budget;
}

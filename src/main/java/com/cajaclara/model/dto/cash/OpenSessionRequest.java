package com.cajaclara.model.dto.cash;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpenSessionRequest {

    @NotNull(message = "La base inicial es obligatoria")
    @DecimalMin(value = "0", message = "La base inicial no puede ser negativa")
    private BigDecimal initialBase;
}

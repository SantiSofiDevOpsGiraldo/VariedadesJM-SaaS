package com.variedadesjm.model.dto.cash;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CloseSessionRequest {

    @NotNull(message = "El total actual es obligatorio")
    @DecimalMin(value = "0", message = "El total actual no puede ser negativo")
    private BigDecimal actualTotal;
}

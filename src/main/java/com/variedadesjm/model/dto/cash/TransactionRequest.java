package com.variedadesjm.model.dto.cash;

import com.variedadesjm.model.enums.PaymentMethod;
import com.variedadesjm.model.enums.TransactionType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionRequest {

    @NotNull(message = "El tipo de transacción es obligatorio")
    private TransactionType type;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    private BigDecimal amount;

    @Size(max = 300)
    private String description;

    @NotNull(message = "El método de pago es obligatorio")
    private PaymentMethod method;

    @Size(max = 50)
    private String referenceId;
}

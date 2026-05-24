package com.variedadesjm.model.dto.cash;

import com.variedadesjm.model.enums.PaymentMethod;
import com.variedadesjm.model.enums.TransactionType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CashTransactionResponse {

    private Long id;
    private Long sessionId;
    private TransactionType type;
    private BigDecimal amount;
    private String description;
    private PaymentMethod method;
    private String referenceId;
    private LocalDateTime createdAt;
}

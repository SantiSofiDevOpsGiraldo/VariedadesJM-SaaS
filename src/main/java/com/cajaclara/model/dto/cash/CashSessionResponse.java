package com.cajaclara.model.dto.cash;

import com.cajaclara.model.enums.CashSessionStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CashSessionResponse {

    private Long id;
    private LocalDateTime openedAt;
    private LocalDateTime closedAt;
    private String openedBy;
    private String closedBy;
    private BigDecimal initialBase;
    private CashSessionStatus status;
    private BigDecimal expectedTotal;
    private BigDecimal actualTotal;
    private BigDecimal totalIngresos;
    private BigDecimal totalEgresos;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

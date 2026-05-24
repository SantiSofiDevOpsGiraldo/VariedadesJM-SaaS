package com.variedadesjm.mapper;

import com.variedadesjm.model.dto.cash.CashSessionResponse;
import com.variedadesjm.model.entity.CashSession;

public class CashSessionMapper {

    private CashSessionMapper() {}

    public static CashSessionResponse toResponse(CashSession session) {
        return CashSessionResponse.builder()
                .id(session.getId())
                .openedAt(session.getOpenedAt())
                .closedAt(session.getClosedAt())
                .openedBy(session.getOpenedBy())
                .closedBy(session.getClosedBy())
                .initialBase(session.getInitialBase())
                .status(session.getStatus())
                .expectedTotal(session.getExpectedTotal())
                .actualTotal(session.getActualTotal())
                .createdAt(session.getCreatedAt())
                .updatedAt(session.getUpdatedAt())
                .build();
    }

    public static CashSessionResponse toResponseWithTotals(CashSession session,
                                                            java.math.BigDecimal totalIngresos,
                                                            java.math.BigDecimal totalEgresos) {
        return CashSessionResponse.builder()
                .id(session.getId())
                .openedAt(session.getOpenedAt())
                .closedAt(session.getClosedAt())
                .openedBy(session.getOpenedBy())
                .closedBy(session.getClosedBy())
                .initialBase(session.getInitialBase())
                .status(session.getStatus())
                .expectedTotal(session.getExpectedTotal())
                .actualTotal(session.getActualTotal())
                .totalIngresos(totalIngresos)
                .totalEgresos(totalEgresos)
                .createdAt(session.getCreatedAt())
                .updatedAt(session.getUpdatedAt())
                .build();
    }
}

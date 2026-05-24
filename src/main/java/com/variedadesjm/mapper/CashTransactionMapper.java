package com.variedadesjm.mapper;

import com.variedadesjm.model.dto.cash.CashTransactionResponse;
import com.variedadesjm.model.entity.CashTransaction;

public class CashTransactionMapper {

    private CashTransactionMapper() {}

    public static CashTransactionResponse toResponse(CashTransaction transaction) {
        return CashTransactionResponse.builder()
                .id(transaction.getId())
                .sessionId(transaction.getSession().getId())
                .type(transaction.getType())
                .amount(transaction.getAmount())
                .description(transaction.getDescription())
                .method(transaction.getMethod())
                .referenceId(transaction.getReferenceId())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}

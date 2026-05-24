package com.variedadesjm.mapper;

import com.variedadesjm.model.dto.sale.SaleRequest;
import com.variedadesjm.model.dto.sale.SaleResponse;
import com.variedadesjm.model.entity.Sale;
import com.variedadesjm.model.entity.SaleItem;

import java.util.stream.Collectors;

public class SaleMapper {

    private SaleMapper() {}

    public static SaleResponse toResponse(Sale sale) {
        return SaleResponse.builder()
                .id(sale.getId())
                .subtotal(sale.getSubtotal())
                .tax(sale.getTax())
                .total(sale.getTotal())
                .method(sale.getMethod())
                .cashierId(sale.getCashierId())
                .createdAt(sale.getCreatedAt())
                .items(sale.getItems().stream()
                        .map(SaleMapper::toItemResponse)
                        .collect(Collectors.toList()))
                .build();
    }

    public static SaleResponse.SaleItemResponse toItemResponse(SaleItem item) {
        return SaleResponse.SaleItemResponse.builder()
                .id(item.getId())
                .productId(item.getProductId())
                .productName(item.getProductName())
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .build();
    }
}

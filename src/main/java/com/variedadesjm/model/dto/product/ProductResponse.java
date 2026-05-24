package com.variedadesjm.model.dto.product;

import com.variedadesjm.model.enums.ProductCategory;
import com.variedadesjm.model.enums.ProductStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Long id;
    private String code;
    private String name;
    private ProductCategory category;
    private BigDecimal price;
    private Integer stock;
    private String img;
    private ProductStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

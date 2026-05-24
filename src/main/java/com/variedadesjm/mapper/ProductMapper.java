package com.variedadesjm.mapper;

import com.variedadesjm.model.dto.product.ProductRequest;
import com.variedadesjm.model.dto.product.ProductResponse;
import com.variedadesjm.model.entity.Product;
import com.variedadesjm.model.enums.ProductStatus;

public class ProductMapper {

    private ProductMapper() {}

    public static Product toEntity(ProductRequest request) {
        return Product.builder()
                .code(request.getCode())
                .name(request.getName())
                .category(request.getCategory())
                .price(request.getPrice())
                .stock(request.getStock())
                .img(request.getImg())
                .status(request.getStatus() != null ? request.getStatus() : ProductStatus.SALUDABLE)
                .build();
    }

    public static ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .code(product.getCode())
                .name(product.getName())
                .category(product.getCategory())
                .price(product.getPrice())
                .stock(product.getStock())
                .img(product.getImg())
                .status(product.getStatus())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    public static void updateEntity(Product product, ProductRequest request) {
        product.setCode(request.getCode());
        product.setName(request.getName());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setImg(request.getImg());
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }
    }
}

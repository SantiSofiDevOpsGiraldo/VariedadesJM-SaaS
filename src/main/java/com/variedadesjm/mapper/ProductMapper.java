package com.variedadesjm.mapper;

import com.variedadesjm.model.dto.product.ProductRequest;
import com.variedadesjm.model.dto.product.ProductResponse;
import com.variedadesjm.model.entity.Product;
import com.variedadesjm.model.enums.ProductStatus;
import com.variedadesjm.util.InputSanitizer;

public class ProductMapper {

    private ProductMapper() {}

    public static Product toEntity(ProductRequest request) {
        String imageUrl = effectiveImageUrl(request);
        return Product.builder()
            .code(InputSanitizer.clean(request.getCode()))
            .name(InputSanitizer.clean(request.getName()))
                .category(request.getCategory())
                .price(request.getPrice())
                .stock(request.getStock())
            .img(imageUrl)
            .imageUrl(imageUrl)
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
                .imageUrl(product.getImageUrl() != null ? product.getImageUrl() : product.getImg())
                .status(product.getStatus())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    public static void updateEntity(Product product, ProductRequest request) {
        String imageUrl = effectiveImageUrl(request);
        product.setCode(InputSanitizer.clean(request.getCode()));
        product.setName(InputSanitizer.clean(request.getName()));
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setImg(imageUrl);
        product.setImageUrl(imageUrl);
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }
    }

    private static String effectiveImageUrl(ProductRequest request) {
        String imageUrl = InputSanitizer.clean(request.getImageUrl());
        return imageUrl != null ? imageUrl : InputSanitizer.clean(request.getImg());
    }
}

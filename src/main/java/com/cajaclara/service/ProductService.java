package com.cajaclara.service;

import com.cajaclara.exception.BusinessException;
import com.cajaclara.exception.ResourceNotFoundException;
import com.cajaclara.mapper.ProductMapper;
import com.cajaclara.model.dto.product.ProductRequest;
import com.cajaclara.model.dto.product.ProductResponse;
import com.cajaclara.model.entity.Product;
import com.cajaclara.model.enums.ProductStatus;
import com.cajaclara.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<ProductResponse> getAll() {
        return productRepository.findAll().stream()
                .map(ProductMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        Product product = findOrThrow(id);
        return ProductMapper.toResponse(product);
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        if (productRepository.existsByCode(request.getCode())) {
            throw new BusinessException("Ya existe un producto con el código: " + request.getCode());
        }

        Product product = ProductMapper.toEntity(request);
        updateProductStatus(product);
        product = productRepository.save(product);
        return ProductMapper.toResponse(product);
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findOrThrow(id);

        if (!product.getCode().equals(request.getCode()) && productRepository.existsByCode(request.getCode())) {
            throw new BusinessException("Ya existe un producto con el código: " + request.getCode());
        }

        ProductMapper.updateEntity(product, request);
        updateProductStatus(product);
        product = productRepository.save(product);
        return ProductMapper.toResponse(product);
    }

    @Transactional
    public void delete(Long id) {
        Product product = findOrThrow(id);
        productRepository.delete(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getLowStock() {
        return productRepository.findByStockLessThan(10).stream()
                .map(ProductMapper::toResponse)
                .collect(Collectors.toList());
    }

    private Product findOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
    }

    public void updateProductStatus(Product product) {
        if (product.getStock() <= 0) {
            product.setStatus(ProductStatus.AGOTADO);
        } else if (product.getStock() < 10) {
            product.setStatus(ProductStatus.STOCK_BAJO);
        } else {
            product.setStatus(ProductStatus.SALUDABLE);
        }
    }
}

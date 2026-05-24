package com.variedadesjm.service;

import com.variedadesjm.exception.BusinessException;
import com.variedadesjm.exception.ResourceNotFoundException;
import com.variedadesjm.mapper.ProductMapper;
import com.variedadesjm.model.dto.product.ProductRequest;
import com.variedadesjm.model.dto.product.ProductResponse;
import com.variedadesjm.model.entity.Company;
import com.variedadesjm.model.entity.Product;
import com.variedadesjm.model.enums.ProductStatus;
import com.variedadesjm.repository.ProductRepository;
import com.variedadesjm.security.TenantContext;
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
        Long companyId = requireCompanyId();
        return productRepository.findByCompany_Id(companyId).stream()
                .map(ProductMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponse getById(Long id) {
        Long companyId = requireCompanyId();
        Product product = productRepository.findByIdAndCompany_Id(id, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
        return ProductMapper.toResponse(product);
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Long companyId = requireCompanyId();
        if (productRepository.existsByCodeAndCompany_Id(request.getCode(), companyId)) {
            throw new BusinessException("Ya existe un producto con el código: " + request.getCode());
        }

        Product product = ProductMapper.toEntity(request);
        product.setCompany(Company.builder().id(companyId).build());
        updateProductStatus(product);
        product = productRepository.save(product);
        return ProductMapper.toResponse(product);
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Long companyId = requireCompanyId();
        Product product = productRepository.findByIdAndCompany_Id(id, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));

        if (!product.getCode().equals(request.getCode()) && productRepository.existsByCodeAndCompany_Id(request.getCode(), companyId)) {
            throw new BusinessException("Ya existe un producto con el código: " + request.getCode());
        }

        ProductMapper.updateEntity(product, request);
        updateProductStatus(product);
        product = productRepository.save(product);
        return ProductMapper.toResponse(product);
    }

    @Transactional
    public void delete(Long id) {
        Long companyId = requireCompanyId();
        Product product = productRepository.findByIdAndCompany_Id(id, companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", id));
        productRepository.delete(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getLowStock() {
        Long companyId = requireCompanyId();
        return productRepository.findByStockLessThanAndCompany_Id(10, companyId).stream()
                .map(ProductMapper::toResponse)
                .collect(Collectors.toList());
    }

    private Long requireCompanyId() {
        Long companyId = TenantContext.getCompanyId();
        if (companyId == null) {
            throw new BusinessException("El usuario debe completar el onboarding empresarial antes de usar esta funcionalidad.");
        }
        return companyId;
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

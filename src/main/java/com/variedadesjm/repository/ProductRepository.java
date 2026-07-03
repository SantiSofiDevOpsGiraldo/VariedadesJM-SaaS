package com.variedadesjm.repository;

import com.variedadesjm.model.entity.Product;
import com.variedadesjm.model.enums.ProductCategory;
import com.variedadesjm.model.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByCodeAndCompany_Id(String code, Long companyId);

    Optional<Product> findByIdAndCompany_Id(Long id, Long companyId);

    List<Product> findByCompany_Id(Long companyId);

    List<Product> findByCategory(ProductCategory category);

    List<Product> findByCategoryAndCompany_Id(ProductCategory category, Long companyId);

    List<Product> findByStatus(ProductStatus status);

    List<Product> findByStatusAndCompany_Id(ProductStatus status, Long companyId);

    List<Product> findByStockLessThan(Integer stock);

    List<Product> findByStockLessThanAndCompany_Id(Integer stock, Long companyId);

    List<Product> findByStatusIn(List<ProductStatus> statuses);

    boolean existsByCodeAndCompany_Id(String code, Long companyId);
}

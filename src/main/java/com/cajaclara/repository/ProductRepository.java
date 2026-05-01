package com.cajaclara.repository;

import com.cajaclara.model.entity.Product;
import com.cajaclara.model.enums.ProductCategory;
import com.cajaclara.model.enums.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByCode(String code);

    List<Product> findByCategory(ProductCategory category);

    List<Product> findByStatus(ProductStatus status);

    List<Product> findByStockLessThan(Integer stock);

    List<Product> findByStatusIn(List<ProductStatus> statuses);

    boolean existsByCode(String code);
}

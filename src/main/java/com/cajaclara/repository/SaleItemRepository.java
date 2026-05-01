package com.cajaclara.repository;

import com.cajaclara.model.entity.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SaleItemRepository extends JpaRepository<SaleItem, Long> {

    List<SaleItem> findBySaleId(Long saleId);

    @Query("SELECT si.productId, si.productName, SUM(si.quantity) as totalQuantity, SUM(si.price * si.quantity) as totalRevenue " +
           "FROM SaleItem si JOIN si.sale s " +
           "WHERE s.createdAt BETWEEN :from AND :to " +
           "GROUP BY si.productId, si.productName " +
           "ORDER BY totalQuantity DESC")
    List<Object[]> findTopProductsByDateRange(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}

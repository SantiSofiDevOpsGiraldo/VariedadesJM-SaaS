package com.variedadesjm.repository;

import com.variedadesjm.model.entity.SaleItem;
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
            "WHERE s.createdAt BETWEEN :from AND :to AND s.company.id = :companyId " +
           "GROUP BY si.productId, si.productName " +
           "ORDER BY totalQuantity DESC")
        List<Object[]> findTopProductsByDateRangeAndCompany_Id(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to, @Param("companyId") Long companyId);
}

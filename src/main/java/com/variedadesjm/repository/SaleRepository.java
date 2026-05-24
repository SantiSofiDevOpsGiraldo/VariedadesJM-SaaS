package com.variedadesjm.repository;

import com.variedadesjm.model.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    java.util.Optional<Sale> findByIdAndCompany_Id(Long id, Long companyId);

    List<Sale> findByCompany_Id(Long companyId);

    List<Sale> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    List<Sale> findByCreatedAtBetweenAndCompany_Id(LocalDateTime from, LocalDateTime to, Long companyId);

    List<Sale> findByCashierId(Long cashierId);

    List<Sale> findByCashierIdAndCompany_Id(Long cashierId, Long companyId);

    @Query("SELECT COALESCE(SUM(s.total), 0) FROM Sale s WHERE s.createdAt BETWEEN :from AND :to AND s.company.id = :companyId")
    BigDecimal sumTotalByCreatedAtBetweenAndCompany_Id(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to, @Param("companyId") Long companyId);

    @Query("SELECT COUNT(s) FROM Sale s WHERE s.createdAt BETWEEN :from AND :to AND s.company.id = :companyId")
    Long countByCreatedAtBetweenAndCompany_Id(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to, @Param("companyId") Long companyId);

    @Query("SELECT s FROM Sale s WHERE DATE(s.createdAt) = DATE(:date) AND s.company.id = :companyId")
    List<Sale> findByCreatedAtDateAndCompany_Id(@Param("date") LocalDateTime date, @Param("companyId") Long companyId);

    @Query("SELECT COALESCE(SUM(s.total), 0) FROM Sale s WHERE DATE(s.createdAt) = DATE(:date) AND s.company.id = :companyId")
    BigDecimal sumTotalByDateAndCompany_Id(@Param("date") LocalDateTime date, @Param("companyId") Long companyId);

    @Query("SELECT COUNT(s) FROM Sale s WHERE DATE(s.createdAt) = DATE(:date) AND s.company.id = :companyId")
    Long countByDateAndCompany_Id(@Param("date") LocalDateTime date, @Param("companyId") Long companyId);
}

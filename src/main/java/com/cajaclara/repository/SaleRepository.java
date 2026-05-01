package com.cajaclara.repository;

import com.cajaclara.model.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    List<Sale> findByCreatedAtBetween(LocalDateTime from, LocalDateTime to);

    List<Sale> findByCashierId(Long cashierId);

    @Query("SELECT COALESCE(SUM(s.total), 0) FROM Sale s WHERE s.createdAt BETWEEN :from AND :to")
    BigDecimal sumTotalByCreatedAtBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT COUNT(s) FROM Sale s WHERE s.createdAt BETWEEN :from AND :to")
    Long countByCreatedAtBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT s FROM Sale s WHERE DATE(s.createdAt) = DATE(:date)")
    List<Sale> findByCreatedAtDate(@Param("date") LocalDateTime date);

    @Query("SELECT COALESCE(SUM(s.total), 0) FROM Sale s WHERE DATE(s.createdAt) = DATE(:date)")
    BigDecimal sumTotalByDate(@Param("date") LocalDateTime date);

    @Query("SELECT COUNT(s) FROM Sale s WHERE DATE(s.createdAt) = DATE(:date)")
    Long countByDate(@Param("date") LocalDateTime date);
}

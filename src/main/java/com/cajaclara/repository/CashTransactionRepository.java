package com.cajaclara.repository;

import com.cajaclara.model.entity.CashTransaction;
import com.cajaclara.model.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CashTransactionRepository extends JpaRepository<CashTransaction, Long> {

    List<CashTransaction> findBySessionIdOrderByCreatedAtDesc(Long sessionId);

    List<CashTransaction> findBySessionIdAndType(Long sessionId, TransactionType type);

    @Query("SELECT COALESCE(SUM(ct.amount), 0) FROM CashTransaction ct WHERE ct.session.id = :sessionId AND ct.type = :type")
    BigDecimal sumAmountBySessionIdAndType(@Param("sessionId") Long sessionId, @Param("type") TransactionType type);
}

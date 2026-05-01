package com.cajaclara.repository;

import com.cajaclara.model.entity.CashSession;
import com.cajaclara.model.enums.CashSessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CashSessionRepository extends JpaRepository<CashSession, Long> {

    Optional<CashSession> findByStatus(CashSessionStatus status);

    boolean existsByStatus(CashSessionStatus status);
}

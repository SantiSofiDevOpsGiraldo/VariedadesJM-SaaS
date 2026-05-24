package com.variedadesjm.repository;

import com.variedadesjm.model.entity.CashSession;
import com.variedadesjm.model.enums.CashSessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CashSessionRepository extends JpaRepository<CashSession, Long> {

    Optional<CashSession> findByIdAndCompany_Id(Long id, Long companyId);

    Optional<CashSession> findByStatus(CashSessionStatus status);

    Optional<CashSession> findByStatusAndCompany_Id(CashSessionStatus status, Long companyId);

    boolean existsByStatus(CashSessionStatus status);

    boolean existsByStatusAndCompany_Id(CashSessionStatus status, Long companyId);
}

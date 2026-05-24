package com.variedadesjm.repository;

import com.variedadesjm.model.entity.Affiliate;
import com.variedadesjm.model.enums.AffiliateLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AffiliateRepository extends JpaRepository<Affiliate, Long> {

    Optional<Affiliate> findByIdAndCompany_Id(Long id, Long companyId);

    Optional<Affiliate> findByIdDocument(String idDocument);

    Optional<Affiliate> findByIdDocumentAndCompany_Id(String idDocument, Long companyId);

    List<Affiliate> findByCompany_Id(Long companyId);

    List<Affiliate> findByLevel(AffiliateLevel level);

    List<Affiliate> findByLevelAndCompany_Id(AffiliateLevel level, Long companyId);

    boolean existsByIdDocument(String idDocument);

    boolean existsByIdDocumentAndCompany_Id(String idDocument, Long companyId);
}

package com.cajaclara.repository;

import com.cajaclara.model.entity.Affiliate;
import com.cajaclara.model.enums.AffiliateLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AffiliateRepository extends JpaRepository<Affiliate, Long> {

    Optional<Affiliate> findByIdDocument(String idDocument);

    List<Affiliate> findByLevel(AffiliateLevel level);

    boolean existsByIdDocument(String idDocument);
}

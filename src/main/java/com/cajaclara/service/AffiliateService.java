package com.cajaclara.service;

import com.cajaclara.exception.BusinessException;
import com.cajaclara.exception.ResourceNotFoundException;
import com.cajaclara.mapper.AffiliateMapper;
import com.cajaclara.model.dto.affiliate.AffiliateRequest;
import com.cajaclara.model.dto.affiliate.AffiliateResponse;
import com.cajaclara.model.entity.Affiliate;
import com.cajaclara.model.enums.AffiliateLevel;
import com.cajaclara.repository.AffiliateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AffiliateService {

    private final AffiliateRepository affiliateRepository;

    @Transactional(readOnly = true)
    public List<AffiliateResponse> getAll() {
        return affiliateRepository.findAll().stream()
                .map(AffiliateMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AffiliateResponse getById(Long id) {
        Affiliate affiliate = findOrThrow(id);
        return AffiliateMapper.toResponse(affiliate);
    }

    @Transactional
    public AffiliateResponse create(AffiliateRequest request) {
        if (affiliateRepository.existsByIdDocument(request.getIdDocument())) {
            throw new BusinessException("Ya existe un afiliado con el documento: " + request.getIdDocument());
        }

        Affiliate affiliate = AffiliateMapper.toEntity(request);
        affiliate = affiliateRepository.save(affiliate);
        return AffiliateMapper.toResponse(affiliate);
    }

    @Transactional
    public AffiliateResponse update(Long id, AffiliateRequest request) {
        Affiliate affiliate = findOrThrow(id);

        if (!affiliate.getIdDocument().equals(request.getIdDocument())
                && affiliateRepository.existsByIdDocument(request.getIdDocument())) {
            throw new BusinessException("Ya existe un afiliado con el documento: " + request.getIdDocument());
        }

        AffiliateMapper.updateEntity(affiliate, request);
        updateAffiliateLevel(affiliate);
        affiliate = affiliateRepository.save(affiliate);
        return AffiliateMapper.toResponse(affiliate);
    }

    @Transactional
    public AffiliateResponse addPoints(Long id, Integer points) {
        Affiliate affiliate = findOrThrow(id);
        affiliate.setPoints(affiliate.getPoints() + points);
        updateAffiliateLevel(affiliate);
        affiliate = affiliateRepository.save(affiliate);
        return AffiliateMapper.toResponse(affiliate);
    }

    private Affiliate findOrThrow(Long id) {
        return affiliateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Afiliado", "id", id));
    }

    // Rule 8: Affiliate levels based on points
    private void updateAffiliateLevel(Affiliate affiliate) {
        if (affiliate.getPoints() >= 5000) {
            affiliate.setLevel(AffiliateLevel.ORO);
        } else if (affiliate.getPoints() >= 2000) {
            affiliate.setLevel(AffiliateLevel.PLATA);
        } else {
            affiliate.setLevel(AffiliateLevel.BRONCE);
        }
    }
}

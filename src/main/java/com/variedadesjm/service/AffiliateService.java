package com.variedadesjm.service;

import com.variedadesjm.exception.BusinessException;
import com.variedadesjm.exception.ResourceNotFoundException;
import com.variedadesjm.mapper.AffiliateMapper;
import com.variedadesjm.model.dto.affiliate.AffiliateRequest;
import com.variedadesjm.model.dto.affiliate.AffiliateResponse;
import com.variedadesjm.model.entity.Company;
import com.variedadesjm.model.entity.Affiliate;
import com.variedadesjm.model.enums.AffiliateLevel;
import com.variedadesjm.repository.AffiliateRepository;
import com.variedadesjm.security.TenantContext;
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
        Long companyId = requireCompanyId();
        return affiliateRepository.findByCompany_Id(companyId).stream()
                .map(AffiliateMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AffiliateResponse getById(Long id) {
        Affiliate affiliate = affiliateRepository.findByIdAndCompany_Id(id, requireCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Afiliado", "id", id));
        return AffiliateMapper.toResponse(affiliate);
    }

    @Transactional
    public AffiliateResponse create(AffiliateRequest request) {
        Long companyId = requireCompanyId();
        if (affiliateRepository.existsByIdDocumentAndCompany_Id(request.getIdDocument(), companyId)) {
            throw new BusinessException("Ya existe un afiliado con el documento: " + request.getIdDocument());
        }

        Affiliate affiliate = AffiliateMapper.toEntity(request);
        affiliate.setCompany(Company.builder().id(companyId).build());
        affiliate = affiliateRepository.save(affiliate);
        return AffiliateMapper.toResponse(affiliate);
    }

    @Transactional
    public AffiliateResponse update(Long id, AffiliateRequest request) {
        Long companyId = requireCompanyId();
        Affiliate affiliate = affiliateRepository.findByIdAndCompany_Id(id, companyId)
            .orElseThrow(() -> new ResourceNotFoundException("Afiliado", "id", id));

        if (!affiliate.getIdDocument().equals(request.getIdDocument())
            && affiliateRepository.existsByIdDocumentAndCompany_Id(request.getIdDocument(), companyId)) {
            throw new BusinessException("Ya existe un afiliado con el documento: " + request.getIdDocument());
        }

        AffiliateMapper.updateEntity(affiliate, request);
        updateAffiliateLevel(affiliate);
        affiliate = affiliateRepository.save(affiliate);
        return AffiliateMapper.toResponse(affiliate);
    }

    @Transactional
    public AffiliateResponse addPoints(Long id, Integer points) {
        Affiliate affiliate = affiliateRepository.findByIdAndCompany_Id(id, requireCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Afiliado", "id", id));
        affiliate.setPoints(affiliate.getPoints() + points);
        updateAffiliateLevel(affiliate);
        affiliate = affiliateRepository.save(affiliate);
        return AffiliateMapper.toResponse(affiliate);
    }

    private Long requireCompanyId() {
        Long companyId = TenantContext.getCompanyId();
        if (companyId == null) {
            throw new BusinessException("El usuario debe completar el onboarding empresarial antes de usar esta funcionalidad.");
        }
        return companyId;
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

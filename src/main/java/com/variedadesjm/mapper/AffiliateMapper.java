package com.variedadesjm.mapper;

import com.variedadesjm.model.dto.affiliate.AffiliateRequest;
import com.variedadesjm.model.dto.affiliate.AffiliateResponse;
import com.variedadesjm.model.entity.Affiliate;
import com.variedadesjm.model.enums.AffiliateLevel;
import com.variedadesjm.util.InputSanitizer;

public class AffiliateMapper {

    private AffiliateMapper() {}

    public static Affiliate toEntity(AffiliateRequest request) {
        return Affiliate.builder()
                .name(InputSanitizer.clean(request.getName()))
                .idDocument(InputSanitizer.clean(request.getIdDocument()))
                .phone(InputSanitizer.clean(request.getPhone()))
                .email(InputSanitizer.clean(request.getEmail()))
                .level(request.getLevel() != null ? request.getLevel() : AffiliateLevel.BRONCE)
                .points(request.getPoints() != null ? request.getPoints() : 0)
                .build();
    }

    public static AffiliateResponse toResponse(Affiliate affiliate) {
        return AffiliateResponse.builder()
                .id(affiliate.getId())
                .name(affiliate.getName())
                .idDocument(affiliate.getIdDocument())
                .phone(affiliate.getPhone())
                .email(affiliate.getEmail())
                .level(affiliate.getLevel())
                .points(affiliate.getPoints())
                .rewards(affiliate.getPoints() / 1000)
                .createdAt(affiliate.getCreatedAt())
                .updatedAt(affiliate.getUpdatedAt())
                .build();
    }

    public static void updateEntity(Affiliate affiliate, AffiliateRequest request) {
        affiliate.setName(InputSanitizer.clean(request.getName()));
        affiliate.setIdDocument(InputSanitizer.clean(request.getIdDocument()));
        affiliate.setPhone(InputSanitizer.clean(request.getPhone()));
        affiliate.setEmail(InputSanitizer.clean(request.getEmail()));
        if (request.getLevel() != null) {
            affiliate.setLevel(request.getLevel());
        }
        if (request.getPoints() != null) {
            affiliate.setPoints(request.getPoints());
        }
    }
}

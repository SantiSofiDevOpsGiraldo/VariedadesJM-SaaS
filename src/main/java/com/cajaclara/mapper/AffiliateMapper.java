package com.cajaclara.mapper;

import com.cajaclara.model.dto.affiliate.AffiliateRequest;
import com.cajaclara.model.dto.affiliate.AffiliateResponse;
import com.cajaclara.model.entity.Affiliate;
import com.cajaclara.model.enums.AffiliateLevel;

public class AffiliateMapper {

    private AffiliateMapper() {}

    public static Affiliate toEntity(AffiliateRequest request) {
        return Affiliate.builder()
                .name(request.getName())
                .idDocument(request.getIdDocument())
                .phone(request.getPhone())
                .email(request.getEmail())
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
        affiliate.setName(request.getName());
        affiliate.setIdDocument(request.getIdDocument());
        affiliate.setPhone(request.getPhone());
        affiliate.setEmail(request.getEmail());
        if (request.getLevel() != null) {
            affiliate.setLevel(request.getLevel());
        }
        if (request.getPoints() != null) {
            affiliate.setPoints(request.getPoints());
        }
    }
}

package com.variedadesjm.model.dto.affiliate;

import com.variedadesjm.model.enums.AffiliateLevel;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AffiliateResponse {

    private Long id;
    private String name;
    private String idDocument;
    private String phone;
    private String email;
    private AffiliateLevel level;
    private Integer points;
    private Integer rewards;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

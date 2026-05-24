package com.variedadesjm.model.dto.affiliate;

import com.variedadesjm.model.enums.AffiliateLevel;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AffiliateRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100)
    private String name;

    @NotBlank(message = "El documento de identidad es obligatorio")
    @Size(max = 30)
    private String idDocument;

    @Size(max = 20)
    private String phone;

    @Size(max = 100)
    private String email;

    private AffiliateLevel level;

    private Integer points;
}

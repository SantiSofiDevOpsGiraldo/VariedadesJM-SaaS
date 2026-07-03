package com.variedadesjm.model.dto.product;

import com.variedadesjm.model.enums.ProductCategory;
import com.variedadesjm.model.enums.ProductStatus;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {

    @NotBlank(message = "El código es obligatorio")
    @Size(max = 50)
    private String code;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150)
    private String name;

    @NotNull(message = "La categoría es obligatoria")
    private ProductCategory category;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    private BigDecimal price;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    @Size(max = 500)
    private String img;

    @Size(max = 500)
    @Pattern(regexp = "^$|^(https?://).+", message = "La URL de imagen debe ser válida")
    private String imageUrl;

    private ProductStatus status;
}

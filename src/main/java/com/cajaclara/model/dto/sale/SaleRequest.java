package com.cajaclara.model.dto.sale;

import com.cajaclara.model.enums.PaymentMethod;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleRequest {

    @NotNull(message = "El método de pago es obligatorio")
    private PaymentMethod method;

    @NotNull(message = "Los items son obligatorios")
    @Size(min = 1, message = "Debe haber al menos un item en la venta")
    private List<SaleItemRequest> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SaleItemRequest {
        @NotNull(message = "El ID del producto es obligatorio")
        private Long productId;

        @NotNull(message = "La cantidad es obligatoria")
        @Min(value = 1, message = "La cantidad mínima es 1")
        private Integer quantity;
    }
}

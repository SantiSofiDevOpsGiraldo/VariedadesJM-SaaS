package com.variedadesjm.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.util.Arrays;
import java.util.Locale;

public enum ProductStatus {
    SALUDABLE,
    STOCK_BAJO,
    AGOTADO;

    @JsonCreator
    public static ProductStatus fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalized = normalize(value);

        if ("ACTIVE".equals(normalized)) {
            return SALUDABLE;
        }
        if ("INACTIVE".equals(normalized)) {
            return AGOTADO;
        }

        return Arrays.stream(values())
                .filter(status -> normalize(status.name()).equals(normalized))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Estado de producto inválido: " + value));
    }

    @JsonValue
    public String toValue() {
        return switch (this) {
            case SALUDABLE -> "ACTIVE";
            case STOCK_BAJO, AGOTADO -> "INACTIVE";
        };
    }

    private static String normalize(String value) {
        return value.trim().replace(' ', '_').toUpperCase(Locale.ROOT);
    }
}

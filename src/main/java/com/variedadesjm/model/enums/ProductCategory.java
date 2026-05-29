package com.variedadesjm.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.text.Normalizer;
import java.util.Arrays;
import java.util.Locale;

public enum ProductCategory {
    PAPELERIA,
    REGALOS,
    FOTOCOPIAS,
    DULCES,
    OTRO;

    @JsonCreator
    public static ProductCategory fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalized = normalize(value);

        return Arrays.stream(values())
                .filter(category -> normalize(category.name()).equals(normalized))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Categoría de producto inválida: " + value));
    }

    @JsonValue
    public String toValue() {
        return name();
    }

    private static String normalize(String value) {
        String withoutAccents = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return withoutAccents.trim().replace(' ', '_').toUpperCase(Locale.ROOT);
    }
}

package com.variedadesjm.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import java.text.Normalizer;
import java.util.Arrays;
import java.util.Locale;

public enum ServiceType {
    ANCHETA,
    IMPRESION,
    PERSONALIZACION,
    OTRO;

    @JsonCreator
    public static ServiceType fromValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalized = normalize(value);

        if ("FOTOCOPIA".equals(normalized) || "FOTOCOPIAS".equals(normalized)) {
            return IMPRESION;
        }
        if ("EMPASTADO".equals(normalized) || "PERSONALIZACION".equals(normalized)) {
            return PERSONALIZACION;
        }

        return Arrays.stream(values())
                .filter(type -> normalize(type.name()).equals(normalized))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Tipo de servicio inválido: " + value));
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

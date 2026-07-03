package com.variedadesjm.util;

import org.apache.commons.text.StringEscapeUtils;

public final class InputSanitizer {

    private InputSanitizer() {
    }

    public static String clean(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        if (trimmed.isEmpty()) {
            return null;
        }

        return StringEscapeUtils.escapeHtml4(trimmed);
    }
}
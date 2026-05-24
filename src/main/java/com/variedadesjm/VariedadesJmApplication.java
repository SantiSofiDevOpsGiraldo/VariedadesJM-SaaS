package com.variedadesjm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class VariedadesJmApplication {

    public static void main(String[] args) {
        SpringApplication.run(VariedadesJmApplication.class, args);
    }
}

package com.cajaclara;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CajaClaraApplication {

    public static void main(String[] args) {
        SpringApplication.run(CajaClaraApplication.class, args);
    }
}

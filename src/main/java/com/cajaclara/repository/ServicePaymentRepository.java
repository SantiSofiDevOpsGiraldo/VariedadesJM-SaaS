package com.cajaclara.repository;

import com.cajaclara.model.entity.ServicePayment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicePaymentRepository extends JpaRepository<ServicePayment, Long> {
}

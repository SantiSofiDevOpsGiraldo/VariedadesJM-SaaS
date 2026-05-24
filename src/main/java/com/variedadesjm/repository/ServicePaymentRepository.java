package com.variedadesjm.repository;

import com.variedadesjm.model.entity.ServicePayment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServicePaymentRepository extends JpaRepository<ServicePayment, Long> {
}

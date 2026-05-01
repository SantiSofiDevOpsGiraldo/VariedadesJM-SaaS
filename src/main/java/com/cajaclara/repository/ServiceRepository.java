package com.cajaclara.repository;

import com.cajaclara.model.entity.Service;
import com.cajaclara.model.enums.ServiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {

    List<Service> findByStatus(ServiceStatus status);

    List<Service> findByClientNameContaining(String clientName);

    List<Service> findByPhone(String phone);
}

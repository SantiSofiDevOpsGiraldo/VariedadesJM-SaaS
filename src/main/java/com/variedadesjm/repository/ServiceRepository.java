package com.variedadesjm.repository;

import com.variedadesjm.model.entity.Service;
import com.variedadesjm.model.enums.ServiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {

    Optional<Service> findByIdAndCompany_Id(Long id, Long companyId);

    List<Service> findByStatus(ServiceStatus status);

    List<Service> findByStatusAndCompany_Id(ServiceStatus status, Long companyId);

    List<Service> findByCompany_Id(Long companyId);

    List<Service> findByClientNameContaining(String clientName);

    List<Service> findByClientNameContainingAndCompany_Id(String clientName, Long companyId);

    List<Service> findByPhone(String phone);

    List<Service> findByPhoneAndCompany_Id(String phone, Long companyId);
}

package com.variedadesjm.service;

import com.variedadesjm.exception.BusinessException;
import com.variedadesjm.exception.ResourceNotFoundException;
import com.variedadesjm.mapper.ServiceMapper;
import com.variedadesjm.model.dto.service.PaymentRequest;
import com.variedadesjm.model.dto.service.ServiceRequest;
import com.variedadesjm.model.dto.service.ServiceResponse;
import com.variedadesjm.model.entity.Company;
import com.variedadesjm.model.entity.CashSession;
import com.variedadesjm.model.entity.CashTransaction;
import com.variedadesjm.model.entity.Service;
import com.variedadesjm.model.entity.ServicePayment;
import com.variedadesjm.model.enums.CashSessionStatus;
import com.variedadesjm.model.enums.ServiceStatus;
import com.variedadesjm.model.enums.TransactionType;
import com.variedadesjm.repository.CashSessionRepository;
import com.variedadesjm.repository.CashTransactionRepository;
import com.variedadesjm.repository.ServicePaymentRepository;
import com.variedadesjm.repository.ServiceRepository;
import com.variedadesjm.security.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class ServiceOrderService {

    private final ServiceRepository serviceRepository;
    private final ServicePaymentRepository servicePaymentRepository;
    private final CashSessionRepository cashSessionRepository;
    private final CashTransactionRepository cashTransactionRepository;

    @Transactional
    public ServiceResponse create(ServiceRequest request) {
        Service service = ServiceMapper.toEntity(request);
        service.setCompany(Company.builder().id(requireCompanyId()).build());
        service = serviceRepository.save(service);
        return ServiceMapper.toResponse(service);
    }

    @Transactional(readOnly = true)
    public List<ServiceResponse> getAll() {
        return serviceRepository.findByCompany_Id(requireCompanyId()).stream()
                .map(ServiceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ServiceResponse getById(Long id) {
        Service service = serviceRepository.findByIdAndCompany_Id(id, requireCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Servicio", "id", id));
        return ServiceMapper.toResponse(service);
    }

    @Transactional
    public ServiceResponse updateStatus(Long id, ServiceStatus newStatus) {
        Service service = serviceRepository.findByIdAndCompany_Id(id, requireCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Servicio", "id", id));
        service.setStatus(newStatus);
        service = serviceRepository.save(service);
        return ServiceMapper.toResponse(service);
    }

    @Transactional
    public ServiceResponse addPayment(Long id, PaymentRequest request) {
        Service service = serviceRepository.findByIdAndCompany_Id(id, requireCompanyId())
            .orElseThrow(() -> new ResourceNotFoundException("Servicio", "id", id));

        // Rule 4: Service payments only with open cash session
        CashSession activeSession = cashSessionRepository.findByStatus(CashSessionStatus.ABIERTA)
                .orElseThrow(() -> new BusinessException("No hay una sesión de caja abierta. No se pueden registrar abonos."));

        // Create service payment
        ServicePayment payment = ServicePayment.builder()
                .service(service)
                .amount(request.getAmount())
                .method(request.getMethod())
                .description(request.getDescription())
                .build();
        servicePaymentRepository.save(payment);

        // Update advance
        BigDecimal newAdvance = service.getAdvance().add(request.getAmount());
        service.setAdvance(newAdvance);

        // Rule 5: Auto-delivery when advance reaches budget
        if (newAdvance.compareTo(service.getBudget()) >= 0) {
            service.setStatus(ServiceStatus.ENTREGADO);
        }

        service = serviceRepository.save(service);

        // Create cash transaction
        CashTransaction cashTransaction = CashTransaction.builder()
                .session(activeSession)
                .type(TransactionType.INGRESO)
                .amount(request.getAmount())
                .description("Abono a servicio #" + service.getId() + " - " + service.getTitle())
                .method(request.getMethod())
                .referenceId("SERVICE-" + service.getId())
                .build();
        cashTransactionRepository.save(cashTransaction);

        // Update expected total for session
        updateSessionExpectedTotal(activeSession);

        return ServiceMapper.toResponse(service);
    }

    private Long requireCompanyId() {
        Long companyId = TenantContext.getCompanyId();
        if (companyId == null) {
            throw new BusinessException("El usuario debe completar el onboarding empresarial antes de usar esta funcionalidad.");
        }
        return companyId;
    }

    private void updateSessionExpectedTotal(CashSession session) {
        BigDecimal ingresos = cashTransactionRepository.sumAmountBySessionIdAndType(session.getId(), TransactionType.INGRESO);
        BigDecimal egresos = cashTransactionRepository.sumAmountBySessionIdAndType(session.getId(), TransactionType.EGRESO);
        session.setExpectedTotal(session.getInitialBase().add(ingresos).subtract(egresos));
        cashSessionRepository.save(session);
    }
}

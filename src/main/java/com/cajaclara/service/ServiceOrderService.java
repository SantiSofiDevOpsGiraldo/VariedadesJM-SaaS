package com.cajaclara.service;

import com.cajaclara.exception.BusinessException;
import com.cajaclara.exception.ResourceNotFoundException;
import com.cajaclara.mapper.ServiceMapper;
import com.cajaclara.model.dto.service.PaymentRequest;
import com.cajaclara.model.dto.service.ServiceRequest;
import com.cajaclara.model.dto.service.ServiceResponse;
import com.cajaclara.model.entity.CashSession;
import com.cajaclara.model.entity.CashTransaction;
import com.cajaclara.model.entity.Service;
import com.cajaclara.model.entity.ServicePayment;
import com.cajaclara.model.enums.CashSessionStatus;
import com.cajaclara.model.enums.ServiceStatus;
import com.cajaclara.model.enums.TransactionType;
import com.cajaclara.repository.CashSessionRepository;
import com.cajaclara.repository.CashTransactionRepository;
import com.cajaclara.repository.ServicePaymentRepository;
import com.cajaclara.repository.ServiceRepository;
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
        service = serviceRepository.save(service);
        return ServiceMapper.toResponse(service);
    }

    @Transactional(readOnly = true)
    public List<ServiceResponse> getAll() {
        return serviceRepository.findAll().stream()
                .map(ServiceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ServiceResponse getById(Long id) {
        Service service = findOrThrow(id);
        return ServiceMapper.toResponse(service);
    }

    @Transactional
    public ServiceResponse updateStatus(Long id, ServiceStatus newStatus) {
        Service service = findOrThrow(id);
        service.setStatus(newStatus);
        service = serviceRepository.save(service);
        return ServiceMapper.toResponse(service);
    }

    @Transactional
    public ServiceResponse addPayment(Long id, PaymentRequest request) {
        Service service = findOrThrow(id);

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

    private Service findOrThrow(Long id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Servicio", "id", id));
    }

    private void updateSessionExpectedTotal(CashSession session) {
        BigDecimal ingresos = cashTransactionRepository.sumAmountBySessionIdAndType(session.getId(), TransactionType.INGRESO);
        BigDecimal egresos = cashTransactionRepository.sumAmountBySessionIdAndType(session.getId(), TransactionType.EGRESO);
        session.setExpectedTotal(session.getInitialBase().add(ingresos).subtract(egresos));
        cashSessionRepository.save(session);
    }
}

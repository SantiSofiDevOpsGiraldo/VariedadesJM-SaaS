package com.variedadesjm.service;

import com.variedadesjm.exception.BusinessException;
import com.variedadesjm.exception.ResourceNotFoundException;
import com.variedadesjm.mapper.CashSessionMapper;
import com.variedadesjm.mapper.CashTransactionMapper;
import com.variedadesjm.model.dto.cash.*;
import com.variedadesjm.model.entity.Company;
import com.variedadesjm.model.entity.CashSession;
import com.variedadesjm.model.entity.CashTransaction;
import com.variedadesjm.model.enums.CashSessionStatus;
import com.variedadesjm.model.enums.PaymentMethod;
import com.variedadesjm.model.enums.TransactionType;
import com.variedadesjm.repository.CashSessionRepository;
import com.variedadesjm.repository.CashTransactionRepository;
import com.variedadesjm.security.TenantContext;
import com.variedadesjm.util.InputSanitizer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CashSessionService {

    private final CashSessionRepository cashSessionRepository;
    private final CashTransactionRepository cashTransactionRepository;

    @Transactional(readOnly = true)
    public CashSessionResponse getActiveSession() {
                CashSession session = cashSessionRepository.findByStatusAndCompany_Id(CashSessionStatus.ABIERTA, requireCompanyId())
                                .orElse(null);

                if (session == null) {
                        return null;
                }

        return buildSessionResponseWithTotals(session);
    }

    @Transactional
    public CashSessionResponse openSession(OpenSessionRequest request, String openedBy) {
        // Rule 7: Only one open session at a time
        Long companyId = requireCompanyId();
        if (cashSessionRepository.existsByStatusAndCompany_Id(CashSessionStatus.ABIERTA, companyId)) {
            throw new BusinessException("Ya existe una sesión de caja abierta. Debe cerrarla antes de abrir una nueva.");
        }

        CashSession session = CashSession.builder()
                .openedAt(LocalDateTime.now())
                .company(Company.builder().id(companyId).build())
                .openedBy(InputSanitizer.clean(openedBy))
                .initialBase(request.getInitialBase())
                .status(CashSessionStatus.ABIERTA)
                .expectedTotal(request.getInitialBase())
                .build();

        session = cashSessionRepository.save(session);

        // Create opening transaction
        CashTransaction openingTransaction = CashTransaction.builder()
                .session(session)
                .type(TransactionType.APERTURA)
                .amount(request.getInitialBase())
                .description("Apertura de caja")
                .method(PaymentMethod.EFECTIVO)
                .build();
        cashTransactionRepository.save(openingTransaction);

        return CashSessionMapper.toResponse(session);
    }

    @Transactional
    public CashSessionResponse closeSession(CloseSessionRequest request, String closedBy) {
                CashSession session = cashSessionRepository.findByStatusAndCompany_Id(CashSessionStatus.ABIERTA, requireCompanyId())
                .orElseThrow(() -> new BusinessException("No hay una sesión de caja abierta para cerrar."));

        session.setClosedAt(LocalDateTime.now());
        session.setClosedBy(InputSanitizer.clean(closedBy));
        session.setActualTotal(request.getActualTotal());
        session.setStatus(CashSessionStatus.CERRADA);

        // Rule 6: Calculate expected total
        BigDecimal ingresos = cashTransactionRepository.sumAmountBySessionIdAndType(session.getId(), TransactionType.INGRESO);
        BigDecimal egresos = cashTransactionRepository.sumAmountBySessionIdAndType(session.getId(), TransactionType.EGRESO);
        session.setExpectedTotal(session.getInitialBase().add(ingresos).subtract(egresos));

        session = cashSessionRepository.save(session);

        // Create closing transaction
        CashTransaction closingTransaction = CashTransaction.builder()
                .session(session)
                .type(TransactionType.CIERRE)
                .amount(request.getActualTotal())
                .description("Cierre de caja")
                .method(PaymentMethod.EFECTIVO)
                .build();
        cashTransactionRepository.save(closingTransaction);

        return buildSessionResponseWithTotals(session);
    }

    @Transactional(readOnly = true)
    public List<CashTransactionResponse> getSessionTransactions(Long sessionId) {
        CashSession session = cashSessionRepository.findByIdAndCompany_Id(sessionId, requireCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Sesión de caja", "id", sessionId));
        return cashTransactionRepository.findBySessionIdOrderByCreatedAtDesc(sessionId).stream()
                .map(CashTransactionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CashTransactionResponse addTransaction(TransactionRequest request) {
                CashSession activeSession = cashSessionRepository.findByStatusAndCompany_Id(CashSessionStatus.ABIERTA, requireCompanyId())
                .orElseThrow(() -> new BusinessException("No hay una sesión de caja abierta."));

        CashTransaction transaction = CashTransaction.builder()
                .session(activeSession)
                .type(request.getType())
                .amount(request.getAmount())
                .description(InputSanitizer.clean(request.getDescription()))
                .method(request.getMethod())
                .referenceId(InputSanitizer.clean(request.getReferenceId()))
                .build();

        transaction = cashTransactionRepository.save(transaction);

        // Update expected total
        BigDecimal ingresos = cashTransactionRepository.sumAmountBySessionIdAndType(activeSession.getId(), TransactionType.INGRESO);
        BigDecimal egresos = cashTransactionRepository.sumAmountBySessionIdAndType(activeSession.getId(), TransactionType.EGRESO);
        activeSession.setExpectedTotal(activeSession.getInitialBase().add(ingresos).subtract(egresos));
        cashSessionRepository.save(activeSession);

        return CashTransactionMapper.toResponse(transaction);
    }

    private CashSessionResponse buildSessionResponseWithTotals(CashSession session) {
        BigDecimal ingresos = cashTransactionRepository.sumAmountBySessionIdAndType(session.getId(), TransactionType.INGRESO);
        BigDecimal egresos = cashTransactionRepository.sumAmountBySessionIdAndType(session.getId(), TransactionType.EGRESO);
        return CashSessionMapper.toResponseWithTotals(session, ingresos, egresos);
    }

        private Long requireCompanyId() {
                Long companyId = TenantContext.getCompanyId();
                if (companyId == null) {
                        throw new BusinessException("El usuario debe completar el onboarding empresarial antes de usar esta funcionalidad.");
                }
                return companyId;
        }
}

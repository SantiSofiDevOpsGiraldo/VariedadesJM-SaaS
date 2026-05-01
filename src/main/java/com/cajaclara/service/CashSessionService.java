package com.cajaclara.service;

import com.cajaclara.exception.BusinessException;
import com.cajaclara.exception.ResourceNotFoundException;
import com.cajaclara.mapper.CashSessionMapper;
import com.cajaclara.mapper.CashTransactionMapper;
import com.cajaclara.model.dto.cash.*;
import com.cajaclara.model.entity.CashSession;
import com.cajaclara.model.entity.CashTransaction;
import com.cajaclara.model.enums.CashSessionStatus;
import com.cajaclara.model.enums.PaymentMethod;
import com.cajaclara.model.enums.TransactionType;
import com.cajaclara.repository.CashSessionRepository;
import com.cajaclara.repository.CashTransactionRepository;
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
        CashSession session = cashSessionRepository.findByStatus(CashSessionStatus.ABIERTA)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión de caja", "status", "ABIERTA"));
        return buildSessionResponseWithTotals(session);
    }

    @Transactional
    public CashSessionResponse openSession(OpenSessionRequest request, String openedBy) {
        // Rule 7: Only one open session at a time
        if (cashSessionRepository.existsByStatus(CashSessionStatus.ABIERTA)) {
            throw new BusinessException("Ya existe una sesión de caja abierta. Debe cerrarla antes de abrir una nueva.");
        }

        CashSession session = CashSession.builder()
                .openedAt(LocalDateTime.now())
                .openedBy(openedBy)
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
        CashSession session = cashSessionRepository.findByStatus(CashSessionStatus.ABIERTA)
                .orElseThrow(() -> new BusinessException("No hay una sesión de caja abierta para cerrar."));

        session.setClosedAt(LocalDateTime.now());
        session.setClosedBy(closedBy);
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
        CashSession session = cashSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Sesión de caja", "id", sessionId));
        return cashTransactionRepository.findBySessionIdOrderByCreatedAtDesc(sessionId).stream()
                .map(CashTransactionMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CashTransactionResponse addTransaction(TransactionRequest request) {
        CashSession activeSession = cashSessionRepository.findByStatus(CashSessionStatus.ABIERTA)
                .orElseThrow(() -> new BusinessException("No hay una sesión de caja abierta."));

        CashTransaction transaction = CashTransaction.builder()
                .session(activeSession)
                .type(request.getType())
                .amount(request.getAmount())
                .description(request.getDescription())
                .method(request.getMethod())
                .referenceId(request.getReferenceId())
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
}

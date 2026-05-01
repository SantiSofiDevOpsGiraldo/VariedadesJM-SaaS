package com.cajaclara.controller;

import com.cajaclara.model.dto.cash.*;
import com.cajaclara.service.CashSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cash-sessions")
@RequiredArgsConstructor
public class CashSessionController {

    private final CashSessionService cashSessionService;

    @GetMapping("/active")
    public ResponseEntity<CashSessionResponse> getActiveSession() {
        return ResponseEntity.ok(cashSessionService.getActiveSession());
    }

    @PostMapping("/open")
    public ResponseEntity<CashSessionResponse> openSession(@Valid @RequestBody OpenSessionRequest request,
                                                            Authentication authentication) {
        CashSessionResponse response = cashSessionService.openSession(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/close")
    public ResponseEntity<CashSessionResponse> closeSession(@Valid @RequestBody CloseSessionRequest request,
                                                             Authentication authentication) {
        return ResponseEntity.ok(cashSessionService.closeSession(request, authentication.getName()));
    }

    @GetMapping("/{id}/transactions")
    public ResponseEntity<List<CashTransactionResponse>> getSessionTransactions(@PathVariable Long id) {
        return ResponseEntity.ok(cashSessionService.getSessionTransactions(id));
    }

    @PostMapping("/transactions")
    public ResponseEntity<CashTransactionResponse> addTransaction(@Valid @RequestBody TransactionRequest request) {
        CashTransactionResponse response = cashSessionService.addTransaction(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

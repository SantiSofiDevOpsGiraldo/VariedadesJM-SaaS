package com.cajaclara.controller;

import com.cajaclara.model.dto.service.PaymentRequest;
import com.cajaclara.model.dto.service.ServiceRequest;
import com.cajaclara.model.dto.service.ServiceResponse;
import com.cajaclara.model.enums.ServiceStatus;
import com.cajaclara.service.ServiceOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceOrderService serviceOrderService;

    @PostMapping
    public ResponseEntity<ServiceResponse> create(@Valid @RequestBody ServiceRequest request) {
        ServiceResponse response = serviceOrderService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ServiceResponse>> getAll() {
        return ResponseEntity.ok(serviceOrderService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceOrderService.getById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ServiceResponse> updateStatus(@PathVariable Long id,
                                                         @RequestParam ServiceStatus status) {
        return ResponseEntity.ok(serviceOrderService.updateStatus(id, status));
    }

    @PostMapping("/{id}/payments")
    public ResponseEntity<ServiceResponse> addPayment(@PathVariable Long id,
                                                       @Valid @RequestBody PaymentRequest request) {
        return ResponseEntity.ok(serviceOrderService.addPayment(id, request));
    }
}

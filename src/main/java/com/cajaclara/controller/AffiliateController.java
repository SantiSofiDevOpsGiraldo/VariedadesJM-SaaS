package com.cajaclara.controller;

import com.cajaclara.model.dto.affiliate.AffiliateRequest;
import com.cajaclara.model.dto.affiliate.AffiliateResponse;
import com.cajaclara.service.AffiliateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/affiliates")
@RequiredArgsConstructor
public class AffiliateController {

    private final AffiliateService affiliateService;

    @GetMapping
    public ResponseEntity<List<AffiliateResponse>> getAll() {
        return ResponseEntity.ok(affiliateService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AffiliateResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(affiliateService.getById(id));
    }

    @PostMapping
    public ResponseEntity<AffiliateResponse> create(@Valid @RequestBody AffiliateRequest request) {
        AffiliateResponse response = affiliateService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AffiliateResponse> update(@PathVariable Long id,
                                                     @Valid @RequestBody AffiliateRequest request) {
        return ResponseEntity.ok(affiliateService.update(id, request));
    }
}

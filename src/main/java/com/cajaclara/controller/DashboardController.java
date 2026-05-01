package com.cajaclara.controller;

import com.cajaclara.model.dto.dashboard.DashboardResponse;
import com.cajaclara.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/kpis")
    public ResponseEntity<DashboardResponse.Kpis> getKpis() {
        return ResponseEntity.ok(dashboardService.getKpis());
    }

    @GetMapping("/weekly-performance")
    public ResponseEntity<List<DashboardResponse.WeeklyPerformance>> getWeeklyPerformance() {
        return ResponseEntity.ok(dashboardService.getWeeklyPerformance());
    }

    @GetMapping("/top-products")
    public ResponseEntity<List<DashboardResponse.TopProduct>> getTopProducts() {
        return ResponseEntity.ok(dashboardService.getTopProducts());
    }

    @GetMapping("/critical-stock")
    public ResponseEntity<List<DashboardResponse.CriticalStock>> getCriticalStock() {
        return ResponseEntity.ok(dashboardService.getCriticalStock());
    }
}

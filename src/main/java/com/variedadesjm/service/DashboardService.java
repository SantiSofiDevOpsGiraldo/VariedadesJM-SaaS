package com.variedadesjm.service;

import com.variedadesjm.model.dto.dashboard.DashboardResponse;
import com.variedadesjm.exception.BusinessException;
import com.variedadesjm.model.entity.CashSession;
import com.variedadesjm.model.entity.Product;
import com.variedadesjm.model.enums.CashSessionStatus;
import com.variedadesjm.model.enums.ProductStatus;
import com.variedadesjm.repository.*;
import com.variedadesjm.security.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;
    private final ProductRepository productRepository;
    private final CashSessionRepository cashSessionRepository;
    private final CashTransactionRepository cashTransactionRepository;

    @Transactional(readOnly = true)
    public DashboardResponse.Kpis getKpis() {
        Long companyId = requireCompanyId();
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);

        BigDecimal todaySales = saleRepository.sumTotalByDateAndCompany_Id(LocalDateTime.now(), companyId);
        Long todayTransactions = saleRepository.countByDateAndCompany_Id(LocalDateTime.now(), companyId);

        String cashSessionStatus = cashSessionRepository.findByStatusAndCompany_Id(CashSessionStatus.ABIERTA, companyId)
                .map(session -> "ABIERTA")
                .orElse("CERRADA");

        // Estimated net profit: 30% of sales as estimated margin
        BigDecimal estimatedNetProfit = todaySales.multiply(BigDecimal.valueOf(0.30))
                .setScale(2, RoundingMode.HALF_EVEN);

        return DashboardResponse.Kpis.builder()
                .todaySales(todaySales)
                .todayTransactions(todayTransactions)
                .cashSessionStatus(cashSessionStatus)
                .estimatedNetProfit(estimatedNetProfit)
                .build();
    }

    @Transactional(readOnly = true)
    public List<DashboardResponse.WeeklyPerformance> getWeeklyPerformance() {
        Long companyId = requireCompanyId();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfWeek = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .with(LocalTime.MIN);
        LocalDateTime endOfWeek = now.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY))
                .with(LocalTime.MAX);

        List<DashboardResponse.WeeklyPerformance> result = new ArrayList<>();
        String[] dayNames = {"LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"};

        for (int i = 0; i < 7; i++) {
            LocalDateTime dayStart = startOfWeek.plusDays(i);
            LocalDateTime dayEnd = dayStart.with(LocalTime.MAX);

            BigDecimal dayTotal = saleRepository.sumTotalByCreatedAtBetweenAndCompany_Id(dayStart, dayEnd, companyId);
            Long dayCount = saleRepository.countByCreatedAtBetweenAndCompany_Id(dayStart, dayEnd, companyId);

            result.add(DashboardResponse.WeeklyPerformance.builder()
                    .day(dayNames[i])
                    .total(dayTotal)
                    .transactions(dayCount)
                    .build());
        }

        return result;
    }

    @Transactional(readOnly = true)
    public List<DashboardResponse.TopProduct> getTopProducts() {
        Long companyId = requireCompanyId();
        LocalDateTime from = LocalDateTime.now().minusDays(7);
        LocalDateTime to = LocalDateTime.now();

        List<Object[]> results = saleItemRepository.findTopProductsByDateRangeAndCompany_Id(from, to, companyId);

        return results.stream()
                .limit(5)
                .map(row -> DashboardResponse.TopProduct.builder()
                        .productId((Long) row[0])
                        .productName((String) row[1])
                        .totalQuantity(((Number) row[2]).intValue())
                        .totalRevenue((BigDecimal) row[3])
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DashboardResponse.CriticalStock> getCriticalStock() {
        Long companyId = requireCompanyId();
        List<Product> criticalProducts = productRepository.findByStockLessThanAndCompany_Id(10, companyId);
        List<Product> lowStockProducts = productRepository.findByStatusAndCompany_Id(ProductStatus.STOCK_BAJO, companyId);

        // Combine and deduplicate
        Set<Long> seen = new HashSet<>();
        List<DashboardResponse.CriticalStock> result = new ArrayList<>();

        for (Product p : criticalProducts) {
            if (seen.add(p.getId())) {
                result.add(DashboardResponse.CriticalStock.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .stock(p.getStock())
                        .status(p.getStatus().name())
                        .build());
            }
        }
        for (Product p : lowStockProducts) {
            if (seen.add(p.getId())) {
                result.add(DashboardResponse.CriticalStock.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .stock(p.getStock())
                        .status(p.getStatus().name())
                        .build());
            }
        }

        return result;
    }

    private Long requireCompanyId() {
        Long companyId = TenantContext.getCompanyId();
        if (companyId == null) {
            throw new BusinessException("El usuario debe completar el onboarding empresarial antes de usar esta funcionalidad.");
        }
        return companyId;
    }
}

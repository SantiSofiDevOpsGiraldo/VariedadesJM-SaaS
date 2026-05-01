package com.cajaclara.model.dto.dashboard;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private Kpis kpis;
    private List<WeeklyPerformance> weeklyPerformance;
    private List<TopProduct> topProducts;
    private List<CriticalStock> criticalStock;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Kpis {
        private BigDecimal todaySales;
        private Long todayTransactions;
        private String cashSessionStatus;
        private BigDecimal estimatedNetProfit;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WeeklyPerformance {
        private String day;
        private BigDecimal total;
        private Long transactions;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TopProduct {
        private Long productId;
        private String productName;
        private Integer totalQuantity;
        private BigDecimal totalRevenue;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CriticalStock {
        private Long id;
        private String name;
        private Integer stock;
        private String status;
    }
}

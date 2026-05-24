package com.variedadesjm.model.entity;

import com.variedadesjm.model.enums.CashSessionStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cash_sessions")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CashSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "opened_at", nullable = false)
    private LocalDateTime openedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @Column(name = "opened_by", nullable = false, length = 100)
    private String openedBy;

    @Column(name = "closed_by", length = 100)
    private String closedBy;

    @Column(name = "initial_base", nullable = false, precision = 15, scale = 2)
    private BigDecimal initialBase;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CashSessionStatus status;

    @Column(name = "expected_total", precision = 15, scale = 2)
    private BigDecimal expectedTotal;

    @Column(name = "actual_total", precision = 15, scale = 2)
    private BigDecimal actualTotal;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

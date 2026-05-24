package com.variedadesjm.service;

import com.variedadesjm.exception.BusinessException;
import com.variedadesjm.exception.ResourceNotFoundException;
import com.variedadesjm.mapper.SaleMapper;
import com.variedadesjm.model.dto.sale.SaleRequest;
import com.variedadesjm.model.dto.sale.SaleResponse;
import com.variedadesjm.model.entity.Company;
import com.variedadesjm.model.entity.*;
import com.variedadesjm.model.enums.CashSessionStatus;
import com.variedadesjm.model.enums.PaymentMethod;
import com.variedadesjm.model.enums.ProductStatus;
import com.variedadesjm.model.enums.TransactionType;
import com.variedadesjm.repository.CashSessionRepository;
import com.variedadesjm.repository.CashTransactionRepository;
import com.variedadesjm.repository.ProductRepository;
import com.variedadesjm.repository.SaleRepository;
import com.variedadesjm.security.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final CashSessionRepository cashSessionRepository;
    private final CashTransactionRepository cashTransactionRepository;

    @Transactional
    public SaleResponse create(SaleRequest request, Long cashierId) {
        // Rule 1: Sales only with open cash session
        Long companyId = requireCompanyId();
        CashSession activeSession = cashSessionRepository.findByStatusAndCompany_Id(CashSessionStatus.ABIERTA, companyId)
                .orElseThrow(() -> new BusinessException("No hay una sesión de caja abierta. No se pueden registrar ventas."));

        // Build sale items and calculate totals
        BigDecimal subtotal = BigDecimal.ZERO;
        var saleItems = new ArrayList<SaleItem>();

        Sale sale = Sale.builder()
                .company(Company.builder().id(companyId).build())
                .cashierId(cashierId)
                .method(request.getMethod())
                .tax(BigDecimal.ZERO)
                .build();

        for (SaleRequest.SaleItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findByIdAndCompany_Id(itemRequest.getProductId(), companyId)
                    .orElseThrow(() -> new ResourceNotFoundException("Producto", "id", itemRequest.getProductId()));

            if (product.getStatus() == ProductStatus.AGOTADO || product.getStock() < itemRequest.getQuantity()) {
                throw new BusinessException("Producto '" + product.getName() + "' no tiene stock suficiente. Stock actual: " + product.getStock());
            }

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            SaleItem saleItem = SaleItem.builder()
                    .sale(sale)
                    .productId(product.getId())
                    .productName(product.getName())
                    .price(product.getPrice())
                    .quantity(itemRequest.getQuantity())
                    .build();

            saleItems.add(saleItem);

            // Rule 3: Decrease stock
            product.setStock(product.getStock() - itemRequest.getQuantity());
            updateProductStatus(product);
            productRepository.save(product);
        }

        sale.setSubtotal(subtotal);
        sale.setTotal(subtotal.add(sale.getTax()));
        sale.setItems(saleItems);

        sale = saleRepository.save(sale);

        // Rule 2: Create cash transaction for sale
        CashTransaction cashTransaction = CashTransaction.builder()
                .session(activeSession)
                .type(TransactionType.INGRESO)
                .amount(sale.getTotal())
                .description("Venta #" + sale.getId())
                .method(mapPaymentMethod(request.getMethod()))
                .referenceId("SALE-" + sale.getId())
                .build();
        cashTransactionRepository.save(cashTransaction);

        // Update expected total for session
        updateSessionExpectedTotal(activeSession);

        return SaleMapper.toResponse(sale);
    }

    @Transactional(readOnly = true)
    public List<SaleResponse> getAll() {
        return saleRepository.findByCompany_Id(requireCompanyId()).stream()
                .map(SaleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SaleResponse getById(Long id) {
        Sale sale = saleRepository.findByIdAndCompany_Id(id, requireCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Venta", "id", id));
        return SaleMapper.toResponse(sale);
    }

    @Transactional(readOnly = true)
    public List<SaleResponse> getByDateRange(LocalDateTime from, LocalDateTime to) {
        return saleRepository.findByCreatedAtBetweenAndCompany_Id(from, to, requireCompanyId()).stream()
                .map(SaleMapper::toResponse)
                .collect(Collectors.toList());
    }

    private Long requireCompanyId() {
        Long companyId = TenantContext.getCompanyId();
        if (companyId == null) {
            throw new BusinessException("El usuario debe completar el onboarding empresarial antes de usar esta funcionalidad.");
        }
        return companyId;
    }

    private void updateProductStatus(Product product) {
        if (product.getStock() <= 0) {
            product.setStatus(ProductStatus.AGOTADO);
        } else if (product.getStock() < 10) {
            product.setStatus(ProductStatus.STOCK_BAJO);
        } else {
            product.setStatus(ProductStatus.SALUDABLE);
        }
    }

    private PaymentMethod mapPaymentMethod(PaymentMethod method) {
        return method;
    }

    private void updateSessionExpectedTotal(CashSession session) {
        BigDecimal ingresos = cashTransactionRepository.sumAmountBySessionIdAndType(session.getId(), TransactionType.INGRESO);
        BigDecimal egresos = cashTransactionRepository.sumAmountBySessionIdAndType(session.getId(), TransactionType.EGRESO);
        session.setExpectedTotal(session.getInitialBase().add(ingresos).subtract(egresos));
        cashSessionRepository.save(session);
    }
}

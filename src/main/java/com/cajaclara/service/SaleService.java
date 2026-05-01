package com.cajaclara.service;

import com.cajaclara.exception.BusinessException;
import com.cajaclara.exception.ResourceNotFoundException;
import com.cajaclara.mapper.SaleMapper;
import com.cajaclara.model.dto.sale.SaleRequest;
import com.cajaclara.model.dto.sale.SaleResponse;
import com.cajaclara.model.entity.*;
import com.cajaclara.model.enums.CashSessionStatus;
import com.cajaclara.model.enums.PaymentMethod;
import com.cajaclara.model.enums.ProductStatus;
import com.cajaclara.model.enums.TransactionType;
import com.cajaclara.repository.CashSessionRepository;
import com.cajaclara.repository.CashTransactionRepository;
import com.cajaclara.repository.ProductRepository;
import com.cajaclara.repository.SaleRepository;
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
        CashSession activeSession = cashSessionRepository.findByStatus(CashSessionStatus.ABIERTA)
                .orElseThrow(() -> new BusinessException("No hay una sesión de caja abierta. No se pueden registrar ventas."));

        // Build sale items and calculate totals
        BigDecimal subtotal = BigDecimal.ZERO;
        var saleItems = new ArrayList<SaleItem>();

        Sale sale = Sale.builder()
                .cashierId(cashierId)
                .method(request.getMethod())
                .tax(BigDecimal.ZERO)
                .build();

        for (SaleRequest.SaleItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
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
        return saleRepository.findAll().stream()
                .map(SaleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SaleResponse getById(Long id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta", "id", id));
        return SaleMapper.toResponse(sale);
    }

    @Transactional(readOnly = true)
    public List<SaleResponse> getByDateRange(LocalDateTime from, LocalDateTime to) {
        return saleRepository.findByCreatedAtBetween(from, to).stream()
                .map(SaleMapper::toResponse)
                .collect(Collectors.toList());
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

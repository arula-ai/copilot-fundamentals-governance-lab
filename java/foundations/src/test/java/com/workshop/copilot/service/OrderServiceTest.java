package com.workshop.copilot.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test cases that will fail due to issues in OrderService.
 * These tests expose problems in the legacy code that need refactoring.
 *
 * NOTE: Tests are intentionally failing to demonstrate baseline code quality issues.
 * The failures reveal missing input validation, missing null checks, and poor error
 * handling in the service — not environment or test-setup problems.
 *
 * Use Copilot's /fix and /explain to discuss why each test fails and what the correct
 * implementation should look like.
 */
@SpringBootTest
@Transactional
public class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @Test
    public void testProcessOrder_NullCustomerId_ShouldFail() {
        // This test will fail because OrderService doesn't validate null customer ID properly
        assertThrows(IllegalArgumentException.class, () -> {
            orderService.processOrder(
                null, 
                Arrays.asList("PROD-1"), 
                Arrays.asList(1), 
                "123 Main St", 
                "CREDIT_CARD"
            );
        }, "Should throw exception for null customer ID");
    }

    @Test
    public void testProcessOrder_EmptyProductList_ShouldFail() {
        // This test will fail because OrderService doesn't validate empty product lists properly
        String result = orderService.processOrder(
            "CUST-1", 
            Arrays.asList(), // Empty list
            Arrays.asList(), 
            "123 Main St", 
            "CREDIT_CARD"
        );
        assertNull(result, "Should return null or throw exception for empty product list");
    }

    @Test
    public void testProcessOrder_MismatchedQuantities_ShouldFail() {
        // This test will fail because OrderService doesn't validate product/quantity list sizes
        assertThrows(RuntimeException.class, () -> {
            orderService.processOrder(
                "CUST-1", 
                Arrays.asList("PROD-1", "PROD-2"), // 2 products
                Arrays.asList(1), // 1 quantity - mismatch!
                "123 Main St", 
                "CREDIT_CARD"
            );
        }, "Should throw exception when product and quantity lists don't match");
    }

    @Test
    public void testUpdateOrderStatus_NullOrderId_ShouldFail() {
        // This test will fail because updateOrderStatus doesn't validate null input
        assertThrows(IllegalArgumentException.class, () -> {
            orderService.updateOrderStatus(null, "SHIPPED");
        }, "Should throw exception for null order ID");
    }

    @Test
    public void testUpdateOrderStatus_InvalidStatus_ShouldFail() {
        // This test will fail because OrderService doesn't validate status values
        assertThrows(IllegalArgumentException.class, () -> {
            orderService.updateOrderStatus("ORDER-1", "INVALID_STATUS");
        }, "Should throw exception for invalid status");
    }

    @Test
    public void testGetOrdersWithCustomerInfo_NullCustomerId_ShouldFail() {
        // This test will fail because getOrdersWithCustomerInfo doesn't handle null customer ID
        assertThrows(IllegalArgumentException.class, () -> {
            orderService.getOrdersWithCustomerInfo(null);
        }, "Should throw exception for null customer ID");
    }

    @Test
    public void testGetOrdersWithCustomerInfo_NonExistentCustomer_ShouldFail() {
        // This test will fail because the method doesn't handle non-existent customers gracefully
        List<com.workshop.copilot.model.Order> orders = orderService.getOrdersWithCustomerInfo("NON-EXISTENT-CUSTOMER");
        assertNotNull(orders, "Should return empty list, not null, for non-existent customer");
        assertTrue(orders.isEmpty(), "Should return empty list for non-existent customer");
    }

    @Test
    public void testProcessOrder_SQL_Injection_ShouldFail() {
        // This test will fail because the service might be vulnerable to SQL injection
        String maliciousCustomerId = "'; DROP TABLE orders; --";
        
        // The method should sanitize input and not allow SQL injection
        assertThrows(RuntimeException.class, () -> {
            orderService.processOrder(
                maliciousCustomerId,
                Arrays.asList("PROD-1"), 
                Arrays.asList(1), 
                "123 Main St", 
                "CREDIT_CARD"
            );
        }, "Should detect and prevent SQL injection attempts");
    }
}
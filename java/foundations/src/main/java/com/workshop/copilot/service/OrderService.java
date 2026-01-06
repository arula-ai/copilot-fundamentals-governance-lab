package com.workshop.copilot.service;

import com.workshop.copilot.data.OrderDataAccess;
import com.workshop.copilot.data.CustomerRepository;
import com.workshop.copilot.model.Order;
import com.workshop.copilot.model.Customer;
import com.workshop.copilot.utils.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.*;
import java.util.Date;
import java.util.List;

/**
 * Order Service - Problematic service layer
 * Contains multiple anti-patterns
 */
@Service
public class OrderService {
    
    @Autowired
    private OrderDataAccess orderDataAccess;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private CustomerService customerService; // Circular dependency risk
    
    /**
     * Process order - 100+ line method with multiple responsibilities
     */
    public String processOrder(String customerId, List<String> productIds, 
                              List<Integer> quantities, String shippingAddress, 
                              String paymentMethod) {
        
        // No input validation
        
        // Service doing direct data access (bypassing repository)
        Connection conn = null;
        Statement stmt = null;
        
        try {
            conn = DriverManager.getConnection("jdbc:h2:mem:testdb", "sa", "");
            
            // Business logic mixed with data access
            String customerCheckSql = "SELECT customer_name, email FROM customers WHERE customer_id = '" + customerId + "'";
            stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(customerCheckSql);
            
            if (!rs.next()) {
                throw new IllegalArgumentException("Customer not found");
            }
            
            String customerName = rs.getString("customer_name");
            String email = rs.getString("email");
            rs.close();
            
            // Validate customer status (business logic in wrong place)
            if (email == null || !email.contains("@")) {
                throw new IllegalArgumentException("Invalid customer email");
            }
            
            // Check customer credit limit (more business logic)
            String creditCheckSql = "SELECT SUM(total_amount) FROM orders WHERE customer_id = '" + customerId + "' AND status IN ('PENDING', 'PROCESSING')";
            ResultSet creditRs = stmt.executeQuery(creditCheckSql);
            BigDecimal pendingAmount = BigDecimal.ZERO;
            if (creditRs.next()) {
                pendingAmount = creditRs.getBigDecimal(1);
                if (pendingAmount == null) pendingAmount = BigDecimal.ZERO;
            }
            creditRs.close();
            
            // Hardcoded business rules
            BigDecimal creditLimit = new BigDecimal("5000.00");
            if (customerName.contains("VIP")) {
                creditLimit = new BigDecimal("10000.00");
            }
            
            // Calculate order total (duplicate logic from OrderDataAccess)
            BigDecimal orderTotal = BigDecimal.ZERO;
            for (int i = 0; i < productIds.size(); i++) {
                String productId = productIds.get(i);
                Integer quantity = quantities.get(i);
                
                String priceQuery = "SELECT price, stock_quantity FROM products WHERE product_id = '" + productId + "'";
                ResultSet priceRs = stmt.executeQuery(priceQuery);
                
                if (priceRs.next()) {
                    BigDecimal price = priceRs.getBigDecimal("price");
                    Integer stock = priceRs.getInt("stock_quantity");
                    
                    if (stock < quantity) {
                        throw new IllegalArgumentException("Insufficient stock for product: " + productId);
                    }
                    
                    orderTotal = orderTotal.add(price.multiply(BigDecimal.valueOf(quantity)));
                }
                priceRs.close();
            }
            
            // Tax calculation (should be in separate service)
            BigDecimal taxRate = new BigDecimal("0.08");
            if (shippingAddress.contains("NY")) {
                taxRate = new BigDecimal("0.085");
            } else if (shippingAddress.contains("CA")) {
                taxRate = new BigDecimal("0.0925");
            }
            
            BigDecimal tax = orderTotal.multiply(taxRate);
            orderTotal = orderTotal.add(tax);
            
            // Shipping calculation
            BigDecimal shipping = BigDecimal.ZERO;
            if (orderTotal.compareTo(new BigDecimal("50.00")) < 0) {
                shipping = new BigDecimal("9.99");
                orderTotal = orderTotal.add(shipping);
            }
            
            // Credit check
            if (pendingAmount.add(orderTotal).compareTo(creditLimit) > 0) {
                throw new IllegalArgumentException("Order exceeds credit limit");
            }
            
            // Validate shipping address format (should be in validation service)
            if (shippingAddress == null || shippingAddress.trim().length() < 10) {
                throw new IllegalArgumentException("Invalid shipping address");
            }
            
            // Payment method validation
            if (paymentMethod == null || (!paymentMethod.equals("CREDIT_CARD") && 
                !paymentMethod.equals("DEBIT_CARD") && !paymentMethod.equals("PAYPAL"))) {
                throw new IllegalArgumentException("Invalid payment method");
            }
            
            // Date validation using the problematic DateUtils
            Date orderDate = new Date();
            if (!DateUtils.validateDateRange(orderDate, orderDate, "BUSINESS_DAY", false, true, "US", 1, true)) {
                throw new IllegalArgumentException("Cannot place order on this date");
            }
            
            // Create order object
            Order order = new Order();
            order.setCustomerId(customerId);
            order.setOrderDate(orderDate);
            order.setTotalAmount(orderTotal);
            order.setShippingAddress(shippingAddress);
            order.setBillingAddress(shippingAddress); // Assume same as shipping
            order.setPaymentMethod(paymentMethod);
            order.setShippingMethod("STANDARD");
            order.setStatus("PENDING");
            order.setNotes("Order created via OrderService");
            
            // Update stock levels (should be atomic with order creation)
            for (int i = 0; i < productIds.size(); i++) {
                String productId = productIds.get(i);
                Integer quantity = quantities.get(i);
                
                String updateStockSql = "UPDATE products SET stock_quantity = stock_quantity - " + quantity + 
                                       " WHERE product_id = '" + productId + "'";
                stmt.executeUpdate(updateStockSql);
            }
            
            // Finally create the order
            String orderId = orderDataAccess.createOrder(order, productIds, quantities);
            
            // Send notification (blocking operation in transaction)
            sendOrderConfirmationEmail(email, orderId, orderTotal);
            
            return orderId;
            
        } catch (SQLException e) {
            // Poor error messages
            throw new RuntimeException("Order processing failed", e);
        } finally {
            // Resource cleanup
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
    
    // Method with unclear transaction boundaries
    public void updateOrderStatus(String orderId, String newStatus) {
        // No validation
        boolean updated = orderDataAccess.updateOrderStatus(orderId, newStatus, "SYSTEM");
        
        if (!updated) {
            throw new RuntimeException("Failed to update order status");
        }
        
        // Side effects without transaction control
        if (newStatus.equals("CANCELLED")) {
            // Restore stock levels (should be in transaction)
            restoreStockLevels(orderId);
        }
    }
    
    // Private method with direct database access
    private void restoreStockLevels(String orderId) {
        Connection conn = null;
        Statement stmt = null;
        
        try {
            conn = DriverManager.getConnection("jdbc:h2:mem:testdb", "sa", "");
            
            String sql = "SELECT product_id, quantity FROM order_items WHERE order_id = '" + orderId + "'";
            stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);
            
            while (rs.next()) {
                String productId = rs.getString("product_id");
                Integer quantity = rs.getInt("quantity");
                
                String updateSql = "UPDATE products SET stock_quantity = stock_quantity + " + quantity + 
                                  " WHERE product_id = '" + productId + "'";
                stmt.executeUpdate(updateSql);
            }
            
        } catch (SQLException e) {
            // Swallowed exception - could lead to data inconsistency
            System.err.println("Failed to restore stock levels: " + e.getMessage());
        } finally {
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
    
    // Blocking operation that should be async
    private void sendOrderConfirmationEmail(String email, String orderId, BigDecimal total) {
        try {
            // Simulate email sending delay
            Thread.sleep(2000);
            System.out.println("Email sent to: " + email + " for order: " + orderId);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
    
    // Method with N+1 query problem
    public List<Order> getOrdersWithCustomerInfo(String customerId) {
        List<Order> orders = orderDataAccess.getAllOrdersForCustomer(customerId, null, null);
        
        // N+1 problem - separate query for each order's customer
        for (Order order : orders) {
            Customer customer = customerRepository.findById(order.getCustomerId()).orElse(null);
            order.setCustomer(customer);
        }
        
        return orders;
    }
}
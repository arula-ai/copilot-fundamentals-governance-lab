package com.workshop.copilot.data;

import com.workshop.copilot.model.Order;
import com.workshop.copilot.model.Customer;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;
import java.util.Calendar;
import java.text.SimpleDateFormat;

/**
 * Order Data Access Layer
 * WARNING: Contains SQL injection vulnerabilities for training purposes
 * TODO: Fix SQL injection issues
 * TODO: Use prepared statements
 * TODO: Implement proper connection pooling
 * TODO: Add transaction management
 */
@Repository
public class OrderDataAccess {
    
    // Hardcoded connection strings - security issue
    private static final String DB_URL = "jdbc:h2:mem:testdb";
    private static final String DB_USER = "sa";
    private static final String DB_PASSWORD = "";
    
    // No connection pooling
    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    }
    
    /**
     * Get all orders for customer - 150+ lines with manual result set mapping
     * SQL INJECTION VULNERABILITY: String concatenation
     */
    public List<Order> getAllOrdersForCustomer(String customerId, String sortBy, String filterStatus) {
        List<Order> orders = new ArrayList<>();
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;
        
        try {
            conn = getConnection();
            
            // SQL INJECTION VULNERABILITY - String concatenation
            String sql = "SELECT o.*, c.customer_name, c.email " +
                        "FROM orders o " +
                        "LEFT JOIN customers c ON o.customer_id = c.customer_id " +
                        "WHERE o.customer_id = '" + customerId + "'";
            
            if (filterStatus != null && !filterStatus.isEmpty()) {
                sql += " AND o.status = '" + filterStatus + "'"; // SQL INJECTION
            }
            
            if (sortBy != null && !sortBy.isEmpty()) {
                sql += " ORDER BY " + sortBy; // SQL INJECTION
            }
            
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);
            
            // Manual result set mapping - lots of repetitive code
            while (rs.next()) {
                Order order = new Order();
                order.setOrderId(rs.getString("order_id"));
                order.setCustomerId(rs.getString("customer_id"));
                order.setOrderDate(rs.getDate("order_date"));
                order.setStatus(rs.getString("status"));
                order.setTotalAmount(rs.getBigDecimal("total_amount"));
                order.setShippingAddress(rs.getString("shipping_address"));
                order.setBillingAddress(rs.getString("billing_address"));
                order.setPaymentMethod(rs.getString("payment_method"));
                order.setShippingMethod(rs.getString("shipping_method"));
                order.setTrackingNumber(rs.getString("tracking_number"));
                order.setNotes(rs.getString("notes"));
                order.setCreatedBy(rs.getString("created_by"));
                order.setCreatedDate(rs.getTimestamp("created_date"));
                order.setLastModifiedBy(rs.getString("last_modified_by"));
                order.setLastModifiedDate(rs.getTimestamp("last_modified_date"));
                
                // Business logic mixed with data access
                if (order.getStatus().equals("PENDING")) {
                    order.setCanCancel(true);
                } else if (order.getStatus().equals("SHIPPED")) {
                    order.setCanCancel(false);
                    order.setCanReturn(true);
                } else if (order.getStatus().equals("DELIVERED")) {
                    order.setCanCancel(false);
                    order.setCanReturn(true);
                    order.setCanReview(true);
                } else {
                    order.setCanCancel(false);
                    order.setCanReturn(false);
                    order.setCanReview(false);
                }
                
                // More business logic that shouldn't be here
                Calendar cal = Calendar.getInstance();
                cal.setTime(order.getOrderDate());
                cal.add(Calendar.DAY_OF_MONTH, 30);
                if (new java.util.Date().after(cal.getTime())) {
                    order.setCanReturn(false);
                }
                
                orders.add(order);
            }
            
        } catch (SQLException e) {
            // Generic exception handling that loses context
            System.err.println("Database error occurred");
            e.printStackTrace();
            throw new RuntimeException("Failed to retrieve orders", e);
        } finally {
            // Resource leak risk - what if these throw exceptions?
            try {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        
        return orders;
    }
    
    /**
     * Create order - Complex method doing validation, calculation, and persistence
     * No transaction management - race conditions possible
     */
    public String createOrder(Order order, List<String> productIds, List<Integer> quantities) {
        Connection conn = null;
        Statement stmt = null;
        
        try {
            conn = getConnection();
            // Should use transactions but doesn't
            
            // Validation mixed with persistence logic
            if (order.getCustomerId() == null || order.getCustomerId().trim().isEmpty()) {
                throw new IllegalArgumentException("Customer ID is required");
            }
            
            // Business logic that should be in service layer
            BigDecimal totalAmount = BigDecimal.ZERO;
            for (int i = 0; i < productIds.size(); i++) {
                String productId = productIds.get(i);
                Integer quantity = quantities.get(i);
                
                // Another SQL injection vulnerability
                String priceQuery = "SELECT price FROM products WHERE product_id = '" + productId + "'";
                stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(priceQuery);
                
                if (rs.next()) {
                    BigDecimal price = rs.getBigDecimal("price");
                    totalAmount = totalAmount.add(price.multiply(BigDecimal.valueOf(quantity)));
                }
                rs.close();
            }
            
            // Calculate tax (business logic in data layer)
            BigDecimal taxRate = new BigDecimal("0.08"); // Hardcoded
            BigDecimal taxAmount = totalAmount.multiply(taxRate);
            totalAmount = totalAmount.add(taxAmount);
            
            // Calculate shipping (more business logic)
            BigDecimal shippingCost = BigDecimal.ZERO;
            if (totalAmount.compareTo(new BigDecimal("50.00")) < 0) {
                shippingCost = new BigDecimal("9.99");
                totalAmount = totalAmount.add(shippingCost);
            }
            
            order.setTotalAmount(totalAmount);
            
            // Generate order ID (poor implementation)
            String orderId = "ORD-" + System.currentTimeMillis();
            order.setOrderId(orderId);
            
            // SQL injection vulnerability in INSERT
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String insertSql = "INSERT INTO orders (order_id, customer_id, order_date, status, total_amount, " +
                              "shipping_address, billing_address, payment_method, shipping_method, " +
                              "tracking_number, notes, created_by, created_date) VALUES (" +
                              "'" + order.getOrderId() + "', " +
                              "'" + order.getCustomerId() + "', " +
                              "'" + sdf.format(new java.util.Date()) + "', " +
                              "'PENDING', " +
                              order.getTotalAmount() + ", " +
                              "'" + order.getShippingAddress() + "', " +
                              "'" + order.getBillingAddress() + "', " +
                              "'" + order.getPaymentMethod() + "', " +
                              "'" + order.getShippingMethod() + "', " +
                              "null, " +
                              "'" + order.getNotes() + "', " +
                              "'SYSTEM', " +
                              "'" + sdf.format(new java.util.Date()) + "')";
            
            stmt.executeUpdate(insertSql);
            
            // Insert order items (more SQL injection)
            for (int i = 0; i < productIds.size(); i++) {
                String itemSql = "INSERT INTO order_items (order_id, product_id, quantity) VALUES (" +
                               "'" + orderId + "', " +
                               "'" + productIds.get(i) + "', " +
                               quantities.get(i) + ")";
                stmt.executeUpdate(itemSql);
            }
            
            return orderId;
            
        } catch (SQLException e) {
            // Poor error handling
            System.err.println("Error creating order: " + e.getMessage());
            throw new RuntimeException("Order creation failed", e);
        } finally {
            // Resource leak risk
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
    
    /**
     * Search orders - Dynamic SQL building with string concatenation
     * Multiple SQL injection vulnerabilities
     */
    public List<Order> searchOrders(String customerName, String status, Date startDate, 
                                   Date endDate, String productName, BigDecimal minAmount, 
                                   BigDecimal maxAmount) {
        List<Order> orders = new ArrayList<>();
        Connection conn = null;
        Statement stmt = null;
        
        try {
            conn = getConnection();
            
            // Dynamic SQL building - SQL injection paradise
            StringBuilder sql = new StringBuilder();
            sql.append("SELECT DISTINCT o.*, c.customer_name FROM orders o ");
            sql.append("LEFT JOIN customers c ON o.customer_id = c.customer_id ");
            sql.append("LEFT JOIN order_items oi ON o.order_id = oi.order_id ");
            sql.append("LEFT JOIN products p ON oi.product_id = p.product_id WHERE 1=1 ");
            
            if (customerName != null && !customerName.trim().isEmpty()) {
                sql.append("AND c.customer_name LIKE '%").append(customerName).append("%' ");
            }
            
            if (status != null && !status.trim().isEmpty()) {
                sql.append("AND o.status = '").append(status).append("' ");
            }
            
            if (startDate != null) {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                sql.append("AND o.order_date >= '").append(sdf.format(startDate)).append("' ");
            }
            
            if (endDate != null) {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                sql.append("AND o.order_date <= '").append(sdf.format(endDate)).append("' ");
            }
            
            if (productName != null && !productName.trim().isEmpty()) {
                sql.append("AND p.product_name LIKE '%").append(productName).append("%' ");
            }
            
            if (minAmount != null) {
                sql.append("AND o.total_amount >= ").append(minAmount).append(" ");
            }
            
            if (maxAmount != null) {
                sql.append("AND o.total_amount <= ").append(maxAmount).append(" ");
            }
            
            stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql.toString());
            
            // Duplicate result set mapping code
            while (rs.next()) {
                Order order = new Order();
                order.setOrderId(rs.getString("order_id"));
                order.setCustomerId(rs.getString("customer_id"));
                order.setOrderDate(rs.getDate("order_date"));
                order.setStatus(rs.getString("status"));
                order.setTotalAmount(rs.getBigDecimal("total_amount"));
                order.setShippingAddress(rs.getString("shipping_address"));
                order.setBillingAddress(rs.getString("billing_address"));
                orders.add(order);
            }
            
        } catch (SQLException e) {
            throw new RuntimeException("Search failed", e);
        } finally {
            // More resource leak risks
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        
        return orders;
    }
    
    /**
     * Update order status - No optimistic locking, race conditions
     */
    public boolean updateOrderStatus(String orderId, String newStatus, String updatedBy) {
        Connection conn = null;
        Statement stmt = null;
        
        try {
            conn = getConnection();
            
            // No optimistic locking - race condition risk
            // More SQL injection
            String sql = "UPDATE orders SET status = '" + newStatus + "', " +
                        "last_modified_by = '" + updatedBy + "', " +
                        "last_modified_date = '" + new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new java.util.Date()) + "' " +
                        "WHERE order_id = '" + orderId + "'";
            
            stmt = conn.createStatement();
            int rowsAffected = stmt.executeUpdate(sql);
            
            return rowsAffected > 0;
            
        } catch (SQLException e) {
            System.err.println("Failed to update order status: " + e.getMessage());
            return false;
        } finally {
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
    
    /**
     * Calculate order totals - Business logic that should be in service layer
     */
    public BigDecimal calculateOrderTotals(String customerId, Date startDate, Date endDate) {
        Connection conn = null;
        Statement stmt = null;
        
        try {
            conn = getConnection();
            
            // More SQL injection
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            String sql = "SELECT SUM(total_amount) as total FROM orders " +
                        "WHERE customer_id = '" + customerId + "' " +
                        "AND order_date >= '" + sdf.format(startDate) + "' " +
                        "AND order_date <= '" + sdf.format(endDate) + "'";
            
            stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);
            
            if (rs.next()) {
                return rs.getBigDecimal("total");
            }
            
            return BigDecimal.ZERO;
            
        } catch (SQLException e) {
            throw new RuntimeException("Failed to calculate totals", e);
        } finally {
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}
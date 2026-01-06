package com.workshop.copilot.data;

import com.workshop.copilot.model.Product;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Product DAO - Old-style DAO pattern mixed with newer approaches
 */
@Repository
public class ProductDAO {
    
    // Hardcoded connection details
    private static final String URL = "jdbc:h2:mem:testdb";
    private static final String USER = "sa";
    private static final String PASS = "";
    
    // No connection pooling
    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }
    
    // Copy-pasted JDBC boilerplate
    public List<Product> getAllProducts() {
        List<Product> products = new ArrayList<>();
        String sql = "SELECT * FROM products";
        
        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            while (rs.next()) {
                Product product = new Product();
                product.setProductId(rs.getString("product_id"));
                product.setProductName(rs.getString("product_name"));
                product.setDescription(rs.getString("description"));
                product.setPrice(rs.getBigDecimal("price"));
                product.setCategory(rs.getString("category"));
                product.setStockQuantity(rs.getInt("stock_quantity"));
                product.setCreatedDate(rs.getDate("created_date"));
                products.add(product);
            }
            
        } catch (SQLException e) {
            throw new RuntimeException("Failed to get products", e);
        }
        
        return products;
    }
    
    // More SQL injection vulnerabilities
    public List<Product> searchProducts(String category, String namePattern) {
        List<Product> products = new ArrayList<>();
        
        // Dynamic SQL building
        String sql = "SELECT * FROM products WHERE 1=1";
        if (category != null) {
            sql += " AND category = '" + category + "'"; // SQL injection
        }
        if (namePattern != null) {
            sql += " AND product_name LIKE '%" + namePattern + "%'"; // SQL injection
        }
        
        try (Connection conn = getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            
            // Duplicate mapping code
            while (rs.next()) {
                Product product = new Product();
                product.setProductId(rs.getString("product_id"));
                product.setProductName(rs.getString("product_name"));
                product.setDescription(rs.getString("description"));
                product.setPrice(rs.getBigDecimal("price"));
                product.setCategory(rs.getString("category"));
                product.setStockQuantity(rs.getInt("stock_quantity"));
                product.setCreatedDate(rs.getDate("created_date"));
                products.add(product);
            }
            
        } catch (SQLException e) {
            throw new RuntimeException("Search failed", e);
        }
        
        return products;
    }
}
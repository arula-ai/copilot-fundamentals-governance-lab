package com.workshop.copilot.data;

import com.workshop.copilot.model.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.sql.*;
import java.util.List;
import java.util.Optional;

/**
 * Customer Repository - Inconsistent data layer
 * Mixes JPA and raw JDBC in same class
 */
@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    
    // JPA method - good
    Optional<Customer> findByEmail(String email);
    
    // JPA method - good
    List<Customer> findByCustomerNameContaining(String name);
}

// Additional class with problems
@Repository
class CustomerRepositoryImpl {
    
    @Autowired
    private EntityManager entityManager;
    
    // Mix of JPA and raw JDBC - inconsistent approach
    public List<Customer> findCustomersWithRawJdbc(String namePattern) {
        Connection conn = null;
        Statement stmt = null;
        
        try {
            // Raw JDBC in Spring JPA application
            conn = DriverManager.getConnection("jdbc:h2:mem:testdb", "sa", "");
            
            // SQL injection vulnerability
            String sql = "SELECT * FROM customers WHERE customer_name LIKE '%" + namePattern + "%'";
            stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);
            
            // Manual mapping when JPA could handle it
            // Implementation left incomplete - another code smell
            return null;
            
        } catch (SQLException e) {
            // Inconsistent error handling
            throw new RuntimeException(e);
        } finally {
            // Resource leak risk
            try {
                if (stmt != null) stmt.close();
                if (conn != null) conn.close();
            } catch (SQLException e) {
                // Swallowed exception
            }
        }
    }
    
    // N+1 query problem
    public List<Customer> findCustomersWithOrders() {
        Query query = entityManager.createQuery("SELECT c FROM Customer c");
        List<Customer> customers = query.getResultList();
        
        // N+1 problem - will trigger separate query for each customer's orders
        for (Customer customer : customers) {
            customer.getOrders().size(); // Forces lazy loading
        }
        
        return customers;
    }
}
package com.workshop.copilot.data;

import com.workshop.copilot.model.Customer;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Minimal test coverage for CustomerRepository
 * Only tests the findById method
 * Missing tests for other methods and edge cases
 */
@DataJpaTest
public class CustomerRepositoryTest {
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Test
    public void testFindById_ExistingCustomer() {
        // Given
        Customer customer = new Customer();
        customer.setCustomerId("TEST-001");
        customer.setCustomerName("Test Customer");
        customer.setEmail("test@example.com");
        customer.setCreatedDate(new Date());
        
        entityManager.persistAndFlush(customer);
        
        // When
        Optional<Customer> found = customerRepository.findById("TEST-001");
        
        // Then
        assertTrue(found.isPresent());
        assertEquals("Test Customer", found.get().getCustomerName());
        assertEquals("test@example.com", found.get().getEmail());
    }
    
    // Missing tests for:
    // - findByEmail()
    // - findByCustomerNameContaining()
    // - CustomerRepositoryImpl methods
    // - Non-existent customer scenarios
    // - Invalid data scenarios
    // - N+1 query problems
    // - Concurrent access issues
    // - Large dataset performance

    @Test
    public void testFindById_NonExistentCustomer_ShouldFail() {
        // This test will fail if repository doesn't handle missing data properly
        Optional<Customer> found = customerRepository.findById("NON-EXISTENT");
        
        // This assertion might fail if the repository returns null instead of empty Optional
        assertNotNull(found, "Repository should return Optional, not null");
        assertFalse(found.isPresent(), "Should return empty Optional for non-existent customer");
    }

    @Test
    public void testFindByEmail_MethodExists_ShouldFail() {
        // This test will fail because findByEmail method might not be implemented
        try {
            Optional<Customer> found = customerRepository.findByEmail("test@example.com");
            assertNotNull(found, "findByEmail should be implemented");
        } catch (Exception e) {
            fail("findByEmail method should be implemented: " + e.getMessage());
        }
    }

    @Test
    public void testCustomerNameSearch_CaseInsensitive_ShouldFail() {
        // Given
        Customer customer = new Customer();
        customer.setCustomerId("TEST-002");
        customer.setCustomerName("John Doe");
        customer.setEmail("john@example.com");
        customer.setCreatedDate(new Date());
        
        entityManager.persistAndFlush(customer);
        
        // This test will fail if search is case-sensitive
        try {
            java.util.List<Customer> found = customerRepository.findByCustomerNameContaining("john doe");
            assertFalse(found.isEmpty(), "Search should be case-insensitive");
            assertEquals(1, found.size(), "Should find one customer");
        } catch (Exception e) {
            fail("Case-insensitive search should work: " + e.getMessage());
        }
    }

    @Test
    public void testCustomerValidation_InvalidEmail_ShouldFail() {
        // This test will fail if validation is not properly implemented
        Customer customer = new Customer();
        customer.setCustomerId("TEST-003");
        customer.setCustomerName("Invalid Email Customer");
        customer.setEmail("not-an-email");  // Invalid email format
        customer.setCreatedDate(new Date());
        
        // Should throw validation exception
        assertThrows(Exception.class, () -> {
            entityManager.persistAndFlush(customer);
        }, "Should reject invalid email format");
    }

    @Test
    public void testCustomerPersistence_RequiredFields_ShouldFail() {
        // This test will fail if required field validation is missing
        Customer customer = new Customer();
        customer.setCustomerId("TEST-004");
        // Missing required fields: customerName, email
        customer.setCreatedDate(new Date());
        
        assertThrows(Exception.class, () -> {
            entityManager.persistAndFlush(customer);
        }, "Should require customerName and email fields");
    }
}
package com.workshop.copilot.service;

import com.workshop.copilot.data.CustomerRepository;
import com.workshop.copilot.model.Customer;
import com.workshop.copilot.utils.StringHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Customer Service with problematic patterns
 */
@Service
public class CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private OrderService orderService; // Circular dependency
    
    // No input validation
    public Customer createCustomer(String name, String email, String phone, String address) {
        
        // Poor validation using problematic StringHelper
        if (!StringHelper.isValidEmail(email)) {
            throw new IllegalArgumentException("Invalid email");
        }
        
        Customer customer = new Customer();
        customer.setCustomerId("CUST-" + System.currentTimeMillis()); // Poor ID generation
        customer.setCustomerName(name);
        customer.setEmail(email);
        customer.setPhone(phone);
        customer.setAddress(address);
        customer.setCreatedDate(new Date());
        
        return customerRepository.save(customer);
    }
    
    // Method name doesn't match implementation
    public Customer findCustomer(String customerId) {
        Optional<Customer> customer = customerRepository.findById(customerId);
        if (customer.isPresent()) {
            return customer.get();
        }
        return null; // Should return Optional or throw exception
    }
    
    // Poor error handling
    public List<Customer> searchCustomers(String namePattern) {
        try {
            return customerRepository.findByCustomerNameContaining(namePattern);
        } catch (Exception e) {
            // Generic catch-all
            System.err.println("Search failed");
            return null;
        }
    }
}
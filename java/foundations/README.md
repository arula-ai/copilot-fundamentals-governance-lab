# Arula.AI Training - GitHub Copilot Foundations - Lab 1: Refactoring with Confidence (Java)

## ⚠️ Warning
This repository contains intentionally problematic code for training purposes. 
**DO NOT use this code in production.**

## Lab Context
**Course**: GitHub Copilot Foundations  
**Session**: 2 - Everyday Workflows (Comprehend, Refactor, Test)  
**Duration**: 40 minutes hands-on lab time  
**Technology**: Java Spring Boot

## Workshop Goals
1. Use Copilot to understand legacy code
2. Identify code smells and technical debt
3. Generate comprehensive test suites
4. Plan and execute safe refactors
5. Document changes effectively

## Getting Started

### Prerequisites
- Java 11 or higher
- Maven 3.6 or higher
- Your preferred IDE (IntelliJ IDEA, Eclipse, VS Code)
- GitHub Copilot extension enabled

### Setup Instructions
1. Clone this repository
2. Navigate to the project directory
3. Run `mvn clean install` to build the project
4. Run `mvn spring-boot:run` to start the application
5. Access H2 console at `http://localhost:8080/h2-console`

### Running Tests
```bash
# Run all tests
mvn test

# Run tests with coverage
mvn test jacoco:report

# View coverage report
open target/site/jacoco/index.html
```

## Project Structure
```
src/
├── main/java/com/workshop/copilot/
│   ├── CopilotWorkshopApplication.java
│   ├── utils/
│   │   ├── DateUtils.java              # PRIMARY TARGET
│   │   ├── StringHelper.java
│   │   └── ValidationUtils.java
│   ├── data/
│   │   ├── CustomerRepository.java
│   │   ├── OrderDataAccess.java        # SECONDARY TARGET
│   │   └── ProductDAO.java
│   ├── model/
│   │   ├── Customer.java
│   │   ├── Order.java
│   │   └── Product.java
│   └── service/
│       ├── OrderService.java
│       └── CustomerService.java
└── test/java/com/workshop/copilot/
    ├── utils/
    │   └── DateUtilsTest.java         # Minimal coverage
    └── data/
        └── CustomerRepositoryTest.java # Minimal coverage
```

## Baseline Metrics
- **Test Coverage**: ~30%
- **Code Smells**: 50+ identified
- **Technical Debt**: 3.5 days
- **Security Vulnerabilities**: 8+ SQL injection points
- **Cyclomatic Complexity**: High (DateUtils avg 12, OrderDataAccess avg 10)

## Target Metrics (End of Workshop)
- **Test Coverage**: 45%+ 
- **Code Smells**: <30
- **Security Vulnerabilities**: 0
- **Documented refactor plan**: Complete

## Focus Areas

### 🎯 Primary Target: `DateUtils.java`
**Why this class?**
- 300+ lines with 15+ public methods
- Thread safety issues with static SimpleDateFormat
- Complex nested logic (5+ levels deep)
- Magic numbers throughout
- No use of Java 8+ Date API
- Multiple code smells in one location

**Key Issues to Address:**
```java
// Thread safety issue
private static SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

// Magic numbers
private static final long MILLISECONDS_IN_DAY = 86400000;

// Methods returning null instead of Optional
public static Date parseMultipleFormats(String dateStr) {
    // ... returns null on failure
}

// Complex nested logic
public static int calculateBusinessDays(Date start, Date end, 
                                      boolean includeHolidays, 
                                      String countryCode, 
                                      String timeZone, 
                                      int fiscalYearStart) {
    // 5+ levels of nesting...
}
```

### 🎯 Secondary Target: `OrderDataAccess.java`
**Why this class?**
- Multiple SQL injection vulnerabilities
- No prepared statements
- Resource leaks
- Business logic mixed with data access

**Critical Security Issues:**
```java
// SQL INJECTION VULNERABILITY
String sql = "SELECT * FROM orders WHERE customer_id = '" + customerId + "'";

// No prepared statements
stmt = conn.createStatement();
rs = stmt.executeQuery(sql);

// Resource leaks
// Connection, Statement, ResultSet not properly closed
```

## Workshop Activities

### Phase 1: Comprehend (10 minutes)
1. **Analyze DateUtils.java:**
   - Use Copilot to explain what each method does
   - Identify code smells and anti-patterns
   - Document thread safety issues

2. **Review OrderDataAccess.java:**
   - Identify SQL injection vulnerabilities
   - Find resource management issues
   - Locate mixed concerns

### Phase 2: Test (15 minutes)
1. **Generate test cases for DateUtils:**
   ```java
   // Use Copilot to generate tests like:
   @Test
   public void testCalculateBusinessDays_withHolidays() {
       // Test business day calculation including holidays
   }
   
   @Test
   public void testParseMultipleFormats_invalidInput() {
       // Test error handling for invalid dates
   }
   ```

2. **Create integration tests for OrderDataAccess:**
   - Test SQL injection scenarios (safely)
   - Verify proper error handling
   - Test transaction boundaries

### Phase 3: Refactor (15 minutes)
1. **Modernize DateUtils:**
   - Replace Date/Calendar with LocalDateTime
   - Use Optional instead of null returns
   - Extract constants for magic numbers
   - Implement thread-safe patterns

2. **Secure OrderDataAccess:**
   - Replace string concatenation with PreparedStatement
   - Implement try-with-resources
   - Separate business logic from data access

## Expected Copilot Prompts

### Understanding Code
```
// Explain what this method does and identify issues
public static int calculateBusinessDays(Date start, Date end, boolean includeHolidays, String countryCode, String timeZone, int fiscalYearStart)

// What are the security vulnerabilities in this code?
String sql = "SELECT * FROM orders WHERE customer_id = '" + customerId + "'";
```

### Generating Tests
```
// Generate comprehensive test cases for this date utility method
// Include edge cases, null inputs, and boundary conditions

// Create test cases that safely verify SQL injection vulnerabilities exist
// without actually performing harmful operations
```

### Refactoring
```
// Refactor this method to use Java 8+ LocalDateTime and be thread-safe
// Replace this SQL concatenation with PreparedStatement
// Extract these magic numbers into named constants
```

## Common Issues You'll Encounter

### Thread Safety Problems
```java
// ❌ Problem: Static SimpleDateFormat is not thread-safe
private static SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");

// ✅ Solution: Use DateTimeFormatter or ThreadLocal
private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
```

### SQL Injection Vulnerabilities
```java
// ❌ Problem: String concatenation
String sql = "SELECT * FROM orders WHERE customer_id = '" + customerId + "'";

// ✅ Solution: PreparedStatement
String sql = "SELECT * FROM orders WHERE customer_id = ?";
PreparedStatement stmt = conn.prepareStatement(sql);
stmt.setString(1, customerId);
```

### Resource Leaks
```java
// ❌ Problem: Manual resource management
Connection conn = getConnection();
Statement stmt = conn.createStatement();
// Resources may not be closed if exception occurs

// ✅ Solution: Try-with-resources
try (Connection conn = getConnection();
     PreparedStatement stmt = conn.prepareStatement(sql)) {
    // Resources automatically closed
}
```

## Success Criteria
By the end of this workshop, you should have:

1. **Comprehensive Understanding**: Clear documentation of code issues
2. **Improved Test Coverage**: 45%+ coverage with meaningful tests
3. **Security Fixes**: All SQL injection vulnerabilities addressed
4. **Modernized Code**: Java 8+ features implemented where appropriate
5. **Refactoring Plan**: Detailed plan for remaining technical debt

## Next Steps
After completing this workshop:
1. Apply the same patterns to other classes in the codebase
2. Implement continuous integration with coverage gates
3. Add static analysis tools (SpotBugs, PMD, Checkstyle)
4. Create architectural decision records (ADRs) for major changes

## Resources
- [Java 8 Date/Time API Guide](https://docs.oracle.com/javase/tutorial/datetime/)
- [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [Spring Boot Testing Guide](https://spring.io/guides/gs/testing-web/)

---

**Remember**: This code is intentionally bad for educational purposes. Always follow secure coding practices in real applications!

## Copyright and License

Copyright © 2025 InRhythm Arula Labs. All rights reserved.

This material is proprietary and confidential. Unauthorized copying, distribution, or use of this material, via any medium, is strictly prohibited without the express written permission of InRhythm Arula Labs.

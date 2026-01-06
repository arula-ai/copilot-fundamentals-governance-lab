# Advanced Security Homework Challenges

## Overview

These advanced challenges are designed to stretch your knowledge and test your ability to identify and fix complex security vulnerabilities in Angular applications. Each challenge builds on the core workflow but introduces more sophisticated attack vectors and defense mechanisms.

**Estimated Time:** 8-12 hours total  
**Difficulty:** Advanced  
**Prerequisites:** Completed all workflow stages (0-5)

---

## Challenge Structure

Each challenge includes:
- **Vulnerable Code**: More subtle and complex than the core workflow scenarios
- **Attack Scenarios**: Real-world exploitation examples
- **Security Requirements**: Specific security controls to implement
- **Success Criteria**: Measurable security outcomes
- **Bonus Points**: Advanced defensive techniques

---

## Grading Rubric

| Challenge | Points | Focus Area | Difficulty |
|-----------|--------|------------|------------|
| Challenge 1 | 20 pts | Advanced XSS & CSP | 4/5 |
| Challenge 2 | 20 pts | JWT Security & Session Management | 5/5 |
| Challenge 3 | 20 pts | CSRF & Race Conditions | 5/5 |
| Challenge 4 | 20 pts | Supply Chain Security | 4/5 |
| Challenge 5 | 20 pts | Performance vs Security | 5/5 |
| **Total** | **100 pts** | | |
| **Bonus** | Up to 25 pts | Advanced techniques | 5/5 |

### Grading Breakdown Per Challenge:
- **Vulnerability Identification** (4 pts): Find all security issues
- **Fix Implementation** (8 pts): Correct implementation of fixes
- **Security Tests** (4 pts): Comprehensive test coverage
- **Documentation** (2 pts): Clear explanation of vulnerabilities and fixes
- **Code Quality** (2 pts): Clean, maintainable code
- **Bonus** (up to 5 pts): Advanced techniques, creative solutions

---

## Challenges Overview

### Challenge 1: Advanced XSS & Content Security Policy
**Difficulty:** 4/5  
**Time:** 2-3 hours

Implement a rich text editor with user-generated content that must:
- Prevent XSS through multiple attack vectors
- Implement strict Content Security Policy
- Support HTML rendering safely
- Handle SVG and CSS injection attacks
- Implement trusted types

**Key Vulnerabilities:**
- DOM XSS through Angular binding bypasses
- mXSS (mutation XSS) attacks
- CSS injection leading to data exfiltration
- SVG-based XSS vectors
- JavaScript URL schemes

---

### Challenge 2: JWT Security & Session Management
**Difficulty:** 5/5  
**Time:** 3-4 hours

Build a secure authentication system with:
- JWT with refresh tokens
- Secure session management
- Token rotation on suspicious activity
- Protection against token theft
- Proper token expiration and revocation

**Key Vulnerabilities:**
- JWT algorithm confusion attacks
- Token replay attacks
- Insecure token storage
- Missing token expiration validation
- Weak signature verification
- Session fixation attacks

---

### Challenge 3: CSRF & Race Conditions
**Difficulty:** 5/5  
**Time:** 2-3 hours

Secure a financial transaction system against:
- CSRF attacks on state-changing operations
- Race conditions in concurrent requests
- Double-spending vulnerabilities
- Time-of-check to time-of-use (TOCTOU) bugs
- Idempotency issues

**Key Vulnerabilities:**
- Missing CSRF tokens
- Race conditions in balance checks
- Non-atomic operations
- Improper transaction sequencing
- Missing idempotency keys

---

### Challenge 4: Supply Chain Security
**Difficulty:** 4/5  
**Time:** 1-2 hours

Audit and secure the supply chain:
- Identify vulnerable dependencies
- Implement dependency scanning
- Create secure update strategy
- Prevent dependency confusion attacks
- Implement Subresource Integrity (SRI)

**Key Vulnerabilities:**
- Outdated packages with CVEs
- Transitive dependencies with vulnerabilities
- Missing integrity checks
- Prototype pollution vulnerabilities
- Typosquatting risks

---

### Challenge 5: Performance vs Security Tradeoffs
**Difficulty:** 5/5  
**Time:** 2-3 hours

Optimize a secure application without compromising security:
- Implement rate limiting without DoS
- Add caching without leaking data
- Optimize crypto operations
- Balance security headers with performance
- Implement secure lazy loading

**Key Challenges:**
- Timing attacks on authentication
- Cache poisoning vulnerabilities
- Performance-based side channels
- Resource exhaustion attacks
- Bundle size vs security features

---

## Learning Objectives

By completing these challenges, you will:

1. **Master Advanced XSS Prevention**
   - Understand CSP directives and nonces
   - Implement Trusted Types API
   - Recognize mutation XSS patterns

2. **Implement Secure Authentication**
   - Design secure JWT workflows
   - Implement token rotation strategies
   - Understand cryptographic best practices

3. **Prevent Race Conditions**
   - Identify TOCTOU vulnerabilities
   - Implement idempotent operations
   - Design atomic transaction flows

4. **Secure the Supply Chain**
   - Audit dependencies effectively
   - Implement security scanning
   - Understand transitive risks

5. **Balance Performance and Security**
   - Identify side-channel attacks
   - Optimize security features
   - Make informed tradeoff decisions

---

## Submission Requirements

### For Each Challenge:

1. **Fixed Code** (Required)
   - All vulnerabilities addressed
   - Follows Angular best practices
   - Properly commented

2. **Security Tests** (Required)
   - Tests demonstrating vulnerabilities are fixed
   - Attack scenarios covered
   - 80%+ code coverage

3. **Vulnerability Report** (Required)
   - `VULNERABILITIES.md` listing all issues found
   - OWASP category for each
   - Severity rating (Critical/High/Medium/Low)
   - Proof of concept for each vulnerability

4. **Fix Documentation** (Required)
   - `FIXES.md` explaining each fix
   - Before/after code snippets
   - Why the fix works
   - Alternative approaches considered

5. **Copilot Usage Report** (Required)
   - `COPILOT_USAGE.md` documenting:
   - Which prompts you used
   - What Copilot generated correctly
   - What you had to fix manually
   - Lessons learned about AI-assisted security coding

---

## Getting Started

### Prerequisites Check

Before starting, ensure you have:
- [ ] Completed all workflow stages (0-5)
- [ ] Strong understanding of OWASP Top 10
- [ ] Familiarity with Angular security features
- [ ] GitHub Copilot enabled and configured
- [ ] Security testing tools installed

### Setup

```bash
cd homework

# Choose a challenge
cd challenge-01-advanced-xss

# Read the challenge README
cat README.md

# Start the vulnerable application
npm install
npm start

# Run security tests (should fail initially)
npm run test:security
```

---

## Security Testing Tools

Install these tools for testing:

```bash
# OWASP ZAP for dynamic testing
brew install --cask owasp-zap

# Burp Suite Community Edition
brew install --cask burp-suite

# npm audit for dependencies
npm audit

# Snyk for vulnerability scanning
npm install -g snyk

# OWASP Dependency Check
brew install dependency-check
```

---

## Grading Details

### Vulnerability Identification (4 pts per challenge)
- **4 pts**: All vulnerabilities identified with PoC
- **3 pts**: Most vulnerabilities found, minor issues missed
- **2 pts**: Some vulnerabilities found, significant gaps
- **1 pt**: Few vulnerabilities identified
- **0 pts**: No systematic vulnerability analysis

### Fix Implementation (8 pts per challenge)
- **8 pts**: All vulnerabilities properly fixed, no new issues introduced
- **6 pts**: Most fixed correctly, minor security gaps remain
- **4 pts**: Partial fixes, some vulnerabilities still exploitable
- **2 pts**: Attempted fixes but ineffective
- **0 pts**: No meaningful fixes implemented

### Security Tests (4 pts per challenge)
- **4 pts**: Comprehensive tests proving all fixes work
- **3 pts**: Good test coverage, minor gaps
- **2 pts**: Basic tests, missing critical scenarios
- **1 pt**: Minimal testing
- **0 pts**: No security tests

### Documentation (2 pts per challenge)
- **2 pts**: Clear, thorough documentation of vulnerabilities and fixes
- **1 pt**: Basic documentation, missing key details
- **0 pts**: No documentation

### Code Quality (2 pts per challenge)
- **2 pts**: Clean, maintainable, follows best practices
- **1 pt**: Working but messy code
- **0 pts**: Poor quality, hard to understand

### Bonus Points (up to 5 pts per challenge)
- **+5 pts**: Exceptional work (defense in depth, novel solutions)
- **+3 pts**: Above and beyond (extra security measures)
- **+1 pt**: Good effort (attempted advanced techniques)

---

## Bonus Opportunities

Earn extra points by implementing:

### Challenge 1 Bonus:
- Implement Trusted Types API
- Add CSP violation reporting endpoint
- Implement DOMPurify with custom hooks
- Create automated CSP testing

### Challenge 2 Bonus:
- Implement device fingerprinting
- Add anomaly detection for suspicious logins
- Implement JWT key rotation
- Add hardware security key support (WebAuthn)

### Challenge 3 Bonus:
- Implement distributed locking for race conditions
- Add transaction replay detection
- Implement saga pattern for complex transactions
- Create formal proof of idempotency

### Challenge 4 Bonus:
- Implement SRI for all external resources
- Create automated vulnerability scanning pipeline
- Implement license compliance checking
- Add supply chain attack detection

### Challenge 5 Bonus:
- Implement constant-time string comparison
- Add cache poisoning defense
- Implement adaptive rate limiting
- Create performance regression tests with security checks

---

## Time Management

### Recommended Schedule:

**Week 1:**
- Challenge 1 (2-3 hours)
- Challenge 4 (1-2 hours)

**Week 2:**
- Challenge 2 (3-4 hours)
- Challenge 5 (2-3 hours)

**Week 3:**
- Challenge 3 (2-3 hours)
- Polish, testing, documentation (2-3 hours)

**Total:** 12-18 hours over 3 weeks

---

## Collaboration Policy

### Allowed:
- Discussing general approaches
- Sharing resources and articles
- Using GitHub Copilot
- Consulting documentation
- Asking instructor for clarification

### Not Allowed:
- Sharing code solutions
- Copying from other students
- Using pre-existing solutions found online
- Having someone else complete the work

**Remember:** The goal is learning. Using Copilot is encouraged, but you must understand and verify all generated code.

---

## Recommended Resources

### Books:
- "Web Application Security" by Andrew Hoffman
- "The Tangled Web" by Michal Zalewski
- "Security Engineering" by Ross Anderson

### Online Resources:
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [Angular Security Guide](https://angular.io/guide/security)

### Tools Documentation:
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [JWT.io Debugger](https://jwt.io/)
- [OWASP ZAP User Guide](https://www.zaproxy.org/docs/)

---

## Tips for Success

1. **Read the Entire Challenge First**
   - Understand the context
   - Identify all components
   - Plan your approach

2. **Use Copilot Strategically**
   - Start with specific prompts referencing team instructions
   - Verify all generated code for security issues
   - Don't blindly trust AI suggestions

3. **Test Continuously**
   - Write tests as you find vulnerabilities
   - Use automated security scanners
   - Manually test attack scenarios

4. **Document as You Go**
   - Keep notes on vulnerabilities found
   - Document your thought process
   - Explain why fixes work

5. **Think Like an Attacker**
   - Try to exploit your own fixes
   - Consider edge cases
   - Look for bypass techniques

---

## FAQ

### Q: Can I use libraries like DOMPurify?
**A:** Yes, but you must understand how they work and configure them properly.

### Q: How detailed should the vulnerability reports be?
**A:** Include: description, impact, proof of concept, OWASP category, and severity.

### Q: What if I can't fix a vulnerability?
**A:** Document what you tried and why it didn't work. Partial credit is available.

### Q: Can I refactor the code structure?
**A:** Yes, as long as all vulnerabilities are addressed and functionality is preserved.

### Q: How much should I rely on Copilot?
**A:** Use it extensively, but always review and test generated code. Document your usage.

---

## Submission Checklist

Before submitting, verify:

- [ ] All challenge directories contain fixed code
- [ ] Each challenge has VULNERABILITIES.md
- [ ] Each challenge has FIXES.md
- [ ] Each challenge has COPILOT_USAGE.md
- [ ] Security tests written and passing (80%+ coverage)
- [ ] ESLint security checks passing
- [ ] npm audit shows no high/critical issues
- [ ] Code is well-commented
- [ ] All functionality works as intended
- [ ] No new vulnerabilities introduced

---

## Questions?

- Check the FAQ section first
- Review SECURITY.md for reporting guidelines
- Ask in discussion forums (without sharing solutions)
- Contact instructor for clarification

---

**Good luck! These challenges will significantly enhance your security expertise.** 

Remember: The goal isn't just to complete the challenges, but to develop a security mindset that will serve you throughout your career.

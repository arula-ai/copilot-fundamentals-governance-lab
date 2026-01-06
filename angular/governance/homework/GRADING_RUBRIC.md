# Advanced Security Homework - Grading Rubric

**Total Points:** 100 (+ 25 bonus)  
**Pass Threshold:** 70 points

---

## Overall Grade Distribution

| Grade | Points | Description |
|-------|--------|-------------|
| A+ | 95-125 | Exceptional (with bonus) |
| A | 90-94 | Outstanding |
| A- | 85-89 | Excellent |
| B+ | 80-84 | Very Good |
| B | 75-79 | Good |
| B- | 70-74 | Satisfactory |
| C+ | 65-69 | Below Expectations |
| C | 60-64 | Needs Improvement |
| F | <60 | Unsatisfactory |

---

## Challenge-by-Challenge Rubric

### Challenge 1: Advanced XSS & CSP (20 pts + 5 bonus)

#### Vulnerability Identification (4 pts)
| Points | Criteria |
|--------|----------|
| 4 | All 10+ vulnerabilities found with accurate PoCs and impact analysis |
| 3 | 7-9 vulnerabilities found, minor gaps in analysis |
| 2 | 5-6 vulnerabilities found, significant gaps |
| 1 | 3-4 vulnerabilities found, incomplete analysis |
| 0 | < 3 vulnerabilities or no systematic approach |

#### Fix Implementation (8 pts)
| Points | Criteria |
|--------|----------|
| 8 | All XSS vectors blocked, CSP properly configured, Trusted Types working |
| 6-7 | Most vectors blocked, minor CSP issues, good sanitization |
| 4-5 | Partial fixes, some vectors still exploitable |
| 2-3 | Attempted fixes but major vulnerabilities remain |
| 0-1 | Minimal or incorrect fixes |

#### Security Tests (4 pts)
| Points | Criteria |
|--------|----------|
| 4 | Comprehensive tests for all attack vectors, 80%+ coverage |
| 3 | Good test coverage, minor gaps (70-79%) |
| 2 | Basic tests, missing critical scenarios (60-69%) |
| 1 | Minimal testing (< 60%) |
| 0 | No meaningful security tests |

#### Documentation (2 pts)
| Points | Criteria |
|--------|----------|
| 2 | Clear, thorough VULNERABILITIES.md and FIXES.md |
| 1 | Basic documentation, missing details |
| 0 | No documentation |

#### Code Quality (2 pts)
| Points | Criteria |
|--------|----------|
| 2 | Clean, well-structured, follows best practices |
| 1 | Working but could be cleaner |
| 0 | Poor quality, hard to maintain |

#### Bonus (up to 5 pts)
- Trusted Types API: 2 pts
- CSP Violation Reporting: 1 pt
- Advanced DOMPurify Config: 1 pt
- Automated CSP Testing: 1 pt

---

### Challenge 2: JWT Security (20 pts + 5 bonus)

#### Vulnerability Identification (4 pts)
| Points | Criteria |
|--------|----------|
| 4 | All 15+ JWT vulnerabilities found with exploitation examples |
| 3 | 10-14 vulnerabilities found |
| 2 | 7-9 vulnerabilities found |
| 1 | 4-6 vulnerabilities found |
| 0 | < 4 vulnerabilities |

#### Fix Implementation (8 pts)
| Points | Criteria |
|--------|----------|
| 8 | httpOnly cookies, proper validation, token rotation, all attacks prevented |
| 6-7 | Good security, minor issues remain |
| 4-5 | Partial fixes, some attacks still possible |
| 2-3 | Attempted fixes but significant vulnerabilities |
| 0-1 | Minimal fixes |

#### Security Tests (4 pts)
| Points | Criteria |
|--------|----------|
| 4 | Tests cover algorithm confusion, token theft, replay, expiration, rotation |
| 3 | Good coverage, minor gaps |
| 2 | Basic tests, missing critical scenarios |
| 1 | Minimal testing |
| 0 | No security tests |

#### Documentation (2 pts)
As above

#### Code Quality (2 pts)
As above

#### Bonus (up to 5 pts)
- Device Fingerprinting: 2 pts
- Anomaly Detection: 1 pt
- Key Rotation: 1 pt
- WebAuthn Support: 1 pt

---

### Challenge 3: CSRF & Race Conditions (20 pts + 5 bonus)

#### Vulnerability Identification (4 pts)
| Points | Criteria |
|--------|----------|
| 4 | All CSRF, race conditions, and TOCTOU bugs found |
| 3 | Most critical issues found |
| 2 | Some issues found, major gaps |
| 1 | Few issues identified |
| 0 | No systematic analysis |

#### Fix Implementation (8 pts)
| Points | Criteria |
|--------|----------|
| 8 | CSRF tokens working, race conditions eliminated, atomic transactions |
| 6-7 | Good fixes, minor concurrency issues |
| 4-5 | Partial fixes, some races still possible |
| 2-3 | Attempted fixes but exploitable |
| 0-1 | Minimal fixes |

#### Security Tests (4 pts)
| Points | Criteria |
|--------|----------|
| 4 | Tests prove double-spending prevented, CSRF blocked, idempotency works |
| 3 | Good tests, minor gaps |
| 2 | Basic tests |
| 1 | Minimal tests |
| 0 | No tests |

#### Documentation (2 pts)
As above

#### Code Quality (2 pts)
As above

#### Bonus (up to 5 pts)
- Distributed Locking: 2 pts
- Saga Pattern: 2 pts
- Formal Proof: 1 pt

---

### Challenge 4: Supply Chain Security (20 pts + 5 bonus)

#### Vulnerability Identification (4 pts)
| Points | Criteria |
|--------|----------|
| 4 | Comprehensive audit with CVEs, transitive deps, licenses |
| 3 | Good audit, minor gaps |
| 2 | Basic audit, missing issues |
| 1 | Incomplete audit |
| 0 | No systematic audit |

#### Fix Implementation (8 pts)
| Points | Criteria |
|--------|----------|
| 8 | All packages updated, SRI implemented, scanning automated |
| 6-7 | Most fixed, minor issues |
| 4-5 | Partial updates |
| 2-3 | Attempted but incomplete |
| 0-1 | Minimal fixes |

#### Security Tests (4 pts)
| Points | Criteria |
|--------|----------|
| 4 | Automated scanning, SRI verification, lockfile validation |
| 3 | Good automation |
| 2 | Basic checks |
| 1 | Minimal verification |
| 0 | No automation |

#### Documentation (2 pts)
Comprehensive AUDIT_REPORT.md required

#### Code Quality (2 pts)
As above

#### Bonus (up to 5 pts)
- Automated Pipeline: 2 pts
- License Compliance: 1 pt
- SBOM Generation: 1 pt
- SLSA Framework: 1 pt

---

### Challenge 5: Performance vs Security (20 pts + 5 bonus)

#### Vulnerability Identification (4 pts)
| Points | Criteria |
|--------|----------|
| 4 | All timing attacks, cache issues, crypto weaknesses found |
| 3 | Most critical issues found |
| 2 | Some issues found |
| 1 | Few issues found |
| 0 | Incomplete analysis |

#### Fix Implementation (8 pts)
| Points | Criteria |
|--------|----------|
| 8 | Constant-time ops, secure caching, proper crypto, rate limiting |
| 6-7 | Good fixes, minor issues |
| 4-5 | Partial fixes |
| 2-3 | Attempted but issues remain |
| 0-1 | Minimal fixes |

#### Security Tests (4 pts)
| Points | Criteria |
|--------|----------|
| 4 | Timing attack tests, cache isolation tests, crypto validation |
| 3 | Good coverage |
| 2 | Basic tests |
| 1 | Minimal tests |
| 0 | No tests |

#### Documentation (2 pts)
As above

#### Code Quality (2 pts)
As above

#### Bonus (up to 5 pts)
- Constant-Time Comparison: 2 pts
- Cache Poisoning Defense: 1 pt
- Adaptive Rate Limiting: 1 pt
- Performance Regression Tests: 1 pt

---

## Required Deliverables Per Challenge

### Files Required (will lose 2 pts per missing file):
- [ ] Fixed vulnerable code (all vulnerabilities addressed)
- [ ] `VULNERABILITIES.md` (comprehensive list with details)
- [ ] `FIXES.md` (explanations of all fixes)
- [ ] `COPILOT_USAGE.md` (AI usage documentation)
- [ ] Security tests (*.spec.ts files)
- [ ] All tests passing (npm test)

---

## Copilot Usage Evaluation

Evaluated across all challenges:

### Excellent Copilot Usage (5 bonus pts):
- Specific, security-focused prompts
- References team instructions
- Critical review of all suggestions
- Documents what was fixed manually
- Shows understanding of generated code

### Good Copilot Usage (3 bonus pts):
- Used Copilot effectively
- Reviewed most suggestions
- Some manual fixes documented

### Basic Copilot Usage (1 bonus pt):
- Used Copilot minimally
- Limited documentation

### Poor Copilot Usage (0 pts):
- Blindly accepted suggestions
- No verification
- Introduced new vulnerabilities

---

## Common Deductions

### Major Deductions (-5 pts each):
- Introduced new security vulnerabilities while fixing others
- Critical vulnerability not fixed
- Tests don't actually verify security
- Plagiarized solutions
- Code doesn't run

### Medium Deductions (-3 pts each):
- Major functionality broken
- Poor code quality throughout
- Missing critical test cases
- Inadequate documentation

### Minor Deductions (-1 pt each):
- ESLint errors
- Missing comments on complex fixes
- Inconsistent code style
- Minor test gaps

---

## Excellence Indicators (Bonus Points)

### Above and Beyond (up to 10 extra pts):
- Novel defense techniques
- Exceptional documentation with diagrams
- Created reusable security utilities
- Implemented defense-in-depth
- Added security monitoring/alerting
- Performance optimizations without security loss
- Contributed to team instructions

---

## Grading Process

### Step 1: Automated Checks (30 pts possible)
```bash
npm install
npm run lint           # Must pass
npm run test:security  # Must have 80%+ coverage
npm audit              # No high/critical issues
```

### Step 2: Manual Review (70 pts possible)
1. Review vulnerability identification
2. Test fixes with attack payloads
3. Review code quality
4. Evaluate documentation
5. Check Copilot usage

### Step 3: Bonus Evaluation (25 pts possible)
- Check for advanced techniques
- Evaluate extra features
- Consider creativity

---

## Grade Calculation Example

**Student A:**
- Challenge 1: 18/20 (missed 2 XSS vectors)
- Challenge 2: 19/20 + 3 bonus (device fingerprinting)
- Challenge 3: 17/20 (race condition partially fixed)
- Challenge 4: 20/20 + 5 bonus (all bonuses)
- Challenge 5: 18/20 + 2 bonus (const-time comp)
- Copilot Usage: +3 bonus
- **Total: 92 + 13 bonus = 105/125 = A+**

**Student B:**
- Challenge 1: 15/20
- Challenge 2: 16/20
- Challenge 3: 14/20
- Challenge 4: 18/20
- Challenge 5: 15/20
- **Total: 78/100 = B+**

---

## FAQ

### Q: What if I can't fix all vulnerabilities?
**A:** Document what you tried and why it didn't work for partial credit.

### Q: How strict is the 80% test coverage requirement?
**A:** Strict. Less than 80% loses 2 points per challenge.

### Q: Can I refactor the code structure?
**A:** Yes, as long as functionality is preserved and documented.

### Q: What if Copilot generates insecure code?
**A:** Document it in COPILOT_USAGE.md and fix it for full credit.

### Q: How much weight does code quality have?
**A:** 2 pts per challenge (10% of challenge grade). Important but not dominant.

---

## Late Submission Policy

- 1-24 hours late: -5 pts
- 24-48 hours late: -10 pts
- 48-72 hours late: -15 pts
- > 72 hours: Case-by-case basis

---

## Academic Integrity

### Allowed:
- Consulting documentation
- Using Copilot with understanding
- Discussing approaches (not code)
- Using libraries like DOMPurify

### Not Allowed:
- Copying solutions from classmates
- Sharing code
- Using pre-existing solutions from internet
- Having someone else do the work

**Penalty for academic dishonesty: 0 pts + referral to academic affairs**

---

**This rubric ensures fair, consistent, and comprehensive evaluation of security knowledge.** 

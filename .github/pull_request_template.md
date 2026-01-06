## PR Type
- [ ] Bug fix
- [ ] Feature
- [ ] Security patch
- [ ] Performance improvement
- [ ] Documentation

## Affected Project(s)
- [ ] Angular Foundations
- [ ] Angular Governance
- [ ] Java Foundations
- [ ] Java Governance

## Copilot Usage Declaration
- [ ] Copilot was used in this PR
- [ ] Generated code percentage: ____%
- [ ] All suggestions were reviewed for correctness
- [ ] Team instructions were followed

---

## Angular Quality Checklist (if applicable)
- [ ] Unit tests written/updated (coverage: ___%)
- [ ] Component tests passing
- [ ] E2E tests updated (if applicable)
- [ ] ESLint passing (no warnings)
- [ ] Documentation updated
- [ ] No console.log statements

### Angular Security Review
- [ ] Input sanitization implemented
- [ ] No XSS vulnerabilities
- [ ] Authentication/authorization verified
- [ ] No sensitive data in localStorage
- [ ] CORS properly configured
- [ ] Content Security Policy considered

### Angular Performance
- [ ] Bundle size impact checked
- [ ] Change detection optimized
- [ ] Memory leaks prevented (unsubscribe)
- [ ] Lazy loading implemented where appropriate
- [ ] Images optimized

### Angular Copilot-Specific Checks
- [ ] No hardcoded secrets
- [ ] Business logic manually verified
- [ ] Generated code follows Angular patterns
- [ ] RxJS operators used correctly
- [ ] Type safety maintained

---

## Java Quality Checklist (if applicable)
- [ ] Unit tests written/updated (JUnit/MockMvc) — coverage: ___%
- [ ] Integration tests updated or rationale documented
- [ ] Jacoco coverage ≥ 60% or exception noted
- [ ] `mvn clean verify` passing
- [ ] Documentation updated
- [ ] No `System.out.println`/`printStackTrace` debugging left behind

### Java Security Review
- [ ] Input sanitization implemented
- [ ] Output encoding prevents XSS in templates/responses
- [ ] Authentication/authorization paths verified (if applicable)
- [ ] File/path handling hardened (no traversal or unsafe writes)
- [ ] Dependencies reviewed (`mvn dependency:tree`)
- [ ] Secrets and credentials kept out of code/config

### Java Performance
- [ ] No unbounded loops or excessive allocations introduced
- [ ] Blocking IO handled responsibly (streams closed, timeouts set)
- [ ] Database/remote calls minimized or batched (if applicable)
- [ ] Caching/connection pooling considered or documented
- [ ] Logging remains at appropriate levels

### Java Copilot-Specific Checks
- [ ] No hardcoded secrets
- [ ] Business logic manually verified
- [ ] Generated code follows Spring Boot & Java conventions (DI, transactions, validation)
- [ ] Logging and exception handling reviewed for sensitive data
- [ ] Data validation/business rules double-checked

---

## Accessibility (if UI changes)
- [ ] ARIA labels added
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast verified

## Testing Evidence
- [ ] All tests passing
- [ ] New tests added for changes
- [ ] Coverage maintained/improved
- [ ] Manual testing completed

# Challenge 4: Supply Chain Security

**Difficulty:** 4/5  
**Estimated Time:** 1-2 hours  
**Points:** 20 (+ 5 bonus)

---

## Scenario

Audit the application's dependencies and secure the supply chain. The project uses multiple npm packages with known vulnerabilities and lacks security controls.

**Security Requirements:**
- Identify and fix vulnerable dependencies
- Implement dependency scanning
- Add Subresource Integrity (SRI)
- Prevent dependency confusion attacks
- Establish secure update process

---

## Vulnerable package.json

```json
{
  "dependencies": {
    "lodash": "4.17.15",          // CVE-2020-8203 (prototype pollution)
    "angular": "16.0.0",           // Outdated
    "moment": "2.29.1",            // Known security issues
    "jquery": "3.4.1",             // Multiple XSS vulnerabilities
    "express": "4.16.0",           // CVE-2019-5413
    "jsonwebtoken": "8.5.1",      // CVE-2022-23529
    "axios": "0.21.1"              // CVE-2021-3749
  },
  "devDependencies": {
    "webpack": "4.44.0",           // Outdated
    "node-sass": "4.14.1"          // Deprecated, security issues
  }
}
```

---

## Attack Scenarios

### Attack 1: Prototype Pollution
```javascript
// Exploiting lodash vulnerability
const _ = require('lodash');
_.set({}, '__proto__.polluted', 'true');
console.log({}.polluted); // 'true' - prototype polluted!
```

### Attack 2: Dependency Confusion
```bash
# Attacker publishes malicious package with internal name
npm publish @internal/auth-lib  // Attacker's malicious version
# npm installs attacker's package instead of internal one
```

### Attack 3: CDN Compromise
```html
<!-- No SRI - CDN compromise can inject malicious code -->
<script src="https://cdn.example.com/library.js"></script>
```

---

## Your Tasks

### Task 1: Dependency Audit (4 pts)

Create `AUDIT_REPORT.md` with:
1. All vulnerable packages identified
2. CVE numbers and severity ratings
3. Attack vectors for each vulnerability
4. Transitive dependency issues
5. License compliance check

### Task 2: Remediation (8 pts)

1. **Update Dependencies**
   - Update all packages to latest secure versions
   - Remove unnecessary dependencies
   - Replace deprecated packages
   - Document breaking changes

2. **Implement Scanning**
   ```bash
   # Add to package.json scripts
   "audit": "npm audit --audit-level=moderate",
   "audit:fix": "npm audit fix",
   "snyk": "snyk test",
   "outdated": "npm outdated"
   ```

3. **Add SRI for CDN Resources**
   ```html
   <script 
     src="https://cdn.example.com/library.js"
     integrity="sha384-hash"
     crossorigin="anonymous"
   ></script>
   ```

4. **Prevent Dependency Confusion**
   - Configure `.npmrc` with registry scopes
   - Use package-lock.json
   - Implement private registry

5. **CI/CD Integration**
   ```yaml
   # Add to GitHub Actions
   - name: Run security audit
     run: npm audit --audit-level=high
   - name: Snyk security scan
     run: npx snyk test
   ```

### Task 3: Security Tests (4 pts)
```typescript
it('should have no high/critical vulnerabilities');
it('should have SRI for all CDN resources');
it('should use scoped package names');
it('should have package-lock.json committed');
```

---

## Bonus (5 pts)

1. **Automated Scanning Pipeline (2 pts)**
   - Dependabot configuration
   - Automated PR creation for updates

2. **License Compliance (1 pt)**
   - Scan for incompatible licenses
   - Generate license report

3. **SBOM Generation (1 pt)**
   - Software Bill of Materials
   - CycloneDX format

4. **Supply Chain Levels (1 pt)**
   - SLSA framework implementation
   - Provenance verification

---

## Checklist

- [ ] No packages with known high/critical CVEs
- [ ] All dependencies up to date (or documented exceptions)
- [ ] SRI implemented for CDN resources
- [ ] .npmrc configured with scoped registries
- [ ] Automated security scanning in CI/CD
- [ ] License compliance verified
- [ ] Lockfile committed and up to date
- [ ] Deprecated packages replaced

---

## Testing

```bash
# Run audits
npm audit
snyk test
npm outdated

# Check SRI
grep -r "integrity=" src/

# Verify lockfile
git diff package-lock.json
```

---

## Resources

- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)
- [Snyk Vulnerability Database](https://snyk.io/vuln)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [SRI Hash Generator](https://www.srihash.org/)

**Supply chain security is critical - don't skip this!** 

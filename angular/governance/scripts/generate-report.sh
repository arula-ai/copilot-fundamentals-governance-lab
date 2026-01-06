#!/bin/bash

REPORT_FILE="governance-report.md"

echo "Generating Governance Compliance Report..."
echo ""

cat > $REPORT_FILE << 'EOF'
# Copilot Governance Compliance Report

**Generated:** $(date)

## Summary

This report provides an overview of the governance compliance for the Angular project.

## Code Quality Metrics

### ESLint Analysis
EOF

echo "" >> $REPORT_FILE
echo "Running ESLint..." >> $REPORT_FILE
npm run lint >> $REPORT_FILE 2>&1
echo "" >> $REPORT_FILE

cat >> $REPORT_FILE << 'EOF'

### Security Analysis
EOF

echo "Running Security ESLint..." >> $REPORT_FILE
npm run lint:security >> $REPORT_FILE 2>&1
echo "" >> $REPORT_FILE

cat >> $REPORT_FILE << 'EOF'

### Dependency Vulnerabilities
EOF

echo "Running npm audit..." >> $REPORT_FILE
npm audit >> $REPORT_FILE 2>&1
echo "" >> $REPORT_FILE

cat >> $REPORT_FILE << 'EOF'

### Test Coverage
EOF

echo "Running tests with coverage..." >> $REPORT_FILE
npm run test:coverage >> $REPORT_FILE 2>&1
echo "" >> $REPORT_FILE

cat >> $REPORT_FILE << 'EOF'

## Governance Checklist

### Team Instructions
- [x] `.github/instructions/angular.instructions.md` exists
- [ ] Team has reviewed and customized instructions
- [ ] Instructions cover security requirements
- [ ] Instructions cover testing requirements

### Pull Request Template
- [x] `.github/pull_request_template.md` exists
- [ ] Template includes Copilot usage declaration
- [ ] Template includes security checklist
- [ ] Template includes testing requirements

### Automated Checks
- [x] Security scan workflow configured
- [x] Quality gates workflow configured
- [ ] All workflows are enabled
- [ ] Coverage thresholds configured (80%)

### Workflow Status
- [x] Baseline vulnerable components available
- [ ] Vulnerabilities remediated
- [ ] Security tests implemented
- [ ] Secure features delivered
- [ ] Quality gates passing

## Recommendations

1. Review and customize `.github/instructions/angular.instructions.md` for your team
2. Enable GitHub Actions workflows
3. Complete every stage of the workflow
4. Achieve 80%+ test coverage
5. Fix all high-severity npm audit issues
6. Address all ESLint security warnings

## Next Steps

- [ ] Stage 0: Review team instructions
- [ ] Stage 1: Assess vulnerabilities
- [ ] Stage 2: Remediate with Copilot
- [ ] Stage 3: Generate security tests
- [ ] Stage 4: Implement secure features
- [ ] Stage 5: Complete governance review and PR checklist

---

*This report was generated automatically. Please review and update manually as needed.*
EOF

echo "Report generated: $REPORT_FILE"
echo ""
echo "View the report:"
cat $REPORT_FILE

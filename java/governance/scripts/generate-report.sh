#!/bin/bash

REPORT_FILE="governance-report.md"

echo "Generating Governance Compliance Report..."
echo ""

cat > "$REPORT_FILE" <<'REPORT'
# Copilot Governance Compliance Report

**Generated:** $(date)

## Summary

This report provides an overview of the governance compliance for the Java Spring Boot project.

## Build & Test Metrics
REPORT

echo "" >> "$REPORT_FILE"
echo "Running mvn test..." >> "$REPORT_FILE"
mvn -B test >> "$REPORT_FILE" 2>&1

echo "" >> "$REPORT_FILE"
echo "Running mvn verify..." >> "$REPORT_FILE"
mvn -B verify >> "$REPORT_FILE" 2>&1

echo "" >> "$REPORT_FILE"
echo "Running mvn dependency:tree..." >> "$REPORT_FILE"
mvn -B dependency:tree >> "$REPORT_FILE" 2>&1

echo "" >> "$REPORT_FILE"
if [ -f target/site/jacoco/jacoco.csv ]; then
  COVERAGE=$(awk -F',' 'NR>1 { covered+=$8; total+=$9 } END { if (total==0) print 0; else printf "%.2f", (covered/total)*100 }' target/site/jacoco/jacoco.csv)
else
  COVERAGE="0"
fi

cat >> "$REPORT_FILE" <<REPORT

## Coverage Summary
- Instruction coverage: ${COVERAGE}%
- Jacoco report: target/site/jacoco/index.html

## Governance Checklist

### Team Instructions
- [x] ".github/instructions/java.instructions.md" exists
- [ ] Team has reviewed and customized instructions
- [ ] Instructions cover security requirements
- [ ] Instructions cover testing requirements

### Pull Request Template
- [x] ".github/pull_request_template.md" exists
- [ ] Template includes Copilot usage declaration
- [ ] Template includes security checklist
- [ ] Template includes testing requirements

### Automated Checks
- [x] Security scan workflow configured
- [x] Quality gates workflow configured
- [ ] All workflows are enabled
- [ ] Coverage thresholds configured (60%)

### Workflow Status
- [x] Baseline vulnerable components available
- [ ] Vulnerabilities remediated
- [ ] Security tests implemented
- [ ] Secure features delivered
- [ ] Quality gates passing

## Recommendations

1. Review and customize `.github/instructions/java.instructions.md` for your team
2. Enable GitHub Actions workflows
3. Complete every stage of the workflow
4. Increase Jacoco coverage to at least 60%
5. Address Maven dependency warnings
6. Capture evidence of Copilot-assisted changes

## Next Steps

- [ ] Stage 0: Review team instructions
- [ ] Stage 1: Assess vulnerabilities
- [ ] Stage 2: Remediate with Copilot
- [ ] Stage 3: Generate security tests
- [ ] Stage 4: Implement secure features
- [ ] Stage 5: Complete governance review and PR checklist

---

*This report was generated automatically. Please review and update manually as needed.*
REPORT

echo "Report generated: $REPORT_FILE"
echo ""
echo "View the report:"
cat "$REPORT_FILE"

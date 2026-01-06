# Arula.AI - GitHub Copilot Fundamentals & Governance Lab

A comprehensive hands-on lab for mastering GitHub Copilot in enterprise development workflows. This consolidated repository provides two learning tracks across two technology stacks, enabling teams to practice AI-assisted development with proper governance, security awareness, and audit trails.

## Copyright & License

Copyright 2025 Arula.AI (InRhythm Arula Labs). All Rights Reserved.

This repository and its contents are proprietary and confidential. Unauthorized copying, distribution, modification, or use is strictly prohibited. See [LICENSE](LICENSE) for full terms.

## Warning

This repository contains **intentionally vulnerable and problematic code** for training purposes.
**DO NOT use this code in production.**

## Lab Structure

```
copilot-fundamentals-governance-lab/
├── angular/
│   ├── foundations/     # Copilot Foundations: Refactoring with Confidence
│   └── governance/      # Copilot Governance: Security & Compliance
├── java/
│   ├── foundations/     # Copilot Foundations: Refactoring with Confidence
│   └── governance/      # Copilot Governance: Security & Compliance
└── .github/
    ├── agents/          # Language-specific Copilot agents
    ├── instructions/    # Language-specific coding standards
    ├── workflows/       # CI/CD pipelines
    └── prompts/         # Reusable prompt templates
```

## Choose Your Path

| Track | Focus | Duration | Difficulty |
|-------|-------|----------|------------|
| **Foundations** | Comprehend, Refactor, Test legacy code | 40 min | Beginner-Intermediate |
| **Governance** | Security remediation, compliance, audit trails | 2-3 hours | Intermediate-Advanced |

| Technology | Prerequisites |
|------------|---------------|
| **Angular** | Node.js 18+, Angular CLI 16+, npm |
| **Java** | JDK 17+, Maven 3.9+, Bash shell |

## Quick Start

### Angular Track

```bash
# Clone the repository
git clone https://github.com/arula-ai/copilot-fundamentals-governance-lab.git
cd copilot-fundamentals-governance-lab

# For Foundations Lab
cd angular/foundations
npm install
npm start

# For Governance Lab
cd angular/governance
./scripts/setup-lab.sh
npm start
```

### Java Track

```bash
# Clone the repository
git clone https://github.com/arula-ai/copilot-fundamentals-governance-lab.git
cd copilot-fundamentals-governance-lab

# For Foundations Lab
cd java/foundations
mvn clean install
mvn spring-boot:run

# For Governance Lab
cd java/governance
./scripts/setup-lab.sh
mvn spring-boot:run
```

## Lab Tracks Overview

### Foundations Lab (Both Languages)

**Goal**: Learn to use Copilot for everyday development workflows.

**What You'll Practice**:
- Using Copilot to understand legacy code
- Identifying anti-patterns and code smells
- Generating comprehensive test suites
- Planning and executing safe refactors
- Documenting changes effectively

**Baseline Metrics**:
- Test Coverage: ~25%
- Code Smells: 75+
- Memory Leaks: 5+ locations
- ESLint/Checkstyle Warnings: 300+

**Target Metrics**:
- Test Coverage: 45%+
- Code Smells: <40
- Memory Leaks: 0
- Warnings: <50

### Governance Lab (Both Languages)

**Goal**: Master AI-assisted development with enterprise governance requirements.

**What You'll Practice**:
- Vulnerability assessment and OWASP mapping
- Security remediation with audit trails
- Test generation for security scenarios
- Implementing proactive security controls
- Quality gate compliance and reporting

**Governance Stages**:
1. **Stage 0** – Environment Setup & Alignment
2. **Stage 1** – Baseline Assessment
3. **Stage 2** – Remediation with Copilot
4. **Stage 3** – Security Test Generation
5. **Stage 4** – Secure Feature Implementation
6. **Stage 5** – Governance Validation & Reporting
7. **Stage 6+** – Homework & Submission

## Copilot Agents

This lab includes custom Copilot agents optimized for each language. Select agents from the **Agent dropdown** in VS Code Copilot Chat.

### Angular Agents (`.github/agents/angular-*.agent.md`)

| Agent | Purpose |
|-------|---------|
| `angular-planning` | Build strategies, write plans, log assumptions |
| `angular-testing` | Execute lint/test suites, log coverage results |
| `angular-validation` | Verify guardrails compliance, pass/fail audits |
| `angular-need-review` | Final review, capture approvals and findings |
| `angular-scrum-master` | Break work into tasks with acceptance criteria |
| `angular-summarizer` | Generate hand-off summaries for workflow tracker |

### Java Agents (`.github/agents/java-*.agent.md`)

| Agent | Purpose |
|-------|---------|
| `java-planning` | Build strategies, write plans, log assumptions |
| `java-testing` | Execute Maven commands, log coverage results |
| `java-validation` | Verify guardrails compliance, pass/fail audits |
| `java-need-review` | Final review, capture approvals and findings |
| `java-scrum-master` | Break work into tasks with acceptance criteria |
| `java-summarizer` | Generate hand-off summaries for workflow tracker |

## Coding Standards

Language-specific instructions are automatically applied based on file type:

- **Angular**: `.github/instructions/angular.instructions.md` (applies to `*.ts`, `*.html`, `*.scss`)
- **Java**: `.github/instructions/java.instructions.md` (applies to `*.java`, `*.properties`, `*.xml`)

## Common Commands

### Angular

```bash
npm start                  # Start dev server
npm test                   # Run tests
npm run test:coverage      # Run tests with coverage
npm run lint               # ESLint check
npm run lint:security      # Security-focused lint
npm audit                  # Check dependencies
./scripts/run-all-checks.sh    # All quality gates
./scripts/generate-report.sh   # Generate governance report
```

### Java

```bash
mvn spring-boot:run        # Start application
mvn test                   # Run tests
mvn verify                 # Full verification + Jacoco
mvn dependency:tree        # Dependency analysis
./scripts/run-all-checks.sh    # All quality gates
./scripts/generate-report.sh   # Generate governance report
```

## Documentation Structure

Each governance lab includes:

```
docs/
├── workflow-tracker.md      # Session logs and decisions
├── workflow-guide.md        # Stage-by-stage instructions
├── vulnerability-guide.md   # Security issues to address
├── testing-guide.md         # Test generation playbook
├── secure-features-guide.md # Proactive security controls
├── test-coverage.md         # Coverage metrics and results
└── plans/                   # Stage-specific plans
```

## Success Metrics

### Foundations Lab
- [ ] Memory leaks eliminated
- [ ] Test coverage improved to 45%+
- [ ] Modern patterns applied (RxJS/Spring best practices)
- [ ] Type safety improved
- [ ] Code smells reduced by 50%

### Governance Lab
- [ ] Vulnerabilities documented in `VULNERABILITIES.md`
- [ ] Remediations tracked in `FIXES.md`
- [ ] Copilot usage logged in `COPILOT_USAGE.md`
- [ ] Coverage ≥80% (or documented exception)
- [ ] All quality gates passing
- [ ] Governance report generated
- [ ] PR template completed with evidence

## Detailed Lab Guides

| Lab | Guide |
|-----|-------|
| Angular Foundations | [angular/foundations/README.md](angular/foundations/README.md) |
| Angular Governance | [angular/governance/README.md](angular/governance/README.md) |
| Java Foundations | [java/foundations/README.md](java/foundations/README.md) |
| Java Governance | [java/governance/README.md](java/governance/README.md) |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Copilot not following instructions | Ensure `.github/instructions/` files are committed |
| Custom agents not appearing | Restart VS Code, check `.github/agents/` exists |
| Angular build fails | Run `npm ci` to clean install dependencies |
| Java build fails | Ensure JDK 17+ and Maven 3.9+ are installed |
| Scripts fail on Windows | Use WSL2 or Git Bash |

## Additional Resources

### Angular
- [Angular Security Guide](https://angular.io/guide/security)
- [OWASP Angular Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Angular_Security_Cheat_Sheet.html)
- [RxJS Best Practices](https://rxjs.dev/guide/operators)

### Java
- [Spring Boot Reference](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Security Guide](https://docs.spring.io/spring-security/reference/index.html)
- [OWASP Java Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Java_Security_Cheat_Sheet.html)

### General
- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

---

**Happy Learning!** Document every assumption, surface evidence for each fix, and keep the audit trail up to date.

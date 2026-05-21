# GitHub Copilot Governance Lab – Spring Boot

This directory contains a Spring Boot 3 project seeded with governance gaps so you can practice directing GitHub Copilot, documenting decisions, and delivering secure fixes end to end. Every stage of the lab focuses on pairing AI-assisted development with auditable evidence: plans, test results, reports, and code reviews.

## Workspace Setup

**Open VS Code at the parent repository root** — `copilot-fundamentals-governance-lab/` — not at `java/governance/`.

This is required so GitHub Copilot can discover the shared `.github/` configuration (agents, instructions, prompts) that lives at the parent level. If your Agent Mode dropdown is empty after opening the workspace, you opened too deep — close VS Code and reopen at the parent root.

## Working Directory (terminal)

All Maven and shell commands should be run from `java/governance` (the VS Code workspace stays at the parent root):

```bash
# From the repository root (the directory you just opened in VS Code):
cd java/governance
```

## Prerequisites
- JDK 17 (Temurin or equivalent)
- Maven 3.9+
- Bash-compatible shell (required for scripts under `scripts/`)
- An IDE with the GitHub Copilot extension installed
- Git command-line tools

## Quick Start
```bash
# One-time setup (validates Java/Maven and runs mvn validate)
./scripts/setup-lab.sh

# Start the application — it will boot successfully on http://localhost:8080.
# Vulnerabilities surface through behaviour (insecure defaults, exposed debug
# endpoints, plaintext credential handling) — NOT through startup failures.
mvn spring-boot:run
```

## Common Commands
```bash
# Compile + unit tests
mvn clean test

# Full verification (runs tests, generates Jacoco)
mvn verify

# Inspect the dependency tree for outdated or risky libraries
mvn dependency:tree

# End-to-end governance gates
./scripts/run-all-checks.sh

# Assemble evidence for reports
./scripts/generate-report.sh
```

## Governance Workflow Overview

Stage numbering here matches `LAB_ACTION_GUIDE.md` and `docs/workflow-guide.md` — same numbers, same labels, end to end.

| Stage | Name | Key References |
| --- | --- | --- |
| 0 | Setup & Governance Alignment | `.github/instructions/java.instructions.md`, `LAB_ACTION_GUIDE.md`, `docs/workflow-tracker.md` |
| 1 | Baseline Assessment | `docs/vulnerability-guide.md`, `docs/plans/plan.md` |
| 2 | Remediation | `docs/vulnerability-guide.md`, `docs/test-coverage.md` |
| 3 | Security Test Generation | `docs/testing-guide.md`, `docs/test-coverage.md` |
| 4 | Secure Feature Implementation | `docs/secure-features-guide.md`, `docs/plans/plan.md` |
| 5 | Governance Validation & Reporting | `./scripts/run-all-checks.sh`, `./scripts/generate-report.sh`, documentation updates |
| 6 | Optional: Homework & Extras | `homework/README.md`, challenge folders |
| 7 | Optional: Prepare Submission | `homework/GRADING_RUBRIC.md`, PR template |

See `LAB_ACTION_GUIDE.md` and `docs/workflow-guide.md` for detailed responsibilities per stage and the expected Copilot agents (e.g., `java-planning`, `java-testing`).

## Lab Architecture

```mermaid
graph TB
    A[Clone Repository] --> B[Run setup-lab.sh]
    B --> C[Stage 0: Align on guardrails]
    C --> D[Stage 1: Assess vulnerabilities]
    D --> E[Stage 2: Remediate with Copilot]
    E --> F[Stage 3: Generate security tests]
    F --> G[Stage 4: Ship secure features]
    G --> H[Stage 5: Validate & report]
    H --> I[Stage 6+: Homework & submission]

    style A fill:#e1f5fe
    style B fill:#fce4ec
    style C fill:#ede7f6
    style D fill:#ede7f6
    style E fill:#ede7f6
    style F fill:#ede7f6
    style G fill:#ede7f6
    style H fill:#c8e6c9
    style I fill:#ffe0b2
```

## Intentional Vulnerabilities
The lab introduces insecure controllers and services (see `docs/vulnerability-guide.md`) covering:
- Plain-text credential handling and session fixation
- Unsanitized file uploads and directory traversal
- SQL injection and template-based XSS
- Verbose logging of sensitive data
- Missing audit trails and dependency hygiene

Stage 1 catalogues the issues; Stage 2 remediates them while maintaining a traceable paper trail.

## Running the Quality Gates

| Goal | Command(s) | Evidence |
| --- | --- | --- |
| Unit/integration tests | `mvn test` | Console output, Jacoco reports under `target/site/jacoco` |
| Full verification + coverage | `mvn verify` | `target/site/jacoco/index.html`, coverage % in `docs/test-coverage.md` |
| Dependency review | `mvn dependency:tree` | Summaries in `docs/workflow-tracker.md` |
| Combined governance checks | `./scripts/run-all-checks.sh` | Command log + captured failures |
| Final report | `./scripts/generate-report.sh` | `governance-report.md` |

Document command executions and outcomes in `docs/test-coverage.md` and `docs/workflow-tracker.md` so downstream reviewers can audit your evidence.

## Project Layout (expected)
```
├── src/
│   ├── main/
│   │   ├── java/com/github/copilot/governancelab/  # Controllers, services, configs (contains intentionally vulnerable code)
│   │   └── resources/                              # application.properties, templates, static assets
│   └── test/
│       └── java/com/github/copilot/governancelab/  # JUnit + Spring Boot tests
├── docs/                                           # Governance plans, workflow logs, coverage notes, stage guides
├── scripts/                                        # Setup and reporting scripts
├── static-analysis/                                # Checklists and policy docs
├── homework/                                       # Stretch exercises and grading rubric
└── .github/                                        # Copilot instructions, agents, workflows, templates
```

## Success Metrics
- Vulnerabilities identified and tracked in `VULNERABILITIES.md`
- Remediations documented in `FIXES.md`
- Copilot usage disclosures logged in `COPILOT_USAGE.md`
- ≥80% Jacoco coverage (or documented exception) recorded in `docs/test-coverage.md`
- All Maven quality gates passing, with results summarized in `docs/workflow-tracker.md`
- Governance evidence attached to the pull request template before submission

## Troubleshooting

| Issue | Resolution |
| --- | --- |
| Java/Maven not detected during setup | Ensure `java -version` reports 17+, `mvn -version` reports 3.9+, then rerun `./scripts/setup-lab.sh`. |
| Agent Mode dropdown empty or `/hand-off` not offered | VS Code workspace is opened too deep. Close and reopen at the parent `copilot-fundamentals-governance-lab/` root so Copilot can see `.github/agents/` and `.github/prompts/`. |
| `mvn spring-boot:run` fails to start | The app should start cleanly on port 8080. If startup fails, check Java version (`java -version` must be 17+) and that port 8080 is free. Vulnerabilities are behavioural, not startup-blocking. |
| Coverage below threshold | Expand tests defined in `docs/testing-guide.md`, or justify the gap in `docs/test-coverage.md`. |
| Copilot suggestions ignore guardrails | Re-state relevant sections from `.github/instructions/java.instructions.md` in your prompt and attach source context before requesting code. |
| Scripts fail on Windows | Use WSL2 or a bash-compatible environment; the lab assumes GNU utilities. |

## Additional Resources
- [Spring Boot Reference Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Security Reference](https://docs.spring.io/spring-security/reference/index.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [GitHub Copilot Documentation](https://docs.github.com/copilot)

Happy governing! Document every assumption, surface evidence for each fix, and keep the audit trail up to date.

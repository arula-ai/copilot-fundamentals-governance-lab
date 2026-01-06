# Delivery Workflow Overview (Spring Boot Track)

> **Working Directory**: All commands should be run from `java/governance`. Run `cd java/governance` from the repository root before starting.

The Java edition of the Copilot Governance Lab ships with intentionally vulnerable Spring Boot components. Your mission is to move the codebase from insecure to audit-ready while documenting every decision, command, and validation step. Follow the stages below, using the dedicated Copilot agents to keep evidence organised.

## Stage 0 – Prepare & Align
- Read `.github/instructions/java.instructions.md`, `LAB_ACTION_GUIDE.md`, `README.md`, and (when available) `SECURITY.md`.
- Select the **java-planning** agent from the Agent dropdown in Copilot Chat to capture initial assumptions, risks, and questions in `docs/workflow-tracker.md`.
- Familiarise yourself with the vulnerable Java classes referenced in `docs/vulnerability-guide.md` under `src/main/java/com/github/copilot/lab/`.

## Stage 1 – Assess the Baseline
- Target files:
  - `AuthControllerVulnerable.java`
  - `FileStorageServiceVulnerable.java`
  - `ReportControllerVulnerable.java`
- Use `docs/vulnerability-guide.md` to catalogue OWASP mappings, affected assets, logging concerns, and missing controls.
- Persist findings in a dedicated plan (e.g., `docs/plans/stage1-plan.md`) and summarise key risks + open questions in `docs/workflow-tracker.md`.

## Stage 2 – Remediate with Copilot
- Remediate the vulnerable classes **in place**. Only drop the `Vulnerable` suffix after the code meets guardrails and tests pass.
- Apply Spring Boot best practices: constructor injection, DTO validation, prepared statements/Spring Data, session regeneration, secure logging.
- Record every Maven command (`mvn clean`, `mvn test`, `mvn verify`, `mvn dependency:tree`, `./scripts/run-all-checks.sh`) in `docs/test-coverage.md` with outcomes and coverage deltas.
- Update `docs/workflow-tracker.md`, `VULNERABILITIES.md`, and `FIXES.md` with remediation progress and residual risks.

## Stage 3 – Generate Security Tests
- Follow `docs/testing-guide.md` to design JUnit + Spring Boot test suites for remediated components.
- Target coverage ≥80% across critical paths (authentication, file uploads, report exports). Use MockMvc, Spring Security test utilities, and Mockito.
- Log coverage metrics, new test files, and command results in `docs/test-coverage.md`, then summarise the session in `docs/workflow-tracker.md`.

## Stage 4 – Implement Secure Enhancements
- Use `docs/secure-features-guide.md` to add proactive controls (e.g., security filters, sanitisation utilities, policy enforcement).
- Keep implementation within `src/main/java/com/github/copilot/lab/` and `src/main/resources/templates/` as appropriate.
- Capture architectural decisions, new configuration properties, and validation plans in `docs/plans/stage4-plan.md` and the workflow tracker.

## Stage 5 – Governance Validation & Reporting
- Run end-to-end quality gates: `mvn clean verify`, `mvn dependency:tree`, `./scripts/run-all-checks.sh`.
- Generate evidence with `./scripts/generate-report.sh` and review `governance-report.md`.
- Refresh `VULNERABILITIES.md`, `FIXES.md`, `COPILOT_USAGE.md`, and create/update `SECURITY.md` if missing.
- Log final command outcomes, blockers, and release readiness in `docs/workflow-tracker.md`.

## Stage 6+ – Homework & Submission
- Tackle optional challenges under `homework/` to deepen familiarity with secure coding and governance reporting.
- Use the PR template to surface evidence, coverage metrics, and Copilot usage when you are ready to submit.

## Copilot Agents Recap
Select the Java-specific agents from the Agent dropdown in Copilot Chat (defined in `.github/agents/`):
- **java-planning** – Understand requirements, draft plans, and record assumptions.
- **java-scrum-master** – Translate plans into task lists with owners and acceptance criteria.
- **java-testing** – Execute Maven commands, log results in `docs/test-coverage.md`, highlight gaps.
- **java-validation** – Audit changes against guardrails, enumerate pass/fail outcomes.
- **java-need-review** – Perform final review slices before sign-off.
- **java-summarizer** – Append concise hand-offs to `docs/workflow-tracker.md`.

Always close the loop by updating the tracker and relevant documentation. The lab rewards teams that can prove what was done, why it was done, and how Copilot assisted along the way.

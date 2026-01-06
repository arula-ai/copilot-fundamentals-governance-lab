# Delivery Workflow Overview

The project ships with real Angular code that intentionally contains governance gaps.  
Work through the stages below to take the codebase from vulnerable to production ready while leaving an auditable trail.

## Stage 0 – Prepare & Align
- Review `.github/instructions/angular.instructions.md`, `SECURITY.md`, `LAB_ACTION_GUIDE.md`, and `README.md`.
- In Copilot **Plan Mode**, capture initial assumptions, risks, and scope in `docs/workflow-tracker.md`.
- Familiarize yourself with the vulnerable files under `src/app/services/` and `src/app/components/`.

## Stage 1 – Assess the Baseline
- Target files:
  - `src/app/services/auth.service.vulnerable.ts`
  - `src/app/components/login/login.component.vulnerable.ts`
  - `src/app/components/user-profile/user-profile.component.vulnerable.ts`
- Use `docs/vulnerability-guide.md` as a reference while cataloguing OWASP mappings, attack surfaces, and governance requirements.
- Store findings in a plan file (e.g., `docs/plans/stage1-plan.md`) and log summary notes in `docs/workflow-tracker.md`.

## Stage 2 – Remediation with Copilot
- Fix the vulnerabilities **in place** inside the files listed above (remove the `.vulnerable` suffix once secure).
- Follow the remediation guidance in `docs/vulnerability-guide.md` and honour `.github/instructions/angular.instructions.md`.
- Record execution details (commands, successes, blockers) in `docs/workflow-tracker.md`.
- Use `docs/test-coverage.md` to log linting/test assumptions and command results.

## Stage 3 – Generate Security Tests
- Reference `docs/testing-guide.md` for required scenarios, coverage targets, and prompts.
- Create/extend spec files under `src/app/` to achieve ≥80% coverage on critical paths.
- Log coverage metrics and command results in `docs/test-coverage.md`, summarizing outcomes in `docs/workflow-tracker.md`.

## Stage 4 – Implement Secure Enhancements
- Follow `docs/secure-features-guide.md` to add hardened functionality (interceptors, guards, sanitization, forms, uploads).
- Keep implementation within the standard Angular structure (`src/app/...`).
- Document new features, risks, and validations in `docs/workflow-tracker.md`.

## Stage 5 – Governance Validation & Reporting
- Run all quality gates (`npm run lint`, `npm run lint:security`, `npm run test:coverage`, `npm audit --audit-level=high`, optional `./scripts/run-all-checks.sh`).
- Execute `./scripts/generate-report.sh` and review `governance-report.md`.
- Update required documentation (`VULNERABILITIES.md`, `FIXES.md`, `COPILOT_USAGE.md`) and capture final status in `docs/workflow-tracker.md`.
- Ensure submission artifacts are ready (branch, PR template, checklists).

## Copilot Agents Recap
Select the Angular-specific agents from the Agent dropdown in Copilot Chat (defined in `.github/agents/`):
- **angular-planning** – Build strategies, write plans, and log assumptions.
- **angular-scrum-master** – Break work into actionable tasks with acceptance notes.
- **angular-testing** – Execute lint/test suites, log results in `docs/test-coverage.md`, summarize in tracker.
- **angular-validation** – Confirm guardrails were met; log pass/fail status.
- **angular-need-review** – Perform final review, capture approvals/findings.
- **angular-summarizer** – Generate concise hand-off summaries for the workflow tracker.

Deliverables should include:
- Updated source files with vulnerabilities remediated.
- Completed plans, trackers, and coverage logs under `docs/`.
- Test suites and quality gate evidence demonstrating compliance.

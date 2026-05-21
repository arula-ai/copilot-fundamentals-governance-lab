# Lab Action Guide

## Workspace Setup

**Open VS Code at the parent repository root** — `copilot-fundamentals-governance-lab/` — not at `java/governance/`.

This is required so GitHub Copilot can discover the shared configuration at the repo root:

- `.github/agents/` — the six `java-*` Copilot agents (planning, scrum-master, testing, validation, need-review, summarizer)
- `.github/instructions/java.instructions.md` — auto-attached coding/security standards for every `.java` and `.properties` file you edit
- `.github/prompts/hand-off.prompt.md` — the `/hand-off` slash command

**If your Agent Mode dropdown is empty or `/hand-off` is not offered, your workspace is opened too deep — close and reopen at the parent repo root.**

## Working Directory (terminal)

All Maven and shell commands in this guide run from the `java/governance` directory:

```bash
# From the repository root (the directory you just opened in VS Code):
cd java/governance
```

Keep VS Code at the parent root; keep the terminal at `java/governance`.

---

Follow these stages in order. Use Summarizer Mode with the Hand-Off prompt (`/hand-off`) at the end of Stage 1, Stage 3, and Stage 5, and ensure each hand-off is appended to `docs/workflow-tracker.md`.

The stage numbering here matches `README.md`, `docs/workflow-guide.md`, and the canonical InRhythm governance-lab flow.

## Quick Reference

| Stage | Name                                  | Primary Modes                                       | Core Artifacts / Commands                                                        |
| ----- | ------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------- |
| 0     | Setup & Governance Alignment          | Agent                                               | `./scripts/setup-lab.sh`, `mvn spring-boot:run`, `.github/instructions/java.instructions.md`, `mvn test`, `mvn verify` |
| 1     | Baseline Assessment                   | Planning → Validation → Agent                       | `docs/vulnerability-guide.md`, `docs/test-coverage.md`, `docs/plans/plan.md`     |
| 2     | Remediation                           | Agent ↔ Need Review                                 | `src/main/**`, `VULNERABILITIES.md`, `FIXES.md`                                  |
| 3     | Security Test Generation              | Planning → Testing → Agent                          | `docs/testing-guide.md`, `mvn verify`, `docs/test-coverage.md`                   |
| 4     | Secure Feature Implementation         | Planning → Validation → Agent ↔ Need Review         | `docs/secure-features-guide.md`, feature specs                                   |
| 5     | Governance Validation & Reporting     | Testing → Agent                                     | `mvn test`, `mvn verify`, `mvn dependency:tree`, `./scripts/generate-report.sh`  |
| 6     | Optional: Homework & Extras           | Agent ↔ Need Review                                 | `homework/README.md`                                                              |
| 7     | Optional: Prepare Submission          | Validation → Agent ↔ Need Review                    | `SECURITY.md`, `homework/GRADING_RUBRIC.md`, PR template                          |

## Stage 0 – Setup & Governance Alignment

**Goal:** verify the build, get the app running, and load the team's coding/security guardrails into Copilot before you analyse anything.

- Run `./scripts/setup-lab.sh` (preferred) — verifies Java 17+, Maven 3.9+, and `mvn validate`.
- Run `mvn spring-boot:run` in your terminal. **The application will start successfully on `http://localhost:8080`.** The vulnerabilities surface through *behaviour* (e.g., `POST /api/login` with an empty body succeeds as `guest`/`password`, `/api/debug/sessions` is unauthenticated, profile updates accept arbitrary fields) — not through startup failures. Verify the app is up with `curl http://localhost:8080/` then stop it with `Ctrl+C` before proceeding.
- Switch to **Agent Mode** in Copilot Chat and run this instruction template to load the team guardrails:
  ```text
  Review .github/instructions/java.instructions.md and summarize:
  - security/coding guardrails
  - required quality gates
  - required documentation artifacts
  Return a Stage 0 checklist I should keep open while remediating.
  ```
- Inspect available tools (wrench icon) without changing settings.
- Run `mvn test` and `mvn verify` in your terminal; log baseline assumptions in `docs/test-coverage.md` (build succeeds, single existing test passes, Jacoco report generated).

No hand-off is required at this stage.

## Stage 1 – Baseline Assessment

**Goal:** catalogue every vulnerability in the auth-and-session surface and produce an approved remediation plan.

- Switch to **Planning Mode (java-planning)** and run:
  ```text
  Build a Stage 1 baseline plan using docs/vulnerability-guide.md and docs/test-coverage.md.
  Include target files, prioritized risks, and evidence needs. Save to docs/plans/plan.md.
  ```
- Switch to **Validation Mode (java-validation)** and run:
  ```text
  Validate the Stage 1 baseline plan against .github/instructions/java.instructions.md.
  Return pass/fail and required corrections before Stage 2.
  ```
- Switch to **Agent Mode** and run:
  ```text
  Create the final Stage 1 execution checklist: target files, risks per file,
  artifacts to update, and command order for Stage 2 readiness.
  ```
- If missing, create `VULNERABILITIES.md`, `FIXES.md`, `COPILOT_USAGE.md`, and `SECURITY.md` at the repo root (`java/governance/`).
- Save or update `docs/plans/plan.md` with the approved plan and open questions.
- **Hand-Off:** run `/hand-off` (Summarizer Mode) and append the summary to `docs/workflow-tracker.md` with approved plan, guardrail checks, and blockers.

## Stage 2 – Remediation

**Goal:** fix the vulnerabilities in place, one slice at a time, with a review pass between each slice.

- Switch to **Agent Mode** and run:
  ```text
  Implement Stage 2 remediation from docs/plans/plan.md one risk slice at a time.
  Keep edits scoped and avoid unrelated changes.
  ```
- Switch to **Need Review Mode (java-need-review)** and run:
  ```text
  Review this remediation slice for security and guardrail compliance.
  Return critical/high issues and required fixes.
  ```
- Switch back to **Agent Mode** and update `VULNERABILITIES.md` and `FIXES.md` as fixes ship.
- Rename files only after the code satisfies guardrails — e.g., `InsecureSessionRepository` → `SessionRepository` once credentials are no longer persisted in reversible form.

No hand-off is required at this stage.

## Stage 3 – Security Test Generation

**Goal:** prove every remediation with deterministic tests; reach ≥80% Jacoco coverage on critical paths or document the exception.

- Optional: switch to **Planning Mode** and run:
  ```text
  Build a Stage 3 security test plan from docs/testing-guide.md:
  scenarios, target test files, and expected coverage impact.
  ```
- Switch to **Testing Mode (java-testing)** and run:
  ```text
  Generate/update JUnit security tests from the Stage 3 plan.
  Summarize pass/fail, coverage, and remaining gaps for docs/test-coverage.md.
  ```
- Run `mvn verify` in your terminal until ≥80% or documented rationale.
- Switch to **Agent Mode** and capture coverage deltas and evidence paths in `docs/test-coverage.md`.
- **Hand-Off:** run `/hand-off` (Summarizer Mode) and append to `docs/workflow-tracker.md` with executed suites, pass/fail status, and remaining test work.

## Stage 4 – Secure Feature Implementation

**Goal:** move beyond remediation by adding proactive controls (security headers, audit trail, upload allow-list, etc.) defined in `docs/secure-features-guide.md`.

- Switch to **Planning Mode (java-planning)** and run:
  ```text
  Create a Stage 4 feature implementation plan from docs/secure-features-guide.md.
  Save/update docs/plans/plan.md.
  ```
- Switch to **Validation Mode (java-validation)** and run:
  ```text
  Validate the Stage 4 plan against .github/instructions/java.instructions.md.
  Return pass/fail with required fixes.
  ```
- Switch to **Agent Mode** and run:
  ```text
  Implement Stage 4 features from docs/plans/plan.md in small auditable slices.
  Add/update tests for each slice.
  ```
- Switch to **Need Review Mode (java-need-review)** and run:
  ```text
  Review this feature slice for security and guardrail compliance.
  Return critical/high issues and required fixes.
  ```

No hand-off is required at this stage.

## Stage 5 – Governance Validation & Reporting

**Goal:** run every quality gate, generate the governance report, finalise all governance artifacts.

- Switch to **Testing Mode (java-testing)** and run:
  ```text
  Prepare the final Stage 5 validation runbook with command order,
  expected outputs, and evidence locations.
  ```
- Run in your terminal: `mvn clean`, `mvn test`, `mvn verify`, `mvn dependency:tree` (or `./scripts/run-all-checks.sh`).
- Run `./scripts/generate-report.sh` in your terminal.
- Switch to **Agent Mode** and run:
  ```text
  Finalize governance docs (VULNERABILITIES.md, FIXES.md, COPILOT_USAGE.md, docs/workflow-tracker.md)
  and summarize release readiness.
  ```
- **Hand-Off:** run `/hand-off` (Summarizer Mode) and append to `docs/workflow-tracker.md` with command results, report readiness, and outstanding risks.

## Stage 6 – Optional Homework & Extras

- Agent Mode: complete `homework/README.md` tasks; involve Need Review Mode if validation is needed
- Agent Mode: gather artifacts for bonus work
- Hand-Off: run `/hand-off` (Summarizer Mode) and append to `docs/workflow-tracker.md` with optional work finished and items left for later.

> Note: `homework/` currently ships the Angular-track challenges. If you are running this as a Java-only session, treat Stage 6 as a follow-up activity rather than an in-session deliverable.

## Stage 7 – Optional Prepare Submission

- Validation Mode (java-validation): walk `SECURITY.md` checklist and close gaps
- Agent Mode: review `homework/GRADING_RUBRIC.md`, push branch, open PR
- Need Review Mode: fill the PR template with governance evidence
- Hand-Off: run `/hand-off` (Summarizer Mode) and append to `docs/workflow-tracker.md` with submission state, linked artifacts, and next reviewer actions.

## Mode Loop Reminder

- Planning → Validation → Agent → Need Review → Testing
- Use the Summarizer Hand-Off at **Stage 1, Stage 3, and Stage 5**. Use additional hand-offs only if the facilitator asks for one.

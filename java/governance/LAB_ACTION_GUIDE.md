# Lab Action Guide

## Working Directory

**Important**: All commands in this guide should be run from the `java/governance` directory.

```bash
# From the repository root, navigate to:
cd java/governance
```

Ensure your terminal and VS Code workspace are set to this directory before running any commands.

---

Follow these lean steps. Keep the core technical flow in Stage 0 through Stage 6.
Use Summarizer Mode with the Hand-Off prompt at milestone stages (Stage 2, Stage 4, Stage 6) and ensure each hand-off is appended to `docs/workflow-tracker.md`.

## Quick Reference

| Stage | Primary Modes                                       | Core Artifacts / Commands                                                        |
| ----- | --------------------------------------------------- | -------------------------------------------------------------------------------- |
| 0     | Agent                                               | `./scripts/setup-lab.sh` (preferred), `mvn spring-boot:run`                     |
| 1     | Agent -> Testing                                    | `.github/instructions/java.instructions.md`, `mvn test`, `mvn verify`           |
| 2     | Planning -> Validation -> Agent                     | `docs/vulnerability-guide.md`, `docs/test-coverage.md`, `docs/plans/plan.md`    |
| 3     | Agent <-> Need Review                               | `src/main/**`, `VULNERABILITIES.md`, `FIXES.md`                                  |
| 4     | Planning -> Testing -> Agent                        | `docs/testing-guide.md`, `mvn verify`, `docs/test-coverage.md`                  |
| 5     | Planning -> Validation -> Agent <-> Need Review     | `docs/secure-features-guide.md`, feature specs                                   |
| 6     | Testing -> Agent                                    | `mvn test`, `mvn verify`, `mvn dependency:tree`, `./scripts/generate-report.sh` |
| 7     | Optional: Agent <-> Need Review                     | `homework/README.md`                                                             |
| 8     | Optional: Validation -> Agent <-> Need Review       | `SECURITY.md`, `homework/GRADING_RUBRIC.md`, PR template                         |

## Stage 0 – Environment Setup

- Run `mvn spring-boot:run` in your terminal (initial runtime issues are acceptable for baseline).

No hand-off is required at this stage.

## Stage 1 – Governance Alignment

- First, make sure you are in Agent Mode.
- **Instruction Template (copy into Copilot Chat):**
  ```text
  Review .github/instructions/java.instructions.md and summarize:
  - security/coding guardrails
  - required quality gates
  - required documentation artifacts
  Return a Stage 1 checklist.
  ```
- Inspect available tools (wrench icon) without changing settings
- Run `mvn test` and `mvn verify` in your terminal; log assumptions in `docs/test-coverage.md`.

No hand-off is required at this stage.

## Stage 2 – Baseline Assessment

- Switch to **Planning Mode (java-planning)** and run:
  ```text
  Build a Stage 2 baseline plan using docs/vulnerability-guide.md and docs/test-coverage.md.
  Include target files, prioritized risks, and evidence needs. Save to docs/plans/plan.md.
  ```
- Switch to **Validation Mode (java-validation)** and run:
  ```text
  Validate the Stage 2 baseline plan against .github/instructions/java.instructions.md.
  Return pass/fail and required corrections before Stage 3.
  ```
- Switch to **Agent Mode** and run:
  ```text
  Create the final Stage 2 execution checklist: target files, risks per file,
  artifacts to update, and command order for Stage 3 readiness.
  ```
- If missing, create `VULNERABILITIES.md`, `FIXES.md`, `COPILOT_USAGE.md`, and `SECURITY.md` at the repo root (`java/governance/`).
- Save or update `docs/plans/plan.md` with the approved plan and open questions.
- Hand-Off: run `/hand-off` (Summarizer Mode) and append the summary to `docs/workflow-tracker.md` with approved plan, guardrail checks, and blockers.

## Stage 3 – Remediation

- Switch to **Agent Mode** and run:
  ```text
  Implement Stage 3 remediation from docs/plans/plan.md one risk slice at a time.
  Keep edits scoped and avoid unrelated changes.
  ```
- Switch to **Need Review Mode (java-need-review)** and run:
  ```text
  Review this remediation slice for security and guardrail compliance.
  Return critical/high issues and required fixes.
  ```
- Switch back to **Agent Mode** and update `VULNERABILITIES.md` and `FIXES.md` as fixes ship.

No hand-off is required at this stage.

## Stage 4 – Security Test Generation

- Optional: switch to **Planning Mode** and run:
  ```text
  Build a Stage 4 security test plan from docs/testing-guide.md:
  scenarios, target test files, and expected coverage impact.
  ```
- Switch to **Testing Mode (java-testing)** and run:
  ```text
  Generate/update JUnit security tests from the Stage 4 plan.
  Summarize pass/fail, coverage, and remaining gaps for docs/test-coverage.md.
  ```
- Run `mvn verify` in your terminal until >=80% or documented rationale.
- Switch to **Agent Mode** and capture coverage deltas and evidence paths in `docs/test-coverage.md`.
- Hand-Off: run `/hand-off` (Summarizer Mode) and append to `docs/workflow-tracker.md` with executed suites, pass/fail status, and remaining test work.

## Stage 5 – Secure Feature Implementation

- Switch to **Planning Mode (java-planning)** and run:
  ```text
  Create a Stage 5 feature implementation plan from docs/secure-features-guide.md.
  Save/update docs/plans/plan.md.
  ```
- Switch to **Validation Mode (java-validation)** and run:
  ```text
  Validate the Stage 5 plan against .github/instructions/java.instructions.md.
  Return pass/fail with required fixes.
  ```
- Switch to **Agent Mode** and run:
  ```text
  Implement Stage 5 features from docs/plans/plan.md in small auditable slices.
  Add/update tests for each slice.
  ```
- Switch to **Need Review Mode (java-need-review)** and run:
  ```text
  Review this feature slice for security and guardrail compliance.
  Return critical/high issues and required fixes.
  ```

No hand-off is required at this stage.

## Stage 6 – Governance Validation & Reporting

- Switch to **Testing Mode (java-testing)** and run:
  ```text
  Prepare the final Stage 6 validation runbook with command order,
  expected outputs, and evidence locations.
  ```
- Run in your terminal: `mvn clean`, `mvn test`, `mvn verify`, `mvn dependency:tree` (or `./scripts/run-all-checks.sh`).
- Run `./scripts/generate-report.sh` in your terminal.
- Switch to **Agent Mode** and run:
  ```text
  Finalize governance docs (VULNERABILITIES.md, FIXES.md, COPILOT_USAGE.md, docs/workflow-tracker.md)
  and summarize release readiness.
  ```
- Hand-Off: run `/hand-off` (Summarizer Mode) and append to `docs/workflow-tracker.md` with command results, report readiness, and outstanding risks.

## Stage 7 – Optional Homework & Extras

- Agent Mode: complete `homework/README.md` tasks; involve Need Review Mode if validation is needed
- Agent Mode: gather artifacts for bonus work
- Hand-Off: run `/hand-off` (Summarizer Mode) and append to `docs/workflow-tracker.md` with optional work finished and items left for later.

## Stage 8 – Optional Prepare Submission

- Validation Mode (java-validation): walk `SECURITY.md` checklist and close gaps
- Agent Mode: review `homework/GRADING_RUBRIC.md`, push branch, open PR
- Need Review Mode: fill the PR template with governance evidence
- Hand-Off: run `/hand-off` (Summarizer Mode) and append to `docs/workflow-tracker.md` with submission state, linked artifacts, and next reviewer actions.

## Mode Loop Reminder

- Planning -> Validation -> Agent -> Need Review -> Testing
- Use the Summarizer Hand-Off at Stage 2, Stage 4, and Stage 6. Use additional hand-offs only if the facilitator asks for one.

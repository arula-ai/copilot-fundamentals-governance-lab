# Lab Action Guide

## Working Directory

**Important**: All commands in this guide should be run from the `angular/governance` directory.

```bash
# From the repository root, navigate to:
cd angular/governance
```

Ensure your terminal and VS Code workspace are set to this directory before running any commands.

---

Follow these lean steps. Keep the core technical flow in Stage 0 through Stage 6.
Use Summarizer Mode with the Hand-Off prompt at milestone stages (Stage 2, Stage 4, Stage 6) so progress is captured in `docs/workflow-tracker.md`.

## Quick Reference

| Stage | Primary Modes | Core Artifacts / Commands |
| --- | --- | --- |
| 0 | Agent | `./scripts/setup-lab.sh`, `npm run start` |
| 1 | Agent → Testing | `.github/instructions/angular.instructions.md`, `npm run lint`, `npm run test` |
| 2 | Planning → Validation → Agent | `docs/vulnerability-guide.md`, `docs/test-coverage.md`, `docs/plans/plan.md` |
| 3 | Agent ↔ Need Review | `src/app/**`, `VULNERABILITIES.md`, `FIXES.md` |
| 4 | Planning → Testing → Agent | `docs/testing-guide.md`, `npm run test:coverage`, `docs/test-coverage.md` |
| 5 | Planning → Validation → Agent ↔ Need Review | `docs/secure-features-guide.md`, feature specs |
| 6 | Testing → Agent | `npm run lint`, `npm run lint:security`, `npm run test:coverage`, `npm audit --audit-level=high`, `./scripts/generate-report.sh` |
| 7 | Optional: Agent ↔ Need Review | `homework/README.md` |
| 8 | Optional: Validation → Agent ↔ Need Review | `SECURITY.md`, `homework/GRADING_RUBRIC.md`, PR template |

## Stage 0 – Environment Setup
- Agent Mode: run one-time setup validation with `./scripts/setup-lab.sh`.
- If script execution is unavailable, run manual checks: `node -v`, `npm -v`, and `npm run lint -- --help`.
- Agent Mode: run `npm run start` (initial runtime issues are acceptable for baseline).

No hand-off is required at this stage.

## Stage 1 – Governance Alignment
- First, make sure you are in Agent Mode.
- Read `.github/instructions/angular.instructions.md` and Angular agent files only: `.github/agents/angular-*.agent.md`.
- Inspect available tools (wrench icon) without changing settings
- Testing Mode (angular-testing): run `npm run lint` and `npm run test:coverage`; log assumptions in `docs/test-coverage.md`.

No hand-off is required at this stage.

## Stage 2 – Baseline Assessment
- Planning Mode (angular-planning): review `docs/vulnerability-guide.md` and current coverage.
- Validation Mode (angular-validation): sanity-check the remediation plan against guardrails.
- Agent Mode: capture file targets, risk notes, and evidence needs.
- If missing, create `VULNERABILITIES.md`, `FIXES.md`, `COPILOT_USAGE.md`, and `SECURITY.md` at the repo root (`angular/governance/`).
- Save or update `docs/plans/plan.md` with the approved plan and open questions.
- Hand-Off: run `/hand-off` and summarize approved plan, guardrail checks, and blockers.

## Stage 3 – Remediation
- Agent Mode: implement fixes in `src/app/**` referencing the plan
- Need Review Mode: request feedback per change slice; fold responses back in Agent Mode
- Agent Mode: update `VULNERABILITIES.md` / `FIXES.md` as fixes ship
- Hand-Off: summarize files touched, decisions made, pending follow-ups

## Stage 4 – Security Test Generation
- Planning Mode (optional): outline missing security coverage using `docs/testing-guide.md`
- Testing Mode: run `npm run test:coverage` until ≥80% or documented rationale
- Agent Mode: capture coverage deltas and evidence paths in `docs/test-coverage.md`
- Hand-Off: `/hand-off` log executed suites, pass/fail status, remaining test work

## Stage 5 – Secure Feature Implementation
- Planning Mode: break down required feature changes from `docs/secure-features-guide.md`.
- Validation Mode (angular-validation): confirm the feature plan satisfies guardrails.
- Agent Mode: build the feature, referencing the plan and relevant implementation files.
- Need Review Mode (angular-need-review): review each delivery slice before merge.

No hand-off is required at this stage.

## Stage 6 – Governance Validation & Reporting
- Testing Mode: run `npm run lint`, `npm run lint:security`, `npm run test:coverage`, `npm audit --audit-level=high` (or `./scripts/run-all-checks.sh`)
- Testing Mode: execute `./scripts/generate-report.sh`; inspect `governance-report.md` in Agent Mode
- Agent Mode: refresh `VULNERABILITIES.md`, `FIXES.md`, `COPILOT_USAGE.md` with final status
- Hand-Off: `/hand-off` state command results, report readiness, and outstanding risks.

## Stage 7 – Optional Homework & Extras
- Agent Mode: complete `homework/README.md` tasks; involve Need Review Mode if validation is needed
- Agent Mode: gather artifacts for bonus work

No hand-off is required at this stage.

## Stage 8 – Optional Prepare Submission
- Validation Mode (angular-validation): walk `SECURITY.md` checklist and close gaps.
- Agent Mode: review `homework/GRADING_RUBRIC.md`, push branch, open PR
- Need Review Mode: fill the PR template with governance evidence

No hand-off is required at this stage.

## Mode Loop Reminder
- Planning → Validation → Agent → Need Review → Testing
- Use Summarizer Hand-Off at milestone stages (2, 4, 6) so `docs/workflow-tracker.md` stays current without direct edits.

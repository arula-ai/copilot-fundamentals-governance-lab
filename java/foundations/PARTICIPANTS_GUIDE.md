# Participant's Guide - Everyday Workflows: Comprehend, Refactor, Test

> **Purpose**: Give you a Copilot-first playbook for the Foundations lab. Every step below is an action item; check them off as you go.

---

## Phase 0 - 4 min - Power On Copilot
1. Launch your IDE (VS Code or IntelliJ) and verify GitHub Copilot Chat is signed in.
2. Open the Copilot Chat panel and pin it; you will use slash commands throughout the lab.
3. Confirm Copilot inline completions are enabled (`Ctrl+,` -> Extensions -> GitHub Copilot -> Enable).
4. Warm up Copilot by asking `/explain What can you help me with during this lab?`.
5. Navigate to the lab folder:
   ```bash
   cd java/foundations
   ```
6. Ask Copilot: `How do I build and run this project? What are its main dependencies?`
7. Run `#runInTerminal mvn clean install -DskipTests` to verify the project compiles.

## Phase 1 - 7 min - Baseline Metrics
8. In Copilot Chat, begin prompts with `#codebase` so responses use repository context.
9. Run `#runInTerminal mvn test`.
10. Run `#runInTerminal mvn jacoco:report` and note coverage from `target/site/jacoco/index.html`.
11. Run `#runInTerminal mvn checkstyle:check` and capture warning counts.
12. Create `docs/NOTES.md` and add baseline coverage, failing tests, and checkstyle totals.
13. Ask Copilot: `Draft a baseline metrics section for docs/NOTES.md summarizing current coverage, lint issues, and failing tests.`

## Phase 2 - 8 min - Analyze and Risk Triage
14. Ask Copilot:
    - `/explain Review #codebase and explain DateUtils.java responsibilities, dependencies, and hidden side effects.`
15. Follow with:
    - `/explain Analyze DateUtils.java for code smells, performance risks, and security issues. Organize findings by severity.`
16. Create `docs/RISKS.md` and group findings under Critical, High, and Medium.
17. Run a targeted usage search:
    - `#runInTerminal rg "DateUtils" src/main/java`
18. Ask Copilot:
    - `/explain From these call sites, what downstream impact should I watch for when refactoring?`
19. Ask for a Golden Example:
    - `/explain Show me an idiomatic JUnit test for OrderService.java from this repo I can mirror.`

## Phase 3 - 5 min - Refactor Plan with Copilot
20. Ask Copilot:
    - `/explain Create a numbered refactor plan for DateUtils.java that addresses Critical items in docs/RISKS.md first, each with success criteria and required tests.`
21. Paste the response into `REFACTOR_PLAN.md`.
22. For each plan step, ask:
    - `/explain For Step 1 above, how will I prove success via tests or metrics?`

## Phase 4 - 7 min - Test Generation Sprint
23. Validate behavior first:
    - `/explain For each public method in DateUtils.java, what does it return for valid non-null inputs? Give one concrete input and output example per method.`
24. Generate tests:
    - `/tests Based on the behavior you just described, generate JUnit 5 happy-path unit tests for DateUtils.java in src/test/java/com/workshop/copilot/utils/DateUtilsTest.java.`
25. Add edge cases:
    - `/tests Add edge-case coverage for invalid dates, DST transitions, and leap years using JUnit 5.`
26. For time-sensitive logic:
    - `/tests Show how to test date calculations in DateUtils.java using java.time.Clock or fixed instants.`
27. Run `#runInTerminal mvn test` and use `/fix` one failure at a time.
28. Run `#runInTerminal mvn test jacoco:report` and capture coverage from `target/site/jacoco/index.html`.
29. If a suggested fix changes production code unexpectedly, reject it and note the finding in `docs/NOTES.md`.
30. Log updated coverage in `docs/NOTES.md`.

## Phase 5 - 6 min - Implement One Safe Refactor
30. Open `REFACTOR_PLAN.md` and pick the lowest-risk step.
31. Use this **Prompt Template** in Copilot Chat (copy/paste as-is):

    ```text
    Use #codebase and read: docs/RISKS.md, REFACTOR_PLAN.md, docs/NOTES.md.

    Goal: apply exactly ONE safe refactor for the highest-priority risk.

    1) Rank top 3 candidates from docs/RISKS.md + REFACTOR_PLAN.md by:
       severity (Critical > High > Medium), then lowest blast radius, then highest confidence.
    2) Auto-select candidate #1.
    3) Before changes, output a "Refactor Contract" with:
       risk id/title, target production file+method, target test file, and non-goals.
    4) Implement only that contract with constraints:
       preserve public API/signatures; no unrelated edits; max 1 production file + 1 test file;
       no dependency/version/config changes.
    5) Validate with:
       - mvn test
       - mvn test jacoco:report
    6) Output:
       - shortlist table (top 3 + rationale)
       - Refactor Contract
       - files changed
       - verification results
       - NOTES.md update block (risk mitigated, files changed, tests run, pass/fail, coverage delta, residual risk)
    ```
32. Review the diff and accept only scoped changes.
33. Ask Copilot:
    - `/explain What did you change and why? What edge cases does this cover, and what could still slip through?`
34. Keep diffs small and run `#runInTerminal mvn test` after each accepted change.
35. If tests fail, paste one failing stack trace into `/fix` and iterate.

## Foundations Closeout - 3 min - Handoff to Governance
36. Update `docs/NOTES.md` with a short "What Changed" summary.
37. Add a "Validation Evidence" block with latest test status and coverage delta.
38. Update `docs/RISKS.md` with unresolved high-priority risks.
39. Add a "Governance Handoff" note: which unresolved risk should be tackled first next and why.

---

## Quick Copilot Reference
- Critique then Create: `/explain Analyze...` -> `/fix Refactor...`
- Golden Example: `/explain Show me an idiomatic JUnit test for OrderService.java from this repo I can mirror.`
- Slash commands: `/explain`, `/tests`, `/fix`, `/docs`
- Shortcuts: Copilot Chat (`Cmd+/` or `Alt+/`), Inline Suggestion (`Cmd+I` or `Ctrl+I`)

## Troubleshooting with Copilot
- No response: check login, network, and IDE output; retry with a smaller prompt.
- Weak suggestions: restate constraints explicitly, for example `Do not change public API`.
- Failing tests: paste one stack trace into `/fix` and request a targeted patch.
- Checkstyle confusion: verify you are running commands from `java/foundations`.
- Slow tests: use Copilot to identify slow methods and isolate likely causes before refactoring.

## Post-Session Homework
- Apply Critique then Create to one production method this week and record outcomes.
- Track coverage improvements and time saved using Copilot.
- Share one successful prompt pattern with your team.

You now have a complete Copilot-driven workflow for Foundations and a clean handoff point into Governance.

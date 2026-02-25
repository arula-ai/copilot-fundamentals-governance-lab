# Participant's Guide – Everyday Workflows: Comprehend, Refactor, Test

> **Purpose**: Give you a Copilot-first playbook for the 40-minute DevAssist lab. Every step below is an action item—check them off as you go.

---

## Phase 0 · 5 min · Power On Copilot
1. Launch your IDE (VS Code or IntelliJ) and verify GitHub Copilot Chat is signed in.
2. Open the Copilot Chat panel and pin it; you will use slash commands constantly.
3. Confirm Copilot inline completions are enabled (`Ctrl+,` → Extensions → GitHub Copilot → Enable). 
4. Warm up Copilot: ask `/explain What can you help me with during this lab?` to ensure the service responds.
5. Navigate to the correct working directory inside the consolidated lab repo:
   ```bash
   cd java/foundations
   ```
   > **Note**: All commands in this guide must be run from the `java/foundations` directory.
6. Ask Copilot Chat: `How do I build and run this project? What are its main dependencies?` to get an overview of the project setup, then run `#runInTerminal mvn clean install -DskipTests` to install dependencies and verify the build compiles cleanly.

## Phase 1 · 10 min · Baseline Metrics
7. In Copilot Chat just type this: `#codebase`

`#codebase` is a chat variable that references relevant context in your chat prompt. When used, it adds pertinent workspace content to your prompt. For example, asking "How do I build this `#codebase`?" will provide steps to build the project by analyzing documentation, scripts, and configurations. - 

`@workspace` is a built-in chat participant that enhances chat interactions by providing domain-specific knowledge. For example, when you ask "`@workspace` how is authentication implemented?" it will provide an overview of the authentication flow with references to the relevant code.

- Used by itself, this is identical to @workspace. Both #codebase and `@workspace` can provide workspace context to Copilot
- When `#codebase` is used with another chat participant (`@terminal`, `@vscode`, `@github` etc.), it provides context to that participant. You can only use one participant at a time, so that is why it is needed.
- `#codebase` is still experimental, but the general consensus seem to be to just use `#codebase`. By itself it gives you your workspace context like you would want, and it can also be paired with any other chat participants (unlike `@workspace` which also requires a slash command and cannot be paired with any other participant)

8. Record baseline tests by running `#runInTerminal mvn test`, then run `#runInTerminal mvn jacoco:report` to explicitly generate the coverage report.
   Note coverage % and failing specs in a file called `docs/NOTES.md` (you will create this).
   > **Note**: Jacoco coverage report is generated automatically under `target/site/jacoco/index.html` when you run `mvn test`. Running `mvn jacoco:report` explicitly refreshes it if needed. Some tests are **intentionally failing** to demonstrate baseline code quality issues — this is expected at this stage.
9. Run `#runInTerminal mvn checkstyle:check` and capture warning counts; drop them into `docs/NOTES.md`.
   > **Note**: The build will complete even with violations (`failOnViolation=false`). The warnings printed to the console are the data you need — count and note them as your baseline.
10. Ask Copilot: `Draft a baseline metrics section for docs/NOTES.md summarizing current coverage, lint issues, and failing tests.` Accept and edit as needed.

## Phase 2 · 10 min · Prompting Mastery
11. Reference the main target file (e.g., [`DateUtils.java`](src/main/java/com/workshop/copilot/utils/DateUtils.java)) in Copilot Chat with this prompt:
    - `@workspace /explain this legacy #DateUtils.java file and any responsibilities, external dependencies, and hidden side effects.`
12. Follow up with the Critique then Create pattern:
    - `@workspace /explain Analyze this #DateUtils.java for code smells, performance risks, and security issues. Organize findings by severity.`
13. Create `docs/RISKS.md`, grouping items under Critical / High / Medium.
14. Run a targeted search (`#runInTerminal grep -r "DateUtils" src/main/java`) to see usage of DateUtils across the codebase:
    - `/explain From these call sites, what downstream impact should I watch for when refactoring?`
15. Use Golden Example prompt: `/explain Show me an idiomatic JUnit test for #OrderService.java from this repo I can mirror.` Link the example Copilot returns.

## Phase 3 · 7 min · Refactor Plan with Copilot
16. Ask Copilot: `@workspace /explain Create a numbered refactor plan for #DateUtils.java that addresses Critical items in docs/RISKS.md first, each with success criteria and required tests.`
17. Paste the response into `REFACTOR_PLAN.md`.
18. For each plan step, ask Copilot to generate verification criteria: `/explain For Step 1 above, how will I prove success via tests or metrics?`

## Phase 4 · 10 min · Test Generation Sprint
19. Before generating tests, verify actual method behavior first — this prevents Copilot from guessing wrong expected values:
    `/explain For each public method in #DateUtils.java, what does it return for valid non-null inputs? Give one concrete input and output example per method.`
    Then generate tests based on that confirmed behavior:
    `/tests Based on the behavior you just described, generate JUnit 5 happy-path unit tests for #DateUtils.java.`
20. Iterate: `/tests Add edge-case coverage for invalid dates, DST transitions, and leap years using JUnit 5.`
21. For time-sensitive logic, prompt: `/tests Show how to test date calculations with #src/main/java/com/workshop/copilot/utils/DateUtils.java using java.time.Clock or fixed instants.`
22. Run the suite (`#runInTerminal mvn test`); for any failing test, paste just that test's error into Copilot with `/fix` — one at a time. Before accepting the fix, check what Copilot changed: if it updated only the test assertion, accept it. If it changed production code, that test found a real bug — reject the fix and note the finding in `docs/NOTES.md`.
23. Log new coverage numbers in `docs/NOTES.md`; highlight >10% improvements.

## Phase 5 · 13 min · Implement One Safe Refactor
24. Open `REFACTOR_PLAN.md` and pick the lowest-risk step.
25. Ask Copilot Chat to implement that specific step:
    - `@workspace Implement Step [N] from my REFACTOR_PLAN.md on #DateUtils.java. Apply only that change — do not touch anything else.`
    Review the proposed diff carefully. Accept only if it matches your chosen step; if Copilot changed too much, ask it to narrow the scope before accepting.
26. Before accepting, ask Copilot to justify the change:
    - `@workspace /explain What did you change and why? What edge cases does this cover, and what could still slip through?`
    If the explanation reveals gaps or unintended side effects, refine with a follow-up prompt before accepting.
27. Keep diffs small; after each save, run `#runInTerminal mvn test`.
28. If Copilot's change fails tests, paste just the failing stack trace into Copilot with `/fix` — one failure at a time.

## Phase 6 · 10 min · Documentation and PR Prep
29. Ask Copilot: `/docs Generate Javadoc comments for the refactored public APIs using the project's conventions.`
30. Update `docs/RISKS.md` with resolved items; prompt Copilot: `/docs Summarize which risks were mitigated by the refactor in docs/RISKS.md.`
31. Generate a PR summary: `/docs Draft a pull request description including summary, testing, coverage changes, and risk assessment.` Save the output to `docs/PR_DRAFT.md` (create the file).
32. Request release notes: `/docs Create a short changelog entry for this refactor.` Append to `docs/CHANGELOG.md` (create the file).

## Phase 7 · 5 min · Sharing & Wrap-Up
33. Capture insights: `/docs Summarize the prompt patterns that worked best for me today for docs/NOTES.md.` Append to `docs/NOTES.md` under "Prompts That Worked."
34. Ask Copilot: `/docs Produce a retrospective bullet list (Start/Stop/Continue) for my next session.` Save to `docs/session-notes/<today's-date>.md` (create the file).
35. Run `git status`; ensure only intentional files changed.
36. Stage and commit: `git add .` → `git commit -m "Lab: Refactor DateUtils with Copilot assistance"`.
37. Push the branch and open a pull request. Paste Copilot’s PR draft into the description and edit as needed.
38. Post a 1–2 sentence insight in team Slack summarizing what Copilot accelerated for you.

---

## Quick Copilot Reference
- **Critique then Create**: `/explain Analyze…` → `/fix Refactor…`
- **Constrain by Interfaces**: `/fix Implementation must satisfy PaymentProcessor interface.`
- **Golden Example**: `/explain Mirror this test style for OrderService.`
- **Slash Commands**: `/explain`, `/tests`, `/fix`, `/docs`
- **Shortcuts**: Copilot Chat (`Cmd+/` • `Alt+/`), Inline Suggestion (`Cmd+I` • `Ctrl+I`)

## Troubleshooting w/ Copilot
- **No Response**: check login, network, IDE output; retry with smaller prompt.
- **Weird Suggestions**: remind Copilot of constraints ("Must not change external API").
- **Failing Tests**: paste error trace into `/fix` and request targeted patch.
- **Legacy Code Confusion**: break into chunks with `/explain` on specific methods.
- **`mvn checkstyle:check` shows no violations or fails with plugin error**: ensure you are running from the `java/foundations` directory.
- **`mvn test` shows unexpected `RuntimeException` wrapping `SQLException`**: this typically happens when `OrderServiceTest` is run without a Spring context — the tables haven't been created yet. This is a known issue in the baseline code and is itself a teaching point: the tests are not properly set up. Use Copilot to discuss why `@SpringBootTest` or proper mocking is needed.
- **Spring context fails to start with circular dependency error (`CustomerService` ↔ `OrderService`)**: `application.properties` includes `spring.main.allow-circular-references=true` to allow the context to start. The circular dependency is an intentional code smell — use Copilot to discuss why `@Lazy` alone does not resolve it in Spring Boot 2.6+ and what a proper architectural fix looks like.
- **`mvn test` seems to hang**: the `sendOrderConfirmationEmail` method in `OrderService` has an intentional `Thread.sleep(2000)` — this is a code smell to identify and discuss with Copilot, not a broken environment.

## Post-Session Homework
- Apply "Critique then Create" to a production method this week and record outcomes.
- Log coverage improvements and time saved using Copilot in your team tracker.
- Share one successful prompt in Slack to reinforce collective learning.

You now have an end-to-end Copilot-driven workflow. Execute deliberately, verify relentlessly, and let Copilot handle the scaffolding while you own the engineering judgment.

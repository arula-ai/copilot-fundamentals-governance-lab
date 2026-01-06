# Participant's Guide – Everyday Workflows: Comprehend, Refactor, Test

> **Purpose**: Give you a Copilot-first playbook for the 75-minute DevAssist lab. Every step below is an action item—check them off as you go.

---

## Phase 0 · 5 min · Power On Copilot
1. Launch your IDE (VS Code or IntelliJ) and verify GitHub Copilot Chat is signed in.
2. Open the Copilot Chat panel and pin it; you will use slash commands constantly.
3. Confirm Copilot inline completions are enabled (`Ctrl+,` → Extensions → GitHub Copilot → Enable). 
4. Warm up Copilot: ask `/explain What can you help me with during this lab?` to ensure the service responds.
5. Fork the correct repo track:
   - Angular: `git clone https://github.com/arula-ai/copilot-foundations-lab-angular.git`
   - Java:    `git clone https://github.com/arula-ai/copilot-foundations-lab-java.git`
7. Run `#getProjectSetupInfo` to get general information about the project and how to set it up
    - you can also click the settings icon to generate the copilot-instructions.md file
6. Run `#runInTerminal npm install` (Angular) or `#runInTerminal mvn clean install -DskipTests`

## Phase 1 · 10 min · Baseline Metrics
7. In Copilot Chat just type this: `#codebase`

`#codebase` is a chat variable that references relevant context in your chat prompt. When used, it adds pertinent workspace content to your prompt. For example, asking "How do I build this `#codebase`?" will provide steps to build the project by analyzing documentation, scripts, and configurations. - 

`@workspace` is a built-in chat participant that enhances chat interactions by providing domain-specific knowledge. For example, when you ask "`@workspace` how is authentication implemented?" it will provide an overview of the authentication flow with references to the relevant code.

- Used by itself, this is identical to @workspace. Both #codebase and `@workspace` can provide workspace context to Copilot
- When `#codebase` is used with another chat participant (`@terminal`, `@vscode`, `@github` etc.), it provides context to that participant. You can only use one participant at a time, so that is why it is needed.
- `#codebase` is still experimental, but the general consensus seem to be to just use `#codebase`. By itself it gives you your workspace context like you would want, and it can also be paired with any other chat participants (unlike `@workspace` which also requires a slash command and cannot be paired with any other participant)

8. Record baseline tests:
   - Angular: `#runInTerminal npx ng test --code-coverage --watch=false`
   - Java: `#runInTerminal mvn test jacoco:report`
   Note coverage % and failing specs in a file called `NOTES.md`.
9. Run `#runInTerminal npm run lint` or `#runInTerminal mvn -pl app checkstyle:check` and capture warning counts; drop them into `NOTES.md`.
10. Ask Copilot: `Draft a baseline metrics section for NOTES.md summarizing current coverage, lint issues, and failing tests.` Accept and edit as needed.

## Phase 2 · 10 min · Prompting Mastery
11. Reference the main target file (e.g., `#date-helper.service.ts`) into Copilot Chat with this prompt:
    - `@workspace /expalin this legacy #date-helper.service.ts file and any responsibilities,
    external dependencies and hidden side effects.
12. Follow up with the Critique then Create pattern:
    - `@workspace /explain Analyze this #date-helper.service.ts for code smells, performance risks, and security issues. Organize findings by severity.`
13. `Create RISKS.md, grouping items under Critical / High / Medium.`
14. Run a targeted search (`#runInTerminal rg "DateHelperService" src`) to see usage of DateHelperService accorss the codebase:
    - `/explain From these call sites, what downstream impact should I watch for when refactoring?`
15. Use Golden Example prompt: `/explain Show me an idiomatic Angular service test from this repo I can mirror.` Link the example Copilot returns.

## Phase 3 · 7 min · Refactor Plan with Copilot
16. Ask Copilot: `@workspace /explain Create a numbered refactor plan for #date-helper.service.ts that addresses Critical items in #RISKS.md first, each with success criteria and required tests.`
17. Paste the response into `REFACTOR_PLAN.md`;
18. For each plan step, ask Copilot to generate verification criteria: `/explain For Step 1 above, how will I prove success via tests or metrics?`

## Phase 4 · 10 min · Test Generation Sprint
19. Use Copilot `/tests Generate baseline unit tests for #date-helper.service focusing on happy paths.`
20. Iterate: `/tests Add edge-case coverage for invalid dates, DST transitions, and leap years. Use Angular TestBed.`
21. For async logic, prompt: `/tests Create tests using fakeAsync and tick for the timer-based code.`
22. Run the suite (`#runInTerminal ng test --code-coverage` or `#runInTerminal mvn test jacoco:report`); paste failing output back into Copilot with `/fix` to get remediation suggestions.
23. Log new coverage numbers in `NOTES.md`; highlight >10% improvements.

\

## Phase 5 · 13 min · Implement One Safe Refactor
24. Pick a `REFACTOR_PLAN.md` Step with Low risk.
25. Before editing, ask Copilot inline: `// Copilot: rewrite this method using RxJS switchMap and takeUntil.` Accept or adjust suggestions.
26. When Copilot proposes changes, demand explanations: `/explain Why did you choose switchMap here? Are there any regressions to watch for?`
27. Keep diffs small; after each save, run `#runInTerminal ng test --watch=false` or module-specific Maven tests.

`#runInTerminal npx nyc report --reporter=text-lcov`

`#runInTerminal npx ng test --code-coverage --watch=false`

`$runInTerminal open coverage/copilot-foundations-lab1-angular/index.html`

28. If Copilot's change fails tests, use `/fix` with the failing stack trace to generate patches.

## Phase 6 · 10 min · Documentation and PR Prep
29. Ask Copilot: `Generate docstring comments for the refactored public APIs`
30. Update `RISKS.md` with resolved items; prompt Copilot: ` Summarize which risks were mitigated by the refactor.`
31. Generate a PR summary: `Draft a pull request description including summary, testing, coverage changes, and risk assessment.`
32. Request release notes: `Create a short changelog entry for this refactor.` Append to `docs/CHANGELOG.md`.

## Phase 7 · 5 min · Sharing & Wrap-Up
33. Capture insights: `Summarize the prompt patterns that worked best for me today.` Append to `NOTES.md` under “Prompts That Worked.”
34. Ask Copilot: `Produce a retrospective bullet list (Start/Stop/Continue) for my next session.` Save to `docs/session-notes/<date>.md`.
35. Run `#runInTerminal git status`; ensure only intentional files changed.
36. Stage and commit: `#runInTerminal git add .` → `#runInTerminal git commit -m "Lab: Refactor date helper with Copilot assistance"`.
37. Push the branch and open a pull request. Paste Copilot’s PR draft into the description and edit as needed.

---

## Quick Copilot Reference
- **Critique then Create**: `/explain Analyze…` → `/fix Refactor…`
- **Constrain by Interfaces**: `/fix Implementation must satisfy PaymentProcessor interface.`
- **Golden Example**: `/explain Mirror this test style for OrderService.`
- **Slash Commands**: `/explain`, `/tests`, `/fix`
- **Copilot variables**: `#codebase`, `#file:name`
- **Shortcuts**: Copilot Chat (`Cmd+/` • `Alt+/`), Inline Suggestion (`Cmd+I` • `Ctrl+I`)

## Troubleshooting w/ Copilot
- **No Response**: check login, network, IDE output; retry with smaller prompt.
- **Weird Suggestions**: remind Copilot of constraints (“Must not change external API”).
- **Failing Tests**: paste error trace into `/fix` and request targeted patch.
- **Legacy Code Confusion**: break into chunks with `/explain` on specific methods.

## Post-Session Homework
- Apply "Critique then Create" to a production method this week and record outcomes.
- Log coverage improvements and time saved using Copilot in your tracker.
- Share one successful prompt in Slack to reinforce collective learning.
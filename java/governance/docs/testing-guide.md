# Stage 3 – Generate Security Tests with GitHub Copilot (Spring Boot)

## Objective
Create comprehensive automated tests that prove each remediation is effective and that new security controls behave as intended. Use JUnit 5, Spring Boot Test, MockMvc, Mockito, and Jacoco to deliver measurable evidence.

## Prerequisites
- Stage 2 remediation merged or on a feature branch.
- `docs/vulnerability-guide.md` items addressed in code.
- Initial plan for Stage 3 captured in `docs/plans/stage3-plan.md`.
- Baseline coverage and assumptions recorded in `docs/test-coverage.md`.

## Planning Checklist
1. In Copilot **Plan Mode**, review the remediated files and decide which behaviours require tests (happy path, error conditions, malicious input).
2. Document targeted classes, scenarios, fixtures, and tooling in `docs/plans/stage3-plan.md`.
3. Log open questions (e.g., dependency injection, data setup) in `docs/workflow-tracker.md`.

## Test Backlog

### 1. Authentication Controller Tests
- **File:** `src/test/java/com/github/copilot/lab/controller/AuthControllerTest.java`
- **Goals:**
  - Use MockMvc with Spring Security test support.
  - Verify successful login regenerates the session, issues a signed JWT (or secure session cookie), and omits sensitive data from responses/logs.
  - Ensure failed login attempts return generic error messages, do not leak stack traces, and increment rate-limiting counters (if implemented).
  - Test edge cases: locked account, expired password, missing credentials.
- **Copilot Prompt Example:**
  ```
  Following .github/instructions/java.instructions.md, generate JUnit tests for AuthController that:
  - use MockMvc,
  - verify session regeneration,
  - assert no plaintext credentials in logs or responses,
  - cover failed login scenarios,
  - use Mockito to mock AuthenticationService.
  ```

### 2. File Storage Service Tests
- **File:** `src/test/java/com/github/copilot/lab/service/FileStorageServiceTest.java`
- **Goals:**
  - Assert path normalisation prevents directory traversal (`../` sequences) and rejects improperly encoded names.
  - Validate size, MIME type, and extension checks.
  - Ensure quarantine/scanning logic is invoked and infected files are not accessible via the public path.
  - Confirm audit records/logs capture uploads without PII.
  - Use `@TempDir` to isolate filesystem interactions.

### 3. Report Controller Tests
- **File:** `src/test/java/com/github/copilot/lab/controller/ReportControllerTest.java`
- **Goals:**
  - Test SQL queries replaced with repositories/prepared statements, preventing injection (use parameter binding assertions or mocks).
  - Validate export format allow-list: allowed formats succeed; disallowed formats return 400.
  - Confirm authorisation annotations or service-level checks prevent unauthorised access (403).
  - Ensure HTML rendered in Thymeleaf uses `th:text` encoding (assert encoded output or use integration test hitting template).
  - Test auditing is invoked when reports are exported.

### 4. Cross-Cutting Tests (Optional but Encouraged)
- Security headers filter integration test (introduced in Stage 4).
- Audit trail persistence tests (ensures data integrity and sanitisation).
- Regression tests for previously discovered vulnerabilities (XSS payloads, malicious files).

## Running Tests
```bash
# Execute unit & integration tests
mvn test

# Full verification plus Jacoco report
mvn verify

# Open the HTML coverage report
open target/site/jacoco/index.html  # macOS
# or on Linux:
xdg-open target/site/jacoco/index.html
```

## Coverage & Evidence Targets
- [ ] Jacoco instruction coverage ≥ 80% (or variance justified in `docs/test-coverage.md`).
- [ ] Critical flows (auth, file uploads, report exports) covered for both success and failure paths.
- [ ] All new tests deterministic and isolated (no external network calls, real file system outside `@TempDir`).
- [ ] Test names describe security behaviour being validated.
- [ ] Evidence of `mvn test`/`mvn verify` recorded in `docs/test-coverage.md` and summarised in `docs/workflow-tracker.md`.

## Testing Tips
- Use `@AutoConfigureMockMvc` for controller tests; inject `MockMvc`.
- Leverage Spring Security test utilities (`with(user("...").roles("..."))`) to simulate roles.
- Use Mockito/`@MockBean` to isolate external systems (mail, storage, scanners).
- For error handling, assert both HTTP status codes and response payloads.
- When testing logging, use `@ExtendWith(OutputCaptureExtension.class)` to capture output and ensure secrets are absent.
- Encourage Copilot with precise prompts referencing guardrails and expected assertions.

## Common Issues & Resolutions
| Issue | Resolution |
| --- | --- |
| Coverage below 80% | Focus on untested branches identified in the Jacoco HTML report; add negative-case tests. |
| Flaky tests due to time | Use deterministic clock implementations (`Clock` injection) and fixed timestamps. |
| MockMvc 401/403 responses | Ensure tests load security configuration and authenticate via Spring Security test support. |
| Temporary files leaking | Use `@TempDir` and close all streams; verify clean-up in `@AfterEach`. |
| Copilot generating front-end (Angular/Jasmine) code | Reiterate the Spring Boot/JUnit context in the prompt and attach relevant Java files. |

## Exit Criteria
- Tests added/updated and committed.
- Coverage report generated and referenced in documentation.
- `docs/test-coverage.md` lists commands, coverage deltas, and outstanding risks.
- `docs/workflow-tracker.md` contains a Stage 3 summary with next steps.
- Copilot usage documented in `COPILOT_USAGE.md`.

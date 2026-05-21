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

> **Prerequisite — add Spring Security before writing controller tests.** The starter `pom.xml` does not include Spring Security. The MockMvc security helpers used below (`with(user("...").roles("..."))`, `@WithMockUser`, `springSecurity()` configurer) will not compile until you add the following to `pom.xml` during Stage 2 remediation:
>
> ```xml
> <dependency>
>     <groupId>org.springframework.boot</groupId>
>     <artifactId>spring-boot-starter-security</artifactId>
> </dependency>
> <dependency>
>     <groupId>org.springframework.security</groupId>
>     <artifactId>spring-security-test</artifactId>
>     <scope>test</scope>
> </dependency>
> ```
>
> Sections 1 (AuthService) and 2 (SessionRepository) can be written without these dependencies — they use plain JUnit + Mockito. Sections 3 (controllers) and 4 (template/view) require the additions above.

### 1. AuthService Tests
- **File:** `src/test/java/com/github/copilot/governancelab/service/AuthServiceTest.java` (expand the existing placeholder)
- **Goals:**
  - Verify successful login uses a password encoder (BCrypt) — never the plaintext or Base64-encoded form.
  - Assert that `AuthResponse` no longer contains an `encodedPassword` field (or that the field is null).
  - Verify tokens are signed (JWT) or opaque random values — assert tokens do **not** contain the username substring.
  - Verify `hasRole(...)` returns **false** for unknown tokens (current bug returns `true`).
  - Verify `updateProfile(...)` ignores caller-supplied `apiKey` and `password` fields (mass-assignment fix).
  - Verify `updateProfile(...)` against an unknown token returns 401 / throws, instead of silently creating an `anonymous` profile.
  - Verify `logout(...)` clears the persisted session record on disk, not just the in-memory map.
  - Confirm no `System.out.*` calls remain and that SLF4J output does not contain plaintext passwords.
- **Copilot Prompt Example:**
  ```
  Following .github/instructions/java.instructions.md, generate JUnit 5 tests for AuthService that:
  - use Mockito for the SessionRepository dependency,
  - assert tokens do not contain usernames or other PII,
  - assert AuthResponse.encodedPassword is null,
  - assert hasRole returns false for unknown tokens (regression for the .orElse(true) bug),
  - cover updateProfile mass-assignment defence (apiKey / password fields ignored),
  - use @ExtendWith(OutputCaptureExtension.class) to assert no plaintext credentials in logs.
  ```

### 2. SessionRepository Tests
- **File:** `src/test/java/com/github/copilot/governancelab/repository/SessionRepositoryTest.java`
- **Goals:**
  - Confirm credentials are **never** written to disk in reversible form. If session state is persisted at all, assert the on-disk payload is encrypted or hashed.
  - Use `@TempDir` to isolate the storage location; verify the file does not appear under `target/`.
  - Verify `IOException` paths surface through logging (no silent `catch ... ignored`).
  - Verify `dumpSessions()` (if it survives remediation) requires an authenticated admin caller, or is removed entirely.
  - Verify sessions have a TTL and are evicted; assert behaviour after expiry.

### 3. Controller (ApiController + PageController) Tests
- **Files:**
  - `src/test/java/com/github/copilot/governancelab/controller/ApiControllerTest.java`
  - `src/test/java/com/github/copilot/governancelab/controller/PageControllerTest.java`
- **Goals (ApiController):**
  - Use `@AutoConfigureMockMvc` with Spring Security test support.
  - Assert `POST /api/login` with an empty body returns 400 (default `guest`/`password` accepted by current code is a bug).
  - Assert no `X-Debug-Token` or `X-Encoded-Password` headers appear on any response.
  - Assert auth cookies set `HttpOnly`, `Secure`, and `SameSite=Strict`.
  - Assert `/api/user` rejects tokens supplied as `?token=` query parameters (must require `Authorization` header).
  - Assert `/api/upload` rejects filenames containing `..` or absolute paths (path traversal regression).
  - Assert `/api/upload` enforces a maximum file size and a MIME/extension allow-list.
  - Assert `/api/upload` does **not** echo file contents back in the response body.
  - Assert `/api/debug/sessions` is removed or requires the `ADMIN` role.
  - Assert 401 responses never echo the offending token back to the caller.
- **Goals (PageController):**
  - Assert `HttpSession` no longer contains `plainPassword`, `encodedPassword`, or `loginTimestamp` attributes after a successful login.
  - Assert `returnUrl` open-redirect protection: absolute URLs and protocol-relative URLs are rejected.
  - Assert the session ID is **regenerated** on login (session-fixation defence) — capture pre- and post-login session IDs and assert inequality.
  - Assert CSRF tokens are required on `POST /login`, `POST /profile`, `POST /logout`.
  - Assert `debugMode` and `systemInfo` are absent from non-authenticated responses (or removed entirely).

### 4. Template / View Tests (dashboard.html)
- **File:** `src/test/java/com/github/copilot/governancelab/controller/DashboardViewTest.java`
- **Goals:**
  - Render the dashboard with a malicious `bio` payload (e.g., `<script>alert(1)</script>`) and assert the rendered HTML contains the escaped form (`&lt;script&gt;...`), confirming `th:utext` has been replaced with `th:text`.
  - Assert `plainPassword`, `encodedPassword`, and raw `apiKey` are no longer present in the rendered HTML.
  - Assert the polling script no longer transmits the token via a query parameter.

### 5. Cross-Cutting Tests (Optional but Encouraged)
- Security headers filter integration test (introduced in Stage 4).
- Audit trail persistence tests for login, profile change, logout, and upload events.
- Rate limiting regression tests on `/api/login` and `/login`.
- Regression tests for the original Stage 1 vulnerabilities (XSS payloads in `bio`, path-traversal filenames, empty-body login).

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

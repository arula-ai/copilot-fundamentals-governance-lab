# Contributing to the Copilot Governance Lab (Spring Boot)

Thanks for investing in the Spring Boot edition of the GitHub Copilot Governance Lab! This project exists to help teams practice secure, well-documented AI-assisted development. Contributions should reinforce those goals: follow guardrails, leave an audit trail, and teach future participants.

## Getting Started
1. Fork this repository and clone your fork locally.
2. Run `./scripts/setup-lab.sh` to verify Java/Maven prerequisites and perform an initial `mvn validate`.
3. Create a feature branch (`git checkout -b feat/<short-description>`).
4. Review `.github/instructions/java.instructions.md`, `LAB_ACTION_GUIDE.md`, and `docs/workflow-guide.md` before making changes.

## Development Workflow

### Before You Code
- Ensure your IDE has GitHub Copilot enabled and configured to respect repository instructions.
- Pull the latest changes from `origin/master`.
- Capture assumptions, risks, and plan-of-attack in `docs/workflow-tracker.md` and a plan file under `docs/plans/` when applicable.

### Working on Changes
1. Follow the secure coding practices documented in `.github/instructions/java.instructions.md`.
2. Keep controllers thin and push business logic into services that can be unit tested.
3. Prefer constructor injection, immutable DTOs, and explicit validation (`@Valid`, constraint annotations).
4. Sanitize all user input before rendering in Thymeleaf templates (`th:text`).
5. Keep logs free of credentials, tokens, or PII.

### Required Commands
Run these locally before opening a pull request:
```bash
mvn clean
mvn test
mvn verify                     # generates Jacoco
mvn dependency:tree            # capture dependency review notes
./scripts/run-all-checks.sh    # optional but encouraged for end-to-end validation
```
Record the command results, coverage metrics, and residual risks in `docs/test-coverage.md` and `docs/workflow-tracker.md`.

### Using GitHub Copilot
- Always reference relevant guardrails in your prompts (e.g., “Following `.github/instructions/java.instructions.md`…”).
- Provide file context so Copilot understands the surrounding Spring Boot patterns.
- Review every suggestion for security, correctness, and adherence to the lab style.
- Document Copilot usage in `COPILOT_USAGE.md` (percentage, prompts, acceptance criteria).
- Never accept suggestions that introduce hard-coded secrets, disable validation, or bypass logging standards.

## Pull Request Expectations
1. Update documentation (`README.md`, `docs/`, `VULNERABILITIES.md`, `FIXES.md`, `COPILOT_USAGE.md`) as needed.
2. Complete the PR template checklists—including Copilot usage declaration and coverage metrics.
3. Attach evidence of the Maven commands you ran (summaries or links to tracker entries).
4. Ensure GitHub Actions (quality gates & security scan) pass.
5. Request review from a maintainer or practice buddy.

### PR Checklist
- [ ] Changes follow `.github/instructions/java.instructions.md`.
- [ ] `mvn clean verify` passes locally.
- [ ] Jacoco coverage ≥ 80% (or exception documented in `docs/test-coverage.md`).
- [ ] `mvn dependency:tree` output reviewed; risky libraries noted.
- [ ] `VULNERABILITIES.md` / `FIXES.md` / `COPILOT_USAGE.md` updated if applicable.
- [ ] No debug logging (`System.out.println`, `printStackTrace`, etc.).
- [ ] Documentation and tracker entries refreshed.

## Code Review Guidelines

### Reviewers Should
- Confirm secure coding standards (validation, encoding, logging hygiene, error handling).
- Verify Copilot-generated code is justified and free of hidden vulnerabilities.
- Demand evidence of tests, coverage, and dependency review.
- Check that documentation artifacts were updated.
- Provide actionable feedback organized by severity.

### Authors Should
- Respond promptly to review comments.
- Explain Copilot prompts/decisions when asked.
- Update code and documentation to address findings.
- Request re-review once outstanding items are resolved.

## Security & Compliance
- Do not report vulnerabilities via public issues—email `security@example.com`.
- Never commit secrets, access tokens, or sample certificates.
- Keep dependencies up to date; log results of `mvn dependency:tree` and scanners.
- Use OWASP Top 10 as your baseline for risk discussions.
- Ensure logs, error messages, and HTTP responses avoid leaking implementation details.

## Testing Standards
- Every code change requires unit or integration tests. Place tests under `src/test/java/...`.
- Use JUnit 5 + Spring Boot Test; mock external systems with Mockito or `@MockBean`.
- Validate negative/edge cases: invalid inputs, exceptions, unauthorized access.
- Keep tests deterministic (no real network/disk IO without explicit justification).
- For asynchronous or scheduled work, use Spring testing utilities and virtual clocks.

### Helpful Commands
```bash
mvn -Dtest=<ClassNameTest> test      # Run targeted tests
mvn verify -DskipITs                 # Skip slow integration tests (only with approval)
mvn jacoco:report                    # Explicitly regenerate coverage report
```

## Style Guide Highlights
- Package names use `com.github.copilot.lab.<feature>`.
- Use `@ConfigurationProperties` for new settings; document them in `README.md`.
- Prefer `ResponseEntity<T>` for controllers; centralize exception handling in `@ControllerAdvice`.
- Use SLF4J (`private static final Logger log = LoggerFactory.getLogger(...)`).
- Avoid static state unless specifically justified.
- Keep methods concise (<30 lines) and classes focused on a single responsibility.

## Documentation Expectations
- Plans under `docs/plans/` describe scope, risks, and validation steps.
- `docs/workflow-tracker.md` gets an entry after every stage or substantive work session.
- Coverage, lint, and audit outcomes belong in `docs/test-coverage.md`.
- Update `VULNERABILITIES.md` and `FIXES.md` so the audit trail stays current.
- Explain deviations from guardrails (temporary mitigations, accepted risks) in the tracker.

## Commit Message Convention
```
<type>(<scope>): <short summary>

<Longer body explaining motivation, evidence, and guardrails touched>

Refs: <issue/plan links, tracker entries>
```
Common types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `build`.

## Questions?
- Review the guides in `docs/` and the lab action guide.
- Search open issues or discussions first.
- Reach out to maintainers via the preferred team channel.
- When in doubt, document your assumption in `docs/workflow-tracker.md` and proceed transparently.

By contributing, you agree that your submissions will be licensed under the project’s existing license and that you will preserve the governance evidence required by the lab.

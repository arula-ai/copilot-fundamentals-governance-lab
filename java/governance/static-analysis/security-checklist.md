# Security Checklist for Spring Boot Applications

Use this checklist before declaring remediation complete or shipping a new secure feature. It aligns with the guardrails in `.github/instructions/java.instructions.md`, `LAB_ACTION_GUIDE.md`, and the governance workflows under `docs/`.

## Authentication & Authorization
- [ ] Authentication endpoints enforce HTTPS and reject insecure protocols.
- [ ] Passwords handled exclusively via secure hash (e.g., BCryptPasswordEncoder); never logged or stored in plain text.
- [ ] Sessions are regenerated on login and invalidated on logout.
- [ ] JWTs (if issued) are signed, include expiration, and are stored outside client-side scripts.
- [ ] Authorization rules defined centrally (Spring Security config) with least privilege defaults.
- [ ] Role/permission checks performed on the server; no trust in client-provided claims.

## Input Validation & Sanitization
- [ ] Controllers accept DTOs annotated with `@Valid` and explicit constraint annotations (`@NotBlank`, etc.).
- [ ] Custom validators guard business-specific invariants.
- [ ] File uploads enforce allow-listed extensions, MIME types, and size limits before saving.
- [ ] Path inputs are normalized and rejected if they escape designated directories.
- [ ] Template rendering uses `th:text` or explicit encoding to prevent XSS.
- [ ] SQL queries use prepared statements, Spring Data, or JPA Criteria (no string concatenation).

## Data Protection
- [ ] Secrets, API keys, and sensitive configs stored via environment variables or externalized config (no plaintext in source).
- [ ] Sensitive responses omit internal identifiers or implementation details.
- [ ] Error messages presented to users are generic; stack traces logged server-side.
- [ ] Personally identifiable information (PII) and credentials never written to logs.
- [ ] TLS termination enforced for all ingress points; HTTP redirected to HTTPS.
- [ ] Data at rest protected via database/storage controls appropriate to the workload.

## Logging, Monitoring & Auditing
- [ ] SLF4J used for logging with appropriate log levels (`info`, `warn`, `error`).
- [ ] Security-relevant events (auth failures, permission denials) logged without exposing secrets.
- [ ] Audit trail captures who accessed sensitive resources and when.
- [ ] Structured logging or MDC used where correlation IDs are required.
- [ ] Log rotation/retention configured to prevent disk exhaustion.

## Error Handling & Stability
- [ ] Centralized exception handling via `@ControllerAdvice` provides consistent HTTP responses.
- [ ] Input parsing errors mapped to 400-class responses; access issues map to 401/403.
- [ ] Blocking IO and external calls include timeouts and resilience measures (retry/backoff/circuit breakers where appropriate).
- [ ] Thread pools sized appropriately; no unbounded executor creation.
- [ ] Fallbacks documented for downstream outages.

## Dependency & Build Hygiene
- [ ] `mvn dependency:tree` reviewed; vulnerable or deprecated libraries documented and scheduled for update.
- [ ] Build fails on CVSS-high vulnerabilities (via `mvn versions` plugins, SCA tooling, etc.).
- [ ] Unused dependencies removed from `pom.xml`.
- [ ] Jacoco coverage report reviewed; high-risk areas meeting ≥80% coverage or explicitly justified.
- [ ] Dockerfiles (if any) use minimal base images and pin versions.

## Testing & Verification
- [ ] JUnit/Spring Boot tests cover authentication, authorization, and error paths.
- [ ] Integration tests protect against regression in file uploads, SQL queries, and template rendering.
- [ ] Negative tests exercise invalid input, malformed files, and injected payloads.
- [ ] `mvn clean verify` executed and passing; results recorded in `docs/test-coverage.md`.
- [ ] `./scripts/run-all-checks.sh` and `./scripts/generate-report.sh` executed when required by the stage.
- [ ] Manual exploratory testing performed on critical flows; findings logged.

## Deployment Readiness
- [ ] Configuration documented in `README.md` or environment runbooks.
- [ ] Health checks and readiness probes implemented (if deploying to orchestrated environments).
- [ ] Observability hooks (metrics, tracing) do not leak sensitive data.
- [ ] Rollback plan documented for high-risk changes.
- [ ] Governance artifacts (`VULNERABILITIES.md`, `FIXES.md`, `COPILOT_USAGE.md`, `docs/workflow-tracker.md`) up to date.

## Copilot-Specific Checks
- [ ] Prompts referenced team guardrails; accepted suggestions reviewed line by line.
- [ ] Generated code conforms to Spring Boot idioms (constructor injection, validation, logging).
- [ ] Generated tests assert meaningful behavior and fail when vulnerabilities reappear.
- [ ] Copilot usage recorded in `COPILOT_USAGE.md` with prompt summaries and acceptance criteria.

## Sign-Off
- [ ] Peer review complete; findings resolved or documented.
- [ ] Security validation (Need Review/Validation modes) recorded in `docs/workflow-tracker.md`.
- [ ] Governance report updated (`governance-report.md`) and attached evidence reviewed.
- [ ] Release/PR approved only after all required boxes above are checked or formally waived with rationale.

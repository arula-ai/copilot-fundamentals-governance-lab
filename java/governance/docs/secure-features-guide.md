# Stage 4 – Implement Secure Features with GitHub Copilot (Spring Boot)

## Objective
Move beyond remediation and add proactive security controls that harden the application. Use Copilot to assist, but anchor every decision in `.github/instructions/java.instructions.md`, OWASP guidance, and the governance evidence you have already gathered.

## Prerequisites
- Stages 1–3 complete (vulnerabilities catalogued, fixes implemented, tests in place).
- `docs/workflow-tracker.md` updated with the latest remediation status.
- Coverage gaps and remaining risks captured in `docs/test-coverage.md`.

## Planning Checklist
Before you touch code:
1. Launch **Plan Mode** and draft `docs/plans/stage4-plan.md` (or similar) that covers:
   - Target classes and packages.
   - New configuration properties or secrets.
   - Validation/test strategy.
   - Documentation updates (README, tracker, security docs).
2. Confirm the plan references `.github/instructions/java.instructions.md`, `docs/vulnerability-guide.md`, and this guide.
3. Log assumptions, dependencies, and open questions in `docs/workflow-tracker.md`.

## Feature Backlog

### 1. Security Headers Filter
Create a servlet filter that enforces defensive HTTP headers on every response.

- **Suggested file:** `src/main/java/com/github/copilot/lab/security/SecurityHeadersFilter.java`
- **Requirements:**
  - Add headers: `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection` (legacy), `Referrer-Policy`, and a restrictive `Content-Security-Policy`.
  - Make the filter conditional on configuration (`security.headers.enabled=true` by default).
  - Ensure the filter runs once per request (extend `OncePerRequestFilter`).
  - Provide structured logging when headers are applied or skipped.
- **Validation:**
  - Add integration tests (`SecurityHeadersFilterTest`) using MockMvc to assert headers appear.
  - Document new properties in `README.md` and `application.properties`.

### 2. Audit Trail Service
Provide an auditable record for sensitive operations such as report exports and file uploads.

- **Suggested files:**
  - `src/main/java/com/github/copilot/lab/audit/AuditTrailService.java`
  - `src/main/java/com/github/copilot/lab/audit/AuditEvent.java` (immutable value object)
- **Requirements:**
  - Record who performed the action, the resource identifier, timestamp, IP address, and outcome.
  - Store events in a durable store (JPA entity or append-only log). If persistence is out of scope, implement a pluggable interface with a stub repository and document the TODO.
  - Expose helper methods controllers can call (`recordReportExport`, `recordFileUpload`, etc.).
  - Ensure logging sanitises user input and uses MDC correlation IDs when available.
- **Validation:**
  - Unit tests verifying event creation, sanitisation, and repository interaction (use Mockito).
  - Update controllers to invoke the audit service; tests should assert audit calls happen.

### 3. File Scanning & Quarantine Pipeline
Augment file upload handling with antivirus scanning and quarantine support.

- **Suggested files:**
  - `src/main/java/com/github/copilot/lab/files/FileScanService.java`
  - `src/main/java/com/github/copilot/lab/files/FileQuarantineException.java`
- **Requirements:**
  - Provide a method `scan(InputStream stream, String originalFilename)` that returns a `ScanResult` enum (`CLEAN`, `INFECTED`, `UNKNOWN`).
  - Integrate with a pluggable scanner (stub using configuration flag and log warnings if no scanner configured).
  - When a file is flagged, move it to a quarantine directory outside the web root and alert via logging/AuditTrailService.
  - Enforce a maximum file size and checksum logging without exposing raw data.
- **Validation:**
  - Tests covering clean/dirty/unknown responses.
  - Integration tests ensuring uploads are rejected or quarantined; use temporary directories.
  - Document quarantine behaviour and configuration in `README.md`.

### 4. Report Export Policy
Enforce least privilege and guard against untrusted export formats.

- **Suggested files:**
  - `src/main/java/com/github/copilot/lab/report/ReportExportPolicy.java`
  - `src/main/java/com/github/copilot/lab/report/ReportFormat.java`
- **Requirements:**
  - Maintain an allow-list of export formats (e.g., PDF, CSV) with associated MIME types and generator beans.
  - Validate `reportId` ownership before exporting (hook into AuditTrailService for logging).
  - Deny exports when the requesting user lacks required roles (Spring Security `@PreAuthorize` or service-level checks).
  - Provide defensive defaults if configuration references unknown formats.
- **Validation:**
  - Unit tests verifying the allow-list and permission checks.
  - Integration test ensuring denied requests return 403 and do not hit the exporter.

### 5. Configuration Hardening
Externalise newly introduced settings and provide secure defaults.

- Consolidate security properties under `security.*` inside `application.properties`.
- Provide `@ConfigurationProperties` binder classes for type-safe access.
- Ensure sensitive defaults are not committed (use placeholders and document expected environment variables).
- Update `README.md` and `docs/workflow-tracker.md` with configuration instructions and risk notes.

## Execution Guidance
- Work in Copilot **Agent Mode** while implementing features; switch to **Need Review Mode** for self-review slices.
- Leverage Copilot suggestions but review for Spring idioms (constructor injection, `ResponseEntity`, logging).
- Maintain small commits with clear messages referencing plan sections and tracker updates.
- Keep `VULNERABILITIES.md` and `FIXES.md` aligned: note which vulnerabilities each feature mitigates or monitors.

## Testing Expectations
- Unit tests for services/utilities (`src/test/java/...`).
- MockMvc or WebTestClient tests for filters and controllers.
- Jacoco coverage should remain ≥80%; update `docs/test-coverage.md` with deltas.
- Run `mvn clean verify` after major feature branches.
- Execute `./scripts/run-all-checks.sh` before declaring Stage 4 complete.

## Documentation & Evidence
- Update `docs/workflow-tracker.md` after each major step (planning, implementation, validation).
- Summarise configuration and behavioural changes in `README.md`.
- Capture Copilot usage in `COPILOT_USAGE.md`.
- Note new security controls and monitoring hooks in `SECURITY.md` when preparing submission.

## Hand-Off
When Stage 4 work is done:
1. Run the Hand-Off prompt in Summarizer Mode to append a concise summary to `docs/workflow-tracker.md`.
2. Highlight remaining tasks (e.g., production scanner integration, policy tuning).
3. Share evidence locations so the next contributor—or reviewer—can continue without re-reading the entire history.

# Stage 3 – Generate Security Tests with GitHub Copilot

## Objective
Use GitHub Copilot to generate comprehensive security tests for your fixed components.

## Prerequisites
- Completed Stage 2 (remediated vulnerable components)
- Fixed components are passing ESLint checks
- Understanding of Jasmine and Karma testing

## Instructions

### Plan Before Generating Tests

- Select the **angular-planning** agent from the Agent dropdown in Copilot Chat (see `.github/agents/angular-planning.agent.md`) to review the fixed components, existing tests, and repository quality gates.
- Draft a Markdown plan saved to `docs/plans/stage3-plan.md` (or similar) that lists the security behaviors to cover, targeted spec files, fixtures/mocks required, and verification commands (coverage, linting).
- Call out in the plan how you will document test coverage and any remaining risks. Only begin writing or generating tests after this plan is saved.

### Step 1: Generate AuthService Tests

Create or update `src/app/services/auth.service.spec.ts` and use this prompt with Copilot:

**Prompt:**
```
Following our team instructions, generate comprehensive Jasmine tests for AuthService that:
1. Test the login method with mock HttpClient
2. Verify no sensitive data is stored in localStorage
3. Test the logout method clears all data
4. Test error handling scenarios
5. Verify proper TypeScript types
6. Use HttpTestingController for HTTP mocking
7. Achieve >80% code coverage
```

**Required Test Cases:**
- Should be created
- Login should call HTTP POST with credentials
- Login should handle successful response
- Login should handle error response
- Should not store passwords in localStorage
- Logout should clear all authentication data
- isAuthenticated should return correct status
- Should handle network errors gracefully

### Step 2: Generate LoginComponent Tests

Create or update `src/app/components/login/login.component.spec.ts` with this prompt:

**Prompt:**
```
Following our team instructions, generate Jasmine tests for LoginComponent that:
1. Use TestBed for component testing
2. Test form validation
3. Verify XSS prevention (no innerHTML with user data)
4. Test redirect URL validation
5. Test error message display (without exposing details)
6. Test accessibility (ARIA labels)
7. Mock AuthService and Router
```

**Required Test Cases:**
- Should create the component
- Form should be invalid when empty
- Should validate email format
- Should validate password requirements
- Should prevent XSS in error messages
- Should validate redirect URLs
- Should call AuthService.login on submit
- Should have proper ARIA labels
- Should navigate on successful login

### Step 3: Generate UserProfileComponent Tests

Create or update `src/app/components/user-profile/user-profile.component.spec.ts` with this prompt:

**Prompt:**
```
Following our team instructions, generate Jasmine tests for UserProfileComponent that:
1. Test component lifecycle (ngOnInit, ngOnDestroy)
2. Verify no memory leaks (proper cleanup)
3. Test DomSanitizer usage for user content
4. Test file upload validation
5. Mock HttpClient calls
6. Verify no sensitive data in template
7. Test error handling
```

**Required Test Cases:**
- Should create the component
- Should sanitize user-generated content
- Should cleanup subscriptions on destroy
- Should validate file type on upload
- Should validate file size on upload
- Should handle HTTP errors gracefully
- Should not display sensitive data (API keys)
- Should use Renderer2 for DOM manipulation

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Check Coverage Report
```bash
open coverage/copilot-governance-lab-angular/index.html
```

## Success Criteria

### Coverage Targets
- [ ] Statements: ≥ 80%
- [ ] Branches: ≥ 80%
- [ ] Functions: ≥ 80%
- [ ] Lines: ≥ 80%

### Quality Checks
- [ ] All tests passing
- [ ] No skipped tests (no `xit` or `xdescribe`)
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] Proper use of beforeEach/afterEach
- [ ] All HTTP calls mocked
- [ ] No actual DOM manipulation in tests

### Security Test Coverage
- [ ] XSS prevention tested
- [ ] Input validation tested
- [ ] Error handling tested
- [ ] Data sanitization tested
- [ ] Memory leak prevention tested
- [ ] Access control tested

## Test Structure Example

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not store password in localStorage', () => {
    // Arrange
    const credentials = { username: 'test', password: 'secret' };
    
    // Act
    service.login(credentials.username, credentials.password).subscribe();
    const req = httpMock.expectOne('/api/login');
    req.flush({ token: 'abc123' });
    
    // Assert
    expect(localStorage.getItem('pwd')).toBeNull();
    expect(localStorage.getItem('password')).toBeNull();
  });
});
```

## Tips for Test Generation

1. **Be Specific:** Tell Copilot about security concerns to test
2. **Reference Standards:** Mention team instructions and coverage requirements
3. **Iterate:** Generate basic tests first, then add security-specific tests
4. **Review:** Verify that generated tests actually test the right things
5. **Run Frequently:** Run tests after each generation to catch issues early

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Tests timeout | Use `fakeAsync` and `tick()` for async operations |
| HTTP calls not mocked | Use `HttpTestingController` |
| Component not rendering | Check `fixture.detectChanges()` is called |
| Coverage too low | Use Istanbul/nyc coverage reports to find gaps |
| Flaky tests | Avoid `setTimeout`, use `fakeAsync` instead |

## Next Steps
After achieving >80% coverage:
1. Review coverage report for gaps
2. Add edge case tests
3. Document security test patterns and outcomes in `docs/test-coverage.md` and `docs/workflow-tracker.md`
4. Proceed to Stage 4 (implement new secure features using `docs/secure-features-guide.md`)

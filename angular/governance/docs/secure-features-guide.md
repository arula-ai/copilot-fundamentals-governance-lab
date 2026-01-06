# Stage 4 – Implement Secure Features with GitHub Copilot

## Objective
Use GitHub Copilot with team instructions to implement new secure features following security best practices.

## Prerequisites
- Completed Stage 3 (security test generation)
- GitHub Copilot enabled in your IDE
- Understanding of team security guidelines

## Overview
In this exercise, you'll implement new security features from scratch using Copilot while following your team's security guidelines. This demonstrates how Copilot can help you write secure code proactively, not just fix existing vulnerabilities.

## Instructions

### Plan Before Building Features

- Select the **angular-planning** agent from the Agent dropdown in Copilot Chat (configured via `.github/agents/angular-planning.agent.md`) to outline the secure feature work ahead: target files, security requirements, dependencies, and documentation needs.
- Record the strategy—covering each component/service to build, validation steps, testing approach, and governance artifacts—in a Markdown plan saved to `docs/plans/stage4-plan.md` (or similar).
- Confirm the plan references the relevant guidance (`.github/instructions/angular.instructions.md`, `SECURITY.md`, quality gates) before you begin implementing code.

### Step 1: Implement JWT Interceptor
Create a secure HTTP interceptor to handle JWT tokens.

**File to create:** `src/app/interceptors/jwt.interceptor.ts`

**Prompt to use with Copilot:**
```
Following our team instructions in .github/instructions/angular.instructions.md, 
create an Angular HTTP interceptor that:
1. Adds JWT token from secure storage to outgoing requests
2. Handles 401 responses by redirecting to login
3. Does not log tokens or sensitive headers
4. Validates token expiration before adding to request
5. Handles token refresh when expired
6. Uses proper TypeScript types
```

**Expected Implementation:**
- Intercepts HTTP requests
- Retrieves token from secure storage (not localStorage)
- Adds Authorization header only for authenticated routes
- Handles token expiration gracefully
- Redirects to login on 401 errors
- No console.log of sensitive data
- Proper error handling

**Test the interceptor:**
```bash
npm run lint
npm test -- --include='**/jwt.interceptor.spec.ts'
```

### Step 2: Implement Route Guard
Create an authentication guard to protect routes.

**File to create:** `src/app/guards/auth.guard.ts`

**Prompt to use with Copilot:**
```
Following our team instructions, create an Angular CanActivate guard that:
1. Checks if user is authenticated
2. Validates token is not expired
3. Redirects to login with safe returnUrl
4. Does not expose authentication details in console
5. Handles edge cases (missing token, invalid token)
6. Uses proper TypeScript types and interfaces
```

**Expected Implementation:**
- Implements CanActivate interface
- Checks authentication state securely
- Validates returnUrl to prevent open redirects
- Returns UrlTree for safe redirects
- No sensitive data exposure
- Proper error handling

**Usage example in routing:**
```typescript
{
  path: 'profile',
  component: UserProfileComponent,
  canActivate: [AuthGuard]
}
```

### Step 3: Implement Input Sanitization Service
Create a service to sanitize user inputs.

**File to create:** `src/app/services/sanitization.service.ts`

**Prompt to use with Copilot:**
```
Following our team instructions, create an Angular service that:
1. Sanitizes HTML content using DomSanitizer
2. Validates and sanitizes URLs
3. Strips dangerous attributes from user input
4. Provides methods for different sanitization contexts
5. Returns SafeHtml, SafeUrl types appropriately
6. Adds proper error handling and logging
```

**Expected Implementation:**
- Uses Angular's DomSanitizer
- Methods: sanitizeHtml(), sanitizeUrl(), stripScripts()
- Returns proper Safe* types
- Validates inputs before sanitization
- Comprehensive JSDoc comments
- Unit tests with XSS attempt examples

**Usage example:**
```typescript
constructor(private sanitizer: SanitizationService) {}

displayUserContent(html: string): SafeHtml {
  return this.sanitizer.sanitizeHtml(html);
}
```

### Step 4: Implement Secure Form Component
Create a reactive form with comprehensive validation.

**File to create:** `src/app/components/secure-form/secure-form.component.ts`

**Prompt to use with Copilot:**
```
Following our team instructions, create an Angular component with a secure form that:
1. Uses ReactiveFormsModule with proper validation
2. Validates email, password strength, and username
3. Sanitizes all inputs before submission
4. Shows user-friendly validation messages
5. Prevents submission of invalid data
6. Implements proper ARIA labels for accessibility
7. Handles errors without exposing system details
```

**Expected Implementation:**
- FormBuilder with validators
- Custom password strength validator
- Email format validation
- Input sanitization before submit
- ARIA labels and roles
- Accessible error messages
- No inline event handlers

**Validation requirements:**
- Password: min 12 chars, uppercase, lowercase, number, special char
- Email: valid email format
- Username: alphanumeric, 3-20 chars
- All fields: required, trimmed, no scripts

### Step 5: Implement Secure File Upload Component
Create a component for secure file uploads.

**File to create:** `src/app/components/file-upload/file-upload.component.ts`

**Prompt to use with Copilot:**
```
Following our team instructions, create an Angular file upload component that:
1. Validates file type (only images: jpg, png, gif)
2. Validates file size (max 5MB)
3. Generates preview using DomSanitizer
4. Shows upload progress
5. Handles errors gracefully
6. Does not expose file system paths
7. Uses proper TypeScript types
```

**Expected Implementation:**
- File input with accept attribute
- FileReader with proper error handling
- File type validation (MIME + extension)
- File size validation
- Safe URL generation for preview
- Upload progress indicator
- Error messages without details
- Proper cleanup on destroy

**Allowed file types:**
```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
```

## Testing Your Implementation

### Run All Tests
```bash
npm test
npm run lint
npm run lint:security
```

### Manual Testing Checklist
- [ ] JWT interceptor adds token to requests
- [ ] Auth guard blocks unauthorized access
- [ ] Sanitization service prevents XSS
- [ ] Secure form validates all inputs
- [ ] File upload rejects invalid files
- [ ] No console.log statements
- [ ] No localStorage for tokens
- [ ] Proper error handling everywhere

## Success Criteria
- [ ] All components/services created
- [ ] Unit tests with >80% coverage
- [ ] All ESLint rules pass
- [ ] No security warnings
- [ ] Proper TypeScript types (no any)
- [ ] Comprehensive error handling
- [ ] Accessibility features implemented
- [ ] Documentation/comments added

## Advanced Challenge (Optional)

### Implement Content Security Policy Helper
Create a service to help enforce CSP headers.

**Prompt to use:**
```
Create a service that helps developers understand and implement 
Content Security Policy headers, with methods to validate 
inline scripts and generate CSP-compliant code.
```

### Implement Security Headers Service
Create a service that documents security headers for the backend team.

**Features to include:**
- X-Content-Type-Options
- X-Frame-Options
- Strict-Transport-Security
- Content-Security-Policy
- X-XSS-Protection (legacy)

## Tips for Using Copilot
1. **Reference Guidelines:** Always mention team instructions in prompts
2. **Be Explicit:** Specify security requirements clearly
3. **Iterate:** Refine prompts if output doesn't meet standards
4. **Review:** Verify generated code follows best practices
5. **Test Thoroughly:** Write tests for edge cases and attacks
6. **Document:** Add comments explaining security decisions

## Common Pitfalls to Avoid
- Do not use localStorage for tokens
- Do not log sensitive data
- Do not expose error details to users
- Do not skip input validation
- Do not forget to sanitize user content
- Do not use `any` type without justification
- Do not omit error handling
- Do not forget to unsubscribe

## Real-World Application
These patterns are used in production applications to:
- Protect APIs with JWT authentication
- Prevent unauthorized route access
- Sanitize user-generated content
- Validate form inputs
- Handle file uploads securely

## Next Steps
After completing this stage:
1. Review your implementations with a peer
2. Run the full test suite
3. Proceed to Stage 5 for governance validation & reporting
4. Document patterns you want to reuse

## Additional Resources
- [Angular Security Guide](https://angular.io/guide/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

**Time Estimate:** 45-60 minutes  
**Difficulty:** Intermediate to Advanced  
**Focus:** Proactive security implementation with AI assistance

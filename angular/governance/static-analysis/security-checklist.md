# Security Checklist for Angular Applications

## Pre-Deployment Security Review

### Authentication & Authorization
- [ ] JWT tokens stored in httpOnly cookies (not localStorage)
- [ ] Token expiration properly validated
- [ ] Refresh token mechanism implemented
- [ ] Route guards implemented for protected routes
- [ ] Server-side authorization checks in place
- [ ] Proper logout clears all session data

### Input Validation & Sanitization
- [ ] All user inputs validated on client and server
- [ ] DomSanitizer used for user-generated content
- [ ] No innerHTML binding with user data
- [ ] File uploads validated (type, size, content)
- [ ] Form validation implemented with reactive forms
- [ ] SQL injection prevention (parameterized queries)

### XSS Prevention
- [ ] Content Security Policy (CSP) headers configured
- [ ] Angular security context properly used
- [ ] No eval() or Function() constructor usage
- [ ] No direct DOM manipulation (use Renderer2)
- [ ] Template expressions safe from injection
- [ ] URL parameters sanitized before use

### CSRF Protection
- [ ] CSRF tokens on all state-changing requests
- [ ] SameSite cookie attribute set
- [ ] Origin/Referer header validation
- [ ] Double-submit cookie pattern implemented

### Data Protection
- [ ] No sensitive data in localStorage/sessionStorage
- [ ] Sensitive data encrypted in transit (HTTPS)
- [ ] Sensitive data encrypted at rest
- [ ] No credentials in source code
- [ ] Environment variables for secrets
- [ ] No sensitive data in error messages

### Error Handling
- [ ] Global error handler implemented
- [ ] User-friendly error messages (no stack traces)
- [ ] Errors logged to monitoring service
- [ ] No sensitive information in logs
- [ ] Proper HTTP error status codes used
- [ ] Network errors handled gracefully

### API Security
- [ ] HTTPS enforced for all API calls
- [ ] API rate limiting implemented
- [ ] Request timeout configured
- [ ] Retry logic with exponential backoff
- [ ] CORS properly configured
- [ ] API keys not exposed in client code

### Memory Management
- [ ] All observables properly unsubscribed
- [ ] No memory leaks from setInterval/setTimeout
- [ ] OnDestroy lifecycle hook implemented
- [ ] Large lists use virtual scrolling
- [ ] Images lazy loaded
- [ ] Components destroyed properly

### Code Quality
- [ ] No console.log in production code
- [ ] No debugger statements
- [ ] TypeScript strict mode enabled
- [ ] No 'any' types without justification
- [ ] ESLint security rules passing
- [ ] All dependencies up to date

### Testing
- [ ] Unit tests coverage ≥ 80%
- [ ] Security test cases included
- [ ] XSS prevention tested
- [ ] Authentication/authorization tested
- [ ] Input validation tested
- [ ] Error handling tested

### Accessibility
- [ ] ARIA labels on all interactive elements
- [ ] Keyboard navigation functional
- [ ] Screen reader compatible
- [ ] Color contrast meets WCAG standards
- [ ] Focus management implemented
- [ ] Skip links provided

### Performance
- [ ] Bundle size optimized (< 1MB initial)
- [ ] Lazy loading implemented
- [ ] OnPush change detection used
- [ ] trackBy functions in *ngFor
- [ ] Image optimization applied
- [ ] Caching strategy implemented

### Dependency Security
- [ ] npm audit passing (no high/critical)
- [ ] Dependencies regularly updated
- [ ] No deprecated packages
- [ ] License compliance verified
- [ ] SRI tags for CDN resources
- [ ] Dependency confusion attack prevention

## Copilot-Specific Checks
- [ ] Generated code reviewed manually
- [ ] Team instructions followed
- [ ] Security patterns enforced
- [ ] No hardcoded secrets in generated code
- [ ] Business logic validated
- [ ] Generated tests actually test functionality

## Sign-Off
- [ ] Code reviewed by security team
- [ ] Penetration testing completed
- [ ] Security scan passed
- [ ] Documentation updated
- [ ] Deployment checklist completed

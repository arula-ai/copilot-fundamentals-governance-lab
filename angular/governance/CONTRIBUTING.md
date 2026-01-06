# Contributing to Copilot Governance Lab

Thank you for your interest in contributing to the Copilot Governance Lab for Angular!

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Run `./scripts/setup-lab.sh` to set up dependencies
4. Create a new branch for your changes

## Development Workflow

### Before Making Changes
1. Review `.github/instructions/angular.instructions.md` for coding standards
2. Ensure your IDE has GitHub Copilot enabled
3. Pull the latest changes from main

### Making Changes
1. Follow the team instructions in `.github/instructions/angular.instructions.md`
2. Write tests for new functionality
3. Ensure all tests pass: `npm test`
4. Run linting: `npm run lint && npm run lint:security`
5. Check test coverage: `npm run test:coverage`

### Using GitHub Copilot
- Always reference team instructions when prompting Copilot
- Review all generated code carefully
- Verify that generated code follows Angular best practices
- Ensure generated tests actually test the functionality
- Never commit secrets or API keys

## Pull Request Process

1. Update documentation for any changed functionality
2. Fill out the PR template completely
3. Declare Copilot usage percentage
4. Ensure all CI checks pass
5. Request review from appropriate team members

### PR Checklist
- [ ] Code follows team instructions
- [ ] Tests written and passing (≥80% coverage)
- [ ] ESLint passing (no warnings)
- [ ] Security scan passing
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] No sensitive data exposed

## Code Review Guidelines

### As a Reviewer
- Verify Copilot-generated code is appropriate
- Check for security vulnerabilities
- Ensure tests are comprehensive
- Validate Angular best practices
- Provide constructive feedback

### As an Author
- Respond to feedback promptly
- Explain Copilot usage decisions
- Update code based on review comments
- Re-request review after changes

## Security

### Reporting Vulnerabilities
- Do not open public issues for security vulnerabilities
- Email security@example.com with details
- Include steps to reproduce
- Allow time for patch before disclosure

### Security Standards
- All PRs must pass security ESLint checks
- npm audit must show no high/critical vulnerabilities
- No sensitive data in code or commits
- Follow OWASP Top 10 guidelines

## Testing

### Test Requirements
- All new code must have tests
- Minimum 80% coverage required
- Tests must actually verify functionality
- Use meaningful test descriptions
- Mock external dependencies

### Running Tests
```bash
npm test                 # Run tests in watch mode
npm run test:headless    # Run tests once
npm run test:coverage    # Generate coverage report
```

## Documentation

### What to Document
- New features and components
- Security considerations
- Usage examples
- Breaking changes
- Migration guides

### Documentation Standards
- Use clear, concise language
- Include code examples
- Keep README.md up to date
- Document public APIs
- Add inline comments for complex logic

## Commit Messages

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

### Examples
```
feat(auth): add JWT interceptor with refresh token logic

Implements token refresh mechanism to automatically
renew expired tokens without requiring user re-login.

Follows team security guidelines in copilot-instructions.md
```

## Code Style

### TypeScript
- Use strict TypeScript settings
- Avoid `any` type without justification
- Prefer interfaces over types for objects
- Use meaningful variable names
- Follow Angular naming conventions

### Angular
- One component per file
- Use OnPush change detection when possible
- Implement proper lifecycle hooks
- Unsubscribe from observables
- Use reactive forms for complex forms

### Testing
- Use AAA pattern (Arrange, Act, Assert)
- One assertion per test when possible
- Use descriptive test names
- Mock external dependencies
- Test both success and error paths

## Questions?

- Check existing issues and discussions
- Review documentation in `/docs`
- Ask in team chat or discussions
- Open an issue for bugs or features

## License

By contributing, you agree that your contributions will be licensed under the project's license.

## 📋 Description

<!-- Provide a brief description of the changes in this PR -->

## 🎯 Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🔧 Refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] 🧪 Test updates
- [ ] 🔒 Security update
- [ ] 🚀 Release preparation

## 🏗️ Affected Services

<!-- Mark the services affected by this change -->

- [ ] 🔧 Shared/Core libraries
- [ ] 👤 service-user
- [ ] 📦 Other services (specify): _______________

## 🧪 Testing

<!-- Describe the tests you ran to verify your changes -->

### Test Coverage
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

### Test Results
<!-- Paste relevant test results or screenshots -->

```bash
# Test command used
pnpm nx affected -t test

# Test results summary
```

## 📝 Checklist

<!-- Review the following and check off completed items -->

### Code Quality
- [ ] Code follows the project's coding standards
- [ ] Self-review of code completed
- [ ] Code is properly commented, particularly hard-to-understand areas
- [ ] No console.log or debugging code left in the codebase

### Dependencies & Configuration
- [ ] New dependencies are justified and documented
- [ ] Configuration changes are documented
- [ ] Environment variables added to relevant documentation
- [ ] Database migrations included (if applicable)

### Documentation
- [ ] README updated (if applicable)
- [ ] API documentation updated (if applicable)
- [ ] Inline code comments added where necessary
- [ ] Breaking changes documented

### Deployment & Release
- [ ] Changes are backward compatible OR migration strategy documented
- [ ] No sensitive information (passwords, tokens, etc.) committed
- [ ] Docker build tested locally (if Dockerfile changes)
- [ ] Nx affected graph reviewed for impact

## 🔗 Related Issues

<!-- Link any related issues, e.g., "Closes #123" or "Related to #456" -->

- Closes #
- Related to #

## 🚀 Deployment Notes

<!-- Any special deployment instructions or considerations -->

- [ ] Requires database migration
- [ ] Requires environment variable updates
- [ ] Requires service restart
- [ ] Breaking change - coordinate with dependent services

## 📸 Screenshots/Demo

<!-- Add screenshots, GIFs, or links to demo videos if applicable -->

## 🤔 Additional Context

<!-- Add any other context, concerns, or questions about this PR -->

---

<!-- 
### Reviewer Notes
- Please review the affected services and test coverage
- Check for breaking changes and migration strategies
- Verify documentation is up to date
- Ensure security best practices are followed
--> 
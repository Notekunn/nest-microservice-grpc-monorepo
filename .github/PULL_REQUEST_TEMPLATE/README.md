# Pull Request Templates

This directory contains specialized pull request templates for different types of changes in our NestJS microservices monorepo.

## 📋 Available Templates

### 1. Default Template (`pull_request_template.md`)
- **Location:** `.github/pull_request_template.md`
- **Usage:** Applied automatically to all new pull requests
- **Best for:** General purpose changes, mixed changes

### 2. Feature Template (`feature.md`)
- **URL:** `?template=feature.md`
- **Best for:** New features, enhancements, major functionality additions
- **Includes:** Acceptance criteria, API changes, deployment planning

### 3. Bug Fix Template (`bugfix.md`)
- **URL:** `?template=bugfix.md`
- **Best for:** Bug fixes, hotfixes, issue resolutions
- **Includes:** Root cause analysis, reproduction steps, fix verification

### 4. Release Template (`release.md`)
- **URL:** `?template=release.md`
- **Best for:** Release preparation, version bumps, release candidate PRs
- **Includes:** Release notes, deployment plan, rollback strategy

### 5. Refactor Template (`refactor.md`)
- **URL:** `?template=refactor.md`
- **Best for:** Code refactoring, performance improvements, technical debt
- **Includes:** Impact analysis, metrics comparison, migration guides

## 🚀 How to Use Templates

### Method 1: Query Parameter (Recommended)
When creating a new PR, add the template parameter to the URL:
```
https://github.com/[username]/[repo]/compare/[branch]?template=feature.md
```

### Method 2: Manual Selection
1. Create a new pull request
2. Clear the default template
3. Copy content from the desired template file

### Method 3: Browser Bookmarks
Create bookmarks with these URLs for quick access:

```javascript
// Feature PR
javascript:window.location.href = window.location.href + '?template=feature.md'

// Bug Fix PR  
javascript:window.location.href = window.location.href + '?template=bugfix.md'

// Release PR
javascript:window.location.href = window.location.href + '?template=release.md'

// Refactor PR
javascript:window.location.href = window.location.href + '?template=refactor.md'
```

## 📋 Template Selection Guide

| Change Type | Recommended Template | Key Benefits |
|-------------|---------------------|--------------|
| 🆕 New feature/enhancement | `feature.md` | Acceptance criteria, API docs, deployment planning |
| 🐛 Bug fix/hotfix | `bugfix.md` | Root cause analysis, reproduction steps |
| 🚀 Version release | `release.md` | Comprehensive release planning and rollback |
| 🔧 Code refactoring | `refactor.md` | Impact analysis, performance metrics |
| 📚 Documentation only | Default template | Simple and sufficient |
| 🧪 Test improvements | `refactor.md` | Good for test-focused changes |
| 🔒 Security fixes | `bugfix.md` | Includes security review checklist |

## 🎯 Template Features

### Common Elements
All templates include:
- ✅ Comprehensive checklists
- 🏗️ Service impact assessment
- 🧪 Testing requirements
- 📚 Documentation updates
- 🚀 Deployment considerations

### Specialized Elements

#### Feature Template
- Acceptance criteria tracking
- API documentation requirements
- Performance and security reviews
- Demo/screenshot sections

#### Bug Fix Template
- Root cause analysis
- Reproduction steps
- Emergency hotfix procedures
- Rollback planning

#### Release Template
- Release metrics and changelog
- Multi-service coordination
- Monitoring and alerting setup
- Emergency contact information

#### Refactor Template
- Code quality metrics comparison
- Technical debt tracking
- Architecture impact analysis
- Learning documentation

## 🔧 Customization

### Team-Specific Modifications
Feel free to customize templates by:
- Adding your service names to the "Affected Services" sections
- Updating reviewer guidelines
- Adding team-specific checklists
- Including links to internal tools/docs

### Service-Specific Templates
For service-specific templates, create new files like:
- `service-user-feature.md`
- `service-user-bugfix.md`

## 📖 Best Practices

### For PR Authors
1. **Choose the right template** based on your change type
2. **Fill out all sections** completely - don't skip checklists
3. **Link related issues** and provide context
4. **Include test results** and evidence of testing
5. **Document breaking changes** clearly

### For Reviewers
1. **Verify template compliance** - ensure all sections are filled
2. **Check the checklists** - make sure items are actually completed
3. **Validate testing** - ensure appropriate test coverage
4. **Review deployment impact** - especially for breaking changes

### For Maintainers
1. **Keep templates updated** as project evolves
2. **Add new templates** for emerging change patterns
3. **Gather feedback** from team on template effectiveness
4. **Update service lists** as services are added/removed

## 🤝 Contributing

To improve these templates:
1. Create a PR with your proposed changes
2. Include rationale for the modifications
3. Test the template with an actual PR
4. Get team feedback before merging

---

**Need help?** Check the [GitHub docs on PR templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository) or ask the team! 
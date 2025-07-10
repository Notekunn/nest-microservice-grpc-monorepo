## 🔧 Refactor: [Brief Description]

### 📋 Refactoring Overview

**Type of Refactoring:**
- [ ] 🏗️ Code restructuring
- [ ] ⚡ Performance optimization
- [ ] 🧹 Code cleanup
- [ ] 📦 Dependency updates
- [ ] 🏛️ Architecture improvement
- [ ] 🔒 Security hardening
- [ ] 📚 Documentation improvement
- [ ] 🧪 Test improvements

### 🎯 Motivation

**Why is this refactoring needed?**
<!-- Explain the business or technical reasons for this refactoring -->

**What problems does it solve?**
<!-- List the specific issues being addressed -->
- Problem 1: _______________
- Problem 2: _______________
- Problem 3: _______________

**Benefits Expected:**
- [ ] Improved code readability
- [ ] Better performance
- [ ] Reduced technical debt
- [ ] Enhanced maintainability
- [ ] Better test coverage
- [ ] Improved security
- [ ] Simplified architecture

### 🏗️ Changes Made

**Services Affected:**
- [ ] 👤 service-user
- [ ] 🔧 Shared libraries
- [ ] 📦 Other: _______________

**Key Refactoring Areas:**

#### Code Structure
- **Files Moved/Renamed:** _______________
- **Classes/Functions Refactored:** _______________
- **New Patterns Introduced:** _______________

#### Dependencies
- **Added Dependencies:**
  - `package@version`: Reason
- **Updated Dependencies:**
  - `package@old-version` → `package@new-version`: Reason
- **Removed Dependencies:**
  - `package@version`: Reason

#### Architecture Changes
- **Design Patterns:** _______________
- **Service Boundaries:** _______________
- **Data Flow:** _______________

### 📊 Impact Analysis

**Functional Changes:**
- [ ] ✅ No functional changes (pure refactoring)
- [ ] ⚠️ Minor functional improvements
- [ ] 🔄 Significant functional changes (explain below)

**Performance Impact:**
- [ ] No performance impact expected
- [ ] Performance improvement expected
- [ ] Performance impact requires testing

**Breaking Changes:**
- [ ] ✅ No breaking changes
- [ ] ⚠️ Internal breaking changes (no external API impact)
- [ ] 🚨 External breaking changes (API changes)

### 🧪 Testing Strategy

**Test Coverage:**
- [ ] Existing tests still pass
- [ ] New tests added for refactored code
- [ ] Test coverage maintained/improved
- [ ] Integration tests updated
- [ ] E2E tests verified

**Regression Testing:**
- [ ] All existing functionality verified
- [ ] Performance regression testing
- [ ] Security regression testing

**Test Results:**
```bash
# Before refactoring
pnpm nx affected -t test
✅ X tests passing

# After refactoring  
pnpm nx affected -t test
✅ Y tests passing (should be >= X)

# Coverage comparison
Before: XX.X%
After:  YY.Y%
```

### 📈 Metrics Comparison

**Code Quality Metrics:**

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Lines of Code | XXX | YYY | ±ZZ |
| Cyclomatic Complexity | XX | YY | ±Z |
| Code Duplication | XX% | YY% | ±Z% |
| Test Coverage | XX% | YY% | ±Z% |
| Dependencies | XX | YY | ±Z |

**Performance Metrics (if applicable):**

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Response Time | XXXms | YYYms | ±ZZms |
| Memory Usage | XXXMB | YYYMB | ±ZZMB |
| CPU Usage | XX% | YY% | ±Z% |

### 🔍 Code Review Focus Areas

**Please pay special attention to:**
- [ ] Code organization and structure
- [ ] Design pattern implementation
- [ ] Performance implications
- [ ] Security considerations
- [ ] Test coverage and quality
- [ ] Documentation accuracy
- [ ] Backward compatibility

**Specific Review Points:**
1. **Architecture:** _______________
2. **Performance:** _______________
3. **Security:** _______________
4. **Maintainability:** _______________

### 📚 Documentation Updates

**Documentation Changes:**
- [ ] Code comments updated
- [ ] API documentation updated
- [ ] Architecture diagrams updated
- [ ] README files updated
- [ ] Development guides updated

**Migration Guide (if needed):**
<!-- Steps for other developers to adapt to changes -->

### 🚀 Deployment Considerations

**Deployment Risk:**
- [ ] 🟢 Low risk (no functional changes)
- [ ] 🟡 Medium risk (minor changes)
- [ ] 🔴 High risk (significant changes)

**Deployment Strategy:**
- [ ] Standard deployment
- [ ] Gradual rollout
- [ ] Feature flags required
- [ ] Database migration required

**Rollback Plan:**
<!-- How to rollback if issues are discovered -->

### 🔄 Future Work

**Planned Follow-ups:**
- [ ] Additional refactoring in related areas
- [ ] Performance monitoring setup
- [ ] Further test improvements
- [ ] Documentation enhancements

**Technical Debt Addressed:**
- [ ] Debt item 1: _______________
- [ ] Debt item 2: _______________
- [ ] Debt item 3: _______________

### 🔗 References

**Related Issues:**
- Technical debt: #
- Performance issues: #
- Architecture discussions: #

**Documentation:**
- ADR (Architecture Decision Record): [Link]
- Design documents: [Link]
- Performance analysis: [Link]

### ✅ Pre-merge Checklist

#### Code Quality
- [ ] Code follows established patterns
- [ ] No code duplication introduced
- [ ] Consistent naming conventions
- [ ] Proper error handling
- [ ] Security best practices followed

#### Testing
- [ ] All existing tests pass
- [ ] New tests cover refactored code
- [ ] Integration tests updated
- [ ] Performance tests run (if applicable)
- [ ] No regression in functionality

#### Documentation
- [ ] Code is well-documented
- [ ] Architecture changes documented
- [ ] Migration guide created (if needed)
- [ ] Team has been notified of changes

#### Deployment
- [ ] No breaking changes or properly documented
- [ ] Deployment plan reviewed
- [ ] Rollback plan documented
- [ ] Monitoring considerations addressed

---

### 💡 Learning Notes

**What was learned during this refactoring?**
<!-- Document insights, patterns, or lessons learned -->

**Best Practices Applied:**
<!-- List design patterns, principles, or practices used -->

**Recommendations for Future Refactoring:**
<!-- Suggestions for similar future work --> 
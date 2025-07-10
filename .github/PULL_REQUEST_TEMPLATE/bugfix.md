## 🐛 Bug Fix: [Brief Description]

### 📋 Bug Description

**What was the issue?**
<!-- Clearly describe the bug that was occurring -->

**When did it occur?**
<!-- Describe the conditions or scenarios when the bug manifested -->

**Impact Level:**
- [ ] 🔴 Critical (system down, data loss)
- [ ] 🟡 High (major feature broken)
- [ ] 🟠 Medium (minor feature issue)
- [ ] 🟢 Low (cosmetic, edge case)

### 🔍 Root Cause Analysis

**What caused the bug?**
<!-- Explain the underlying cause of the issue -->

**How was it discovered?**
- [ ] User report
- [ ] Monitoring/Alerting
- [ ] Testing
- [ ] Code review
- [ ] Other: _______________

**Affected Services:**
- [ ] 👤 service-user
- [ ] 🔧 Shared libraries
- [ ] 📦 Other: _______________

### 🛠️ Solution

**Fix Description:**
<!-- Describe what changes were made to fix the bug -->

**Alternative Solutions Considered:**
<!-- List other approaches that were considered and why they were not chosen -->

### 🧪 Testing

**How was the fix verified?**
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] Regression testing completed

**Test Cases:**
<!-- List specific test cases that verify the fix -->
1. **Reproducing the original bug:** _______________
2. **Verifying the fix:** _______________
3. **Regression testing:** _______________

**Test Results:**
```bash
# Commands used to test the fix
pnpm nx affected -t test
pnpm nx affected -t lint

# Results summary
```

### 🔄 Reproduction Steps

**Original Bug (Before Fix):**
1. Step 1
2. Step 2
3. Step 3
4. **Expected:** _______________
5. **Actual:** _______________

**After Fix:**
1. Step 1
2. Step 2
3. Step 3
4. **Result:** ✅ Works as expected

### 📊 Performance Impact

- [ ] No performance impact
- [ ] Performance improved
- [ ] Minor performance impact (acceptable)
- [ ] Performance impact requires monitoring

**Details:**
<!-- If there's any performance impact, describe it -->

### 🔒 Security Implications

- [ ] No security implications
- [ ] Security vulnerability fixed
- [ ] Security review required

**Details:**
<!-- If there are security implications, describe them -->

### 📚 Documentation Updates

- [ ] No documentation changes needed
- [ ] API documentation updated
- [ ] README updated
- [ ] Troubleshooting guide updated
- [ ] Known issues updated

### 🚀 Deployment Considerations

**Deployment Type:**
- [ ] 🟢 Standard deployment
- [ ] 🟡 Hotfix deployment required
- [ ] 🔴 Emergency deployment

**Rollback Plan:**
<!-- Describe how to rollback if the fix causes issues -->

**Prerequisites:**
- [ ] No prerequisites
- [ ] Database migration required
- [ ] Configuration changes required
- [ ] Service restart required

### 🔗 Related Issues

- **Bug Report:** Fixes #
- **Related Issues:** #
- **Monitoring/Alerts:** [Link to monitoring dashboard]

### 📸 Evidence

**Before (Bug):**
<!-- Screenshots, logs, or evidence of the bug -->

**After (Fixed):**
<!-- Screenshots, logs, or evidence that it's fixed -->

### ✅ Pre-merge Checklist

- [ ] Root cause identified and documented
- [ ] Fix implemented and tested
- [ ] Regression testing completed
- [ ] No new issues introduced
- [ ] Documentation updated (if needed)
- [ ] Deployment plan approved
- [ ] Rollback plan documented

---

### 🚨 Emergency Hotfix Only

<!-- Fill this section only if this is an emergency hotfix -->

**Severity Justification:**
<!-- Why this requires emergency deployment -->

**Risk Assessment:**
<!-- What are the risks of deploying this fix immediately -->

**Approval:**
- [ ] Technical Lead approval
- [ ] Product Owner approval (if needed)
- [ ] Security approval (if security-related) 
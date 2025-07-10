## ✨ Feature: [Feature Name]

### 📋 Feature Description

<!-- Provide a clear and comprehensive description of the new feature -->

**What does this feature do?**
<!-- Explain the functionality being added -->

**Why is this feature needed?**
<!-- Explain the business value and user need -->

**Who will use this feature?**
<!-- Target users or services -->

### 🎯 Acceptance Criteria

<!-- List the specific requirements that must be met -->

- [ ] ✅ Requirement 1
- [ ] ✅ Requirement 2
- [ ] ✅ Requirement 3

### 🏗️ Technical Implementation

<!-- Describe the technical approach and architecture decisions -->

**Services Modified:**
- [ ] 👤 service-user
- [ ] 🔧 Shared libraries
- [ ] 📦 Other: _______________

**Key Changes:**
- **Controllers:** <!-- List new/modified controllers -->
- **Services:** <!-- List new/modified services -->
- **DTOs:** <!-- List new/modified DTOs -->
- **Database:** <!-- Any schema changes -->
- **APIs:** <!-- New/modified endpoints -->

### 🔌 API Changes

<!-- Document any new or modified APIs -->

#### New Endpoints
```http
POST /api/v1/example
GET /api/v1/example/{id}
```

#### Modified Endpoints
```http
PUT /api/v1/existing/{id} # Added new field: xyz
```

### 🧪 Testing Strategy

**Test Coverage:**
- [ ] Unit tests for all new business logic
- [ ] Integration tests for API endpoints
- [ ] E2E tests for complete user flows
- [ ] Performance tests (if applicable)

**Test Scenarios:**
<!-- List key test scenarios -->
1. Happy path: _______________
2. Edge cases: _______________
3. Error handling: _______________

### 📊 Performance Considerations

<!-- Address any performance implications -->

- [ ] Performance impact assessed
- [ ] Database queries optimized
- [ ] Caching strategy implemented (if needed)
- [ ] Load testing completed (if applicable)

### 🔒 Security Considerations

<!-- Address security implications -->

- [ ] Authentication/Authorization properly implemented
- [ ] Input validation added
- [ ] Security review completed
- [ ] No sensitive data exposed

### 📚 Documentation

- [ ] API documentation updated (Swagger/OpenAPI)
- [ ] README updated with new feature
- [ ] Environment variables documented
- [ ] Migration guide provided (if breaking changes)

### 🚀 Deployment Plan

<!-- Describe the deployment strategy -->

**Deployment Type:**
- [ ] 🟢 Standard deployment
- [ ] 🟡 Feature flag deployment
- [ ] 🔴 Blue-green deployment required

**Prerequisites:**
- [ ] Database migrations
- [ ] Environment variables
- [ ] Service dependencies

### 🔗 Related

- **Feature Request:** #
- **Epic:** #
- **Design Doc:** [Link]
- **Figma/Mockups:** [Link]

### 📸 Demo

<!-- Add screenshots, videos, or links to feature demo -->

**Before:**
<!-- Current state -->

**After:**
<!-- New feature in action -->

### ✅ Pre-merge Checklist

- [ ] Feature fully implemented and tested
- [ ] All acceptance criteria met
- [ ] Code review completed
- [ ] Security review completed (if needed)
- [ ] Performance testing completed (if needed)
- [ ] Documentation updated
- [ ] Deployment plan approved 
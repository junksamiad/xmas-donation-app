# Sprint [N]: [Sprint Title] PRD

**Duration**: [X days] | **Phase**: [X] | **Focus**: [Feature/Stability/Infrastructure]

## Sprint Goal
[One sentence describing what we're delivering and why]

## Business Context
[2-3 sentences on why now, what problem we're solving, who benefits]

## Stories Included

| Story | Title | Type | Size | Depends On | Testing |
|-------|-------|------|------|------------|---------|
| [N.0] | [Tech debt if any] | Tech-Debt | S | - | Sprint-end |
| [N.1] | [Title] | Feature | M | - | After-story |
| [N.2] | [Title] | Feature | L | N.1 | After-story |
| [N.3] | [Title] | Bug | S | - | Sprint-end |

## Success Criteria
- [ ] All stories marked complete
- [ ] Quality gates pass (lint, type-check, build)
- [ ] [Sprint-specific metric]
- [ ] [Business outcome achieved]

## Technical Approach

### Building On
- **From Sprint [N-1]**: [What we're extending]
- **Key Patterns**: [Which patterns from system-capabilities we're using]
- **New Capabilities**: [What this sprint adds to the system]

### Architecture Decisions
1. [Major decision - e.g., "Using Server Actions for all mutations"]
2. [Another decision - e.g., "Adding Redis for session caching"]
3. [If applicable - e.g., "Migrating from X to Y pattern"]

## Dependencies & Risks

### Prerequisites
- [What must exist - e.g., "API key system from Sprint 3"]
- [External dependency - e.g., "Vercel KV configured"]

### Risks
- **[Risk]**: [Mitigation]
- **[Risk]**: [Mitigation]

## Out of Scope
- [Explicitly not doing X - will be Sprint N+1]
- [Not including Y feature - future enhancement]

---

**Next Sprint**: Sprint [N+1] will [one line preview]
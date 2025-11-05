# Brownfield Context - [PROJECT STATE]

> **Purpose**: Handover document providing both strategic context (WHY) and implementation details (WHAT/HOW) for developers taking over or continuing development.
> **Last Updated**: [DATE]
> **Sprint/Phase**: [IDENTIFIER]

---

## Sprint/Phase Conceptual Overview

### Business Context
**Problem Statement**: [What business problem were we solving?]

**Solution Approach**: [High-level approach taken]

**Success Metrics**: [How do we measure if this sprint succeeded?]

### Strategic Decisions

#### Why This Sprint?
[Why were these features prioritized? What was blocking? What value does this unlock?]

#### Key Design Decisions
| Decision | Choice Made | Alternatives Considered | Rationale |
|----------|-------------|------------------------|-----------|
| [AREA] | [WHAT WE CHOSE] | [OTHER OPTIONS] | [WHY] |

#### Intentional Trade-offs
- **Deferred**: [What we consciously decided NOT to do and why]
- **Simplified**: [What we kept simple for now with plans to enhance later]
- **Technical Debt Accepted**: [What shortcuts we took and why they were acceptable]

---

## Current System Overview

### What Was Actually Built
[Concrete description of implemented features and their business value]

### Tech Stack (As Implemented)
- **Framework**: [DETAILS WITH VERSION]
- **Language**: [DETAILS]
- **Database**: [DETAILS]
- **ORM**: [DETAILS]
- **Deployment**: [DETAILS]
- **UI Components**: [DETAILS]
- **Authentication**: [DETAILS]

## Key Implementation Patterns

### [PATTERN NAME]
```typescript
// Example code pattern
```

## Authentication Systems

### [AUTH SYSTEM NAME]
- [AUTHENTICATION DETAILS]
- [SECURITY MEASURES]
- [TOKEN/SESSION MANAGEMENT]

## Database Models

### [MODEL CATEGORY]
```prisma
// Example model structure
```

## Current System Structure

### [FEATURE] Files
```
/path/to/files/
├── [FILE/FOLDER]     # Description
└── [FILE/FOLDER]     # Description
```

## Critical Files to Review

### For Understanding [AREA] Patterns
- `[FILE PATH]` - [DESCRIPTION]

### Database & ORM
- `[FILE PATH]` - [DESCRIPTION]

## Common Gotchas

### [GOTCHA CATEGORY]
- [WARNING/NOTE]
- [HOW TO HANDLE]

### Environment Variables
```bash
# [CATEGORY]
[VAR_NAME]=[DESCRIPTION]
```

## Testing Approach

### Current Testing Strategy
- **[TEST TYPE]**: [DESCRIPTION]
- **Quality Baselines**: [METRICS]

### Testing Commands
```bash
# Testing commands
```

## Development Workflow

### Quality Gates (Must Pass)
1. [GATE 1] - [DESCRIPTION]
2. [GATE 2] - [DESCRIPTION]

### Common Commands
```bash
# Common development commands
```

## Next Steps for Development

1. **[STEP]**: [DESCRIPTION]
2. **[STEP]**: [DESCRIPTION]

## System Health Checklist

### Functional Health
- [ ] [FEATURE]: [IS IT WORKING AS EXPECTED?]
- [ ] [INTEGRATION]: [IS IT PROPERLY CONNECTED?]

### Technical Health
- [ ] No critical bugs blocking usage
- [ ] Performance meets requirements ([METRICS])
- [ ] Security measures in place and tested
- [ ] Monitoring/logging operational

### Process Health
- [ ] Documentation up to date
- [ ] Test coverage adequate
- [ ] Knowledge transferred to team

---

## Handover Notes

### For Developers Taking Over

#### Quick Start
1. [FIRST THING TO DO]
2. [SECOND THING TO DO]
3. [VERIFY WORKING BY...]

#### Understanding the Codebase
- **Start Here**: [KEY FILE/COMPONENT TO UNDERSTAND FIRST]
- **Core Flow**: [MAIN USER JOURNEY THROUGH THE CODE]
- **Key Patterns**: [PATTERNS YOU MUST UNDERSTAND]

#### Known Issues & Workarounds
| Issue | Impact | Workaround | Planned Fix |
|-------|--------|------------|-------------|
| [ISSUE] | [WHO/WHAT AFFECTED] | [TEMPORARY SOLUTION] | [WHEN/HOW TO FIX] |

### Questions This Sprint Answered
1. **Q**: [COMMON QUESTION] **A**: [ANSWER DISCOVERED]
2. **Q**: [COMMON QUESTION] **A**: [ANSWER DISCOVERED]

### Open Questions for Next Sprint
1. [QUESTION THAT NEEDS ANSWERING]
2. [DECISION THAT NEEDS MAKING]

---

## Appendix: Key Learning & Insights

### What Worked Well
- [PATTERN/APPROACH THAT WORKED]
- [DECISION THAT PAID OFF]

### What We'd Do Differently
- [LESSON LEARNED]
- [BETTER APPROACH DISCOVERED]

### Recommendations for Next Phase
1. **Priority**: [WHAT TO TACKLE FIRST AND WHY]
2. **Consider**: [ARCHITECTURAL CONSIDERATION]
3. **Avoid**: [PITFALL TO AVOID]

---

*This document serves as a handover snapshot. For living documentation, see system-capabilities.md. For requirements, see PRD. For technical specifications, see architecture docs.*
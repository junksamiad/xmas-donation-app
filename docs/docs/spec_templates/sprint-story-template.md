# Story [N.X]: [Title]

**Sprint**: [N] | **Type**: [Feature/Tech-Debt/Bug] | **Size**: [S/M/L]

## What We're Building
[1-2 sentences describing the feature/fix in plain language]

## Acceptance Criteria
- [ ] [Specific, testable requirement]
- [ ] [Another testable requirement]
- [ ] [Edge case or error handling]
- [ ] Tests pass: lint, type-check, build

## Technical Approach

### Builds On (from system-capabilities)
- **Pattern**: [e.g., "Server Actions with audit logging" - Section 10]
- **Components**: [e.g., "DataTable component" - Section 5]
- **Auth**: [e.g., "Cookie sessions" - Section 7]

### Implementation
```
/app/[path]/
├── page.tsx         # [What it does]
├── actions.ts       # [Server actions needed]
└── components/      # [Any new components]
```

**Key Steps**:
1. [First implementation step - specific file/pattern]
2. [Second step - what to modify/create]
3. [Third step - integration point]

### Data Changes (if any)
- **Model**: [Which Prisma model affected]
- **Migration**: [What changes needed]

## Testing Strategy
- **Test Type**: [Smoke/Browser/API/Script/None - decided during planning]
- **Quality Gates**: [After story/Sprint end - decided during planning]

### Testing Checklist (if testing after story)
```bash
# Quality gates (if selected)
npm run lint && npm run type-check && npm run build

# Test steps (based on type selected)
1. [Primary test action]
2. [Verify expected result]
3. [Check error case if applicable]
```

## Dependencies
- **Requires**: Story [N.Y] (if any)
- **Blocks**: Story [N.Z] (if any)

---

## Implementation Notes
_Filled during implementation_

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete | ❌ Blocked

**Actual Changes**:
- [File created/modified]
- [Pattern used]

**Issues/Errors Encountered**:
- [Error/challenge faced → How resolved]
- [Unexpected behavior → Workaround applied]
- [Blocker if unresolved]
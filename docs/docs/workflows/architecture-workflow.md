# /generate-architecture Command

## Purpose
Create a focused architecture document for the current sprint when patterns/technologies aren't covered in system-capabilities.

## When to Use
Run this command after sprint planning when:
- New technologies outside AI knowledge cutoff
- Complex integrations or state management
- Breaking changes from existing patterns
- Domain-specific architectures needed

## Prerequisites
- Sprint PRD exists at `/docs/prd.md`
- Stories created in `/docs/stories/`
- System-capabilities reviewed

## Command Flow

### Step 1: Analyze Sprint Content
Agent reviews:
- PRD for architectural decisions
- Stories for technical approaches
- System-capabilities for gaps

### Step 2: Identify Architecture Needs
Agent determines what needs documenting:
```markdown
"Analyzing sprint for architecture needs...

Found:
- [New pattern/technology not in system-capabilities]
- [Complex integration requiring documentation]
- [Breaking change needing migration guide]

Will document these in architecture.md"
```

### Step 3: Generate Architecture Doc
**USE TEMPLATE**: Copy `/docs/spec_templates/sprint-architecture-template.md` as starting point
Agent creates `/docs/architecture.md` containing ONLY:

1. **New Patterns** not in system-capabilities
   - Why needed for this sprint
   - How it works
   - Example implementation
   - Which stories use it

2. **Integration Flows** if complex
   - Service interaction diagrams
   - Data flow visualization
   - Error handling approach
   - State management

3. **Technology Guidance** for new libraries
   - Version and documentation links
   - Setup/initialization
   - Usage in our context
   - Gotchas/considerations

4. **Breaking Changes** if migrating
   - What's changing and why
   - Migration approach
   - Stories affected
   - Rollback plan if needed

### Step 4: Confirm with User
```markdown
"Architecture doc created at /docs/architecture.md

Documented:
- [Pattern 1]: [Why included]
- [Pattern 2]: [Why included]
- [Integration]: [Why included]

This supplements system-capabilities for Sprint [N].
Review and adjust as needed."
```

## Key Principles

1. **Minimal**: Only document what's NOT in system-capabilities
2. **Sprint-Specific**: Focus on this sprint's needs only
3. **Practical**: Include code examples and diagrams
4. **Referenced**: Link to affected stories

## Example Scenarios

### Scenario 1: New AI SDK
```markdown
User: /generate-architecture
Agent: "Found new Anthropic Claude 3.5 SDK in Story 4.2, not in my knowledge.
       Documenting initialization, usage patterns, and error handling."
→ Creates focused doc with SDK setup and examples
```

### Scenario 2: WebSocket Integration
```markdown
User: /generate-architecture
Agent: "Complex real-time integration in Stories 4.3-4.5.
       Documenting WebSocket patterns, reconnection logic, state sync."
→ Creates doc with connection flows and state management
```

### Scenario 3: Database Migration
```markdown
User: /generate-architecture
Agent: "Breaking change: Moving from auto-increment to UUIDs.
       Documenting migration strategy and rollback plan."
→ Creates doc with migration steps and affected components
```

## Output Structure

The generated `/docs/architecture.md` follows the template structure from `/docs/spec_templates/sprint-architecture-template.md`:

```markdown
# Sprint [N] Architecture

## Overview
[Brief summary of why this doc exists]

## [Section for each architectural need]

### Pattern: [Name]
- Why needed
- Implementation
- Example code
- Used in stories: [X.Y, X.Z]

### Integration: [Name]
- Flow diagram
- Key decisions
- Error handling
- Used in stories: [X.Y]

### Technology: [Name]
- Setup guide
- Usage examples
- Considerations
- Used in stories: [X.Y]

---
*References system-capabilities.md for existing patterns*
```

## Success Criteria

A good architecture doc:
- ✅ Is under 100 lines
- ✅ Only covers gaps in system-capabilities
- ✅ Has practical code examples
- ✅ Links to specific stories
- ✅ Can be understood in 5 minutes

## When NOT to Generate

Don't create architecture doc if:
- All patterns exist in system-capabilities
- Sprint uses only standard CRUD operations
- No new technologies or integrations
- Simple UI additions or bug fixes

---

*This command ensures complex architectural decisions are documented without creating unnecessary documentation for standard implementations.*
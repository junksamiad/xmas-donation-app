# Sprint Implementation Workflow

## Purpose
Execute sprint implementation by orchestrating senior-dev agents to build stories in parallel while respecting dependencies.

**KEY RESPONSIBILITY SPLIT**:
- **Senior-dev agents**: Implementation only
- **You (Orchestrator)**: All testing, quality gates, and verification

## Prerequisites
- Sprint planning complete
- Architecture doc created if needed
- System capabilities understood

## Phase 1: Load & Validate

### Load Sprint Documentation
Read in this order:
1. `/docs/prd.md` - Sprint goals and story list
2. `/docs/stories/*.md` - All story specifications
3. `/docs/architecture.md` - If exists
4. `/docs/further-spec-docs/system-capabilities.md` - Existing patterns
5. `/docs/further-spec-docs/source-tree.md` - Code organization
6. `/docs/further-spec-docs/coding-standards.md` - Quality requirements

### Validate Completeness
```markdown
✅ Sprint [N] Ready:
- PRD with [X] stories defined
- All story files present
- Dependencies mapped: [show dependency chain]

OR

❌ Missing Documentation:
- Story [N.X]: No file found
Please create before proceeding.
```

## Phase 2: Dependency Analysis

### Map Execution Order
From PRD story table, create execution plan:
```
Depth 0: [Stories with no dependencies - can parallelize]
Depth 1: [Stories depending on Depth 0]
Depth 2: [Stories depending on Depth 1]
```

**IMPORTANT - Parallel Execution**:
- Launch ALL stories at the same depth level in PARALLEL
- Use multiple Task tool invocations in a SINGLE message
- Example: If stories 4.0, 4.1, 4.2 have no dependencies, launch all three senior-dev agents simultaneously

### Initialize Progress Tracking
Use TodoWrite:
```
Sprint [N]: [Title]
- [ ] Story N.0: [Tech debt] - Ready
- [ ] Story N.1: [Feature] - Ready
- [ ] Story N.2: [Feature] - Blocked by N.1
- [ ] Story N.3: [Feature] - Blocked by N.2
```

## Phase 3: Story Implementation

### Parallel Execution Strategy

**CRITICAL**: Launch senior-dev agents in PARALLEL when possible:
- All stories at same dependency depth = launch together
- Use single message with multiple Task tool calls
- Only wait between dependency levels, not between stories

### For Each Dependency Level

1. **Launch Senior-Dev Agents IN PARALLEL**:
```markdown
Task: "Implement Story [N.X]: [Title]"

Context:
Read these docs FIRST:
- /docs/stories/story-N.X.md - Your story spec
- /docs/prd.md - Sprint context
- /docs/architecture.md - If exists
- /docs/further-spec-docs/system-capabilities.md - Use existing patterns
- /docs/further-spec-docs/source-tree.md - File organization
- /docs/further-spec-docs/coding-standards.md - Standards

Requirements:
- Follow acceptance criteria exactly
- Use patterns from system-capabilities
- Implementation only - no testing/quality gates
- Report ALL issues encountered

Dependencies available:
- [List completed stories]
- [Available services/components]

Report format:
- Status: [Complete/Partial/Blocked]
- Files created/modified: [List]
- Issues encountered: [Even if resolved]
- What remains incomplete: [If partial]
```

2. **Process Response**:
   - Update TodoWrite with status
   - Log ALL issues in story Implementation Notes
   - If blocked, note for later retry

3. **Run Quality Gates**:
   After senior-dev completes implementation:
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

   If quality gates fail:
   - Document the specific errors
   - Decide whether to fix now or defer
   - May launch new senior-dev to fix specific issues

## Phase 4: Story Verification

### For Each Story Reported "Complete"

1. **Verify Requirements**:
   - Read story acceptance criteria
   - Check senior-dev implementation
   - Identify any gaps

2. **If Gaps Found**:
```markdown
Story [N.X] INCOMPLETE - missing:
- [Specific requirement not met]

Story remains PARTIAL status.
Launching senior-dev to complete missing items...
```

**IMPORTANT**: Story is NOT complete until ALL acceptance criteria are met!

3. **Update Story File**:
   Append Implementation Notes section to story file (see template below)

## Phase 5: Testing Strategy

### Testing Decision Points

**When to Test**: Stories specify testing approach in their Testing Strategy section:
- **"After-story"**: Test immediately after implementation
- **"Sprint-end"**: Test all stories together at sprint completion
- **"Skip"**: No specific testing (rely on quality gates only)

**How to Test**:
1. **Always Run Quality Gates** (for every story):
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

2. **Run Test Type** (as specified in story):
   - **Smoke Test**: Manual verification of basic functionality
   - **Browser Test**: Use browser-tester agent for UI testing
   - **API Test**: Test endpoints with curl/scripts
   - **Script Test**: Run custom test scripts if provided

**Who Tests**: You (orchestrator) run ALL tests - never delegate to senior-dev agents

## Phase 6: Final Validation

Launch story-code-validator agent to verify all implementations:
```markdown
"Validate Sprint [N] implementation
Check all stories against acceptance criteria
Verify quality standards met"
```

## Implementation Notes Template

Add this section to each story file after implementation:
```markdown
## Implementation Notes
**Status**: ✅ Complete | ⚠️ Partial | ❌ Blocked

**Actual Changes**:
- Created: [files]
- Modified: [files]
- Pattern used: [from system-capabilities]

**Issues Encountered**:
- [Issue] → [Resolution]
- [Blocker] → [Why incomplete]
```

## Phase 7: Sprint Completion

### Create Summary
Write `/docs/archive/sprint-summaries/sprint-[N]-summary.md`:
```markdown
# Sprint [N] Summary

## Completed Stories
- ✅ Story N.0: [Title]
- ✅ Story N.1: [Title]
- ⚠️ Story N.2: [Partial - see tech debt]

## Key Achievements
- [What was built]
- [Patterns established]

## Issues Resolved
- [Issue → Solution]
- [Challenge → Workaround]

## Tech Debt Created
- [What remains]
- [Why deferred]

## Validation
- Quality gates: Pass
- Story validator: [X/Y] stories validated
```

## Key Principles

1. **Respect Dependencies** - Never start blocked stories
2. **Parallel When Possible** - Launch multiple agents for independent stories
3. **Verify Everything** - Don't trust "complete" without checking
4. **Document Issues** - Every problem goes in Implementation Notes
5. **Test Per Strategy** - Follow each story's testing decision

## Progress Communication

Keep user informed with concise updates:
```
🚀 Launching 3 stories in parallel (Depth 0):
   - Story N.0 (tech debt)
   - Story N.1 (feature)
   - Story N.2 (feature)

⏳ Waiting for Depth 0 completion...

✅ Depth 0 complete:
   - Story N.0: Done
   - Story N.1: Done (2 issues fixed)
   - Story N.2: Partial (re-running)

🚀 Launching Depth 1 stories (now unblocked):
   - Story N.3
   - Story N.4

🏁 Sprint complete: 5/5 stories done
```

### Example: Parallel Execution

**WRONG** (Sequential):
```
Task 1: Implement Story 4.0
[wait for completion]
Task 2: Implement Story 4.1
[wait for completion]
Task 3: Implement Story 4.2
```

**RIGHT** (Parallel):
```
Single message with 3 Task tool invocations:
- Task 1: Implement Story 4.0
- Task 2: Implement Story 4.1
- Task 3: Implement Story 4.2
[all run simultaneously]
```

## Error Handling

### Common Issues & Solutions

1. **Import Errors**:
   - Check similar files for import patterns
   - Copy exact import syntax

2. **Type Errors**:
   - Review system-capabilities for type patterns
   - Check coding-standards for guidance

3. **Blocked Stories**:
   - Complete dependencies first
   - Retry with updated context

4. **Test Failures**:
   - Launch new senior-dev with fix requirements
   - Include test failure details

## Success Criteria

✅ All stories marked complete in TodoWrite
✅ All acceptance criteria verified
✅ Quality gates passing
✅ Story files updated with implementation notes
✅ Sprint summary created

---

*This workflow ensures systematic sprint execution with proper verification and documentation.*
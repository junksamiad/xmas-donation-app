# Sprint Archival Plan

## Overview
This document defines the standard process for archiving completed sprints and maintaining system documentation.

## Directory Structure

```
/docs
├── /archive
│   ├── /phase-2
│   │   └── /sprint-3
│   │       ├── prd.md                 # Sprint-specific PRD
│   │       ├── architecture.md        # Sprint-specific architecture
│   │       ├── story-3.1.md          # Completed stories
│   │       ├── story-3.2.md
│   │       └── ...
│   ├── /sprint-summaries
│   │   └── sprint-3-summary.md       # Sprint completion summary
│   └── /system-docs                  # Archived redundant system docs
├── /further-spec-docs
│   ├── system-capabilities.md        # Single source of truth (consolidated)
│   ├── coding-standards.md           # Development guidelines
│   ├── source-tree.md                # Directory structure reference
│   └── brownfield-context.md         # Historical context
├── /sprint-management
│   ├── archival-plan.md             # This document
│   └── sprint-transition-workflow.md # Sprint transition process
└── /stories                          # Active/future stories only
```

## Archival Process

### Step 1: Review Completed Stories
- Identify all stories marked as completed in the current sprint
- Review their implementation status
- For incomplete stories, create `/docs/post-sprint-[N]-tech-debt.md` using template below

### Step 2: Archive Sprint Documents
- Create archive directory: `/docs/archive/phase-[N]/sprint-[N]/`
- Move completed stories from `/docs/stories/` to archive
- Move sprint-specific PRD and architecture docs to archive
- Keep story numbering intact (e.g., story-3.1.md)

### Step 3: Validate & Update System Capabilities ⭐
**Critical Step - Synchronize Documentation with Reality**

1. **Run Validation**
   - Use `story-code-validator` agent to verify implementations
   - Run multiple validators in parallel for efficiency
   - Confirm all technical assertions match codebase

2. **Update Documentation**

   **system-capabilities.md** - Update all layers as needed:
   - Application, Security, Infrastructure, DevOps, Integration, Quality
   - Modify existing sections, add new capabilities, remove deprecated
   - Document ONLY what validators confirmed exists and works

   **source-tree.md** - Update structure:
   - New directories and key files
   - Restructured folders
   - Removed items

3. **Documentation Scope**
   - Include: Working infrastructure, DevOps, configs, security
   - Exclude: Future plans, partial features, broken code

### Step 4: Create Sprint Summary
- Location: `/docs/archive/sprint-summaries/sprint-[N]-summary.md`
- Contents:
  - List of completed stories with descriptions
  - Key features implemented
  - Technical achievements
  - Validation results
  - Deferred items
  - Lessons learned

### Step 5: Clean Working Directory
- Ensure `/docs/stories/` contains only active/future stories
- Clear `/docs/` for next sprint's PRD and architecture (except tech debt doc)
- Verify all sprint work is properly archived
- Confirm `/docs/post-sprint-[N]-tech-debt.md` exists if there were incomplete items

## Document Management Strategy

### Active Documents (Keep Updated)
- **system-capabilities.md**: Consolidated technical reference
  - Living snapshot of working features across all layers
  - Updated after each sprint with validated changes
- **source-tree.md**: Directory structure reference
- **coding-standards.md**: Development guidelines
- **brownfield-context.md**: Historical reference

### Sprint-Specific Documents (Archive After Sprint)
- Sprint PRD (`/docs/prd.md`)
- Sprint Architecture (`/docs/architecture.md`)
- Completed stories (`/docs/stories/story-*.md`)

### Benefits of This Approach
1. **Clean Sprint Isolation**: Each sprint's context is preserved
2. **Single Source of Truth**: system-capabilities.md eliminates duplication
3. **Efficient Planning**: Next sprint can reference consolidated capabilities
4. **Reduced Maintenance**: No need to update multiple overlapping docs
5. **Clear History**: Complete audit trail of each sprint

## Validation Requirements

Before marking any capability as "available" in system-capabilities.md:
1. Code must exist and compile
2. Tests must pass (if applicable)
3. Feature must be accessible/usable
4. Documentation must match implementation

## Sprint Transition Workflow

1. **Sprint Completion**
   - Run this archival process
   - Validate all implementations
   - Update system capabilities
   - Create tech debt document if needed

2. **Sprint Planning**
   - Reference system-capabilities.md
   - **Review `/docs/post-sprint-[N]-tech-debt.md` FIRST**
   - Convert tech debt items to pre-sprint stories
   - Create new PRD and architecture in `/docs/`
   - Write new stories based on validated capabilities

3. **Sprint Execution**
   - Implement stories
   - Update stories with completion status
   - Document new patterns discovered

4. **Repeat**
   - Archive completed sprint
   - Build on validated capabilities
   - Maintain clean working directory

## Command Reference

```bash
# Create archive structure
mkdir -p /docs/archive/phase-2/sprint-3

# Move documents (example)
mv /docs/prd.md /docs/archive/phase-2/sprint-3/
mv /docs/architecture.md /docs/archive/phase-2/sprint-3/
mv /docs/stories/story-3.*.md /docs/archive/phase-2/sprint-3/

# Validate implementations
# Use Task tool with story-code-validator agent

# Create summary
touch /docs/archive/sprint-summaries/sprint-3-summary.md
```

## Example: System Capabilities Update

After Sprint 3, the Authentication section evolved from basic hashing to include:
- API Key Authentication (SHA-256 hashed)
- Role-Based Access Control (ADMIN, SUPER_ADMIN, VIEWER)
- Rate Limiting (progressive delays via Vercel KV)

Plus new Infrastructure section documenting PostgreSQL, Vercel KV, and hosting configuration.

## Tech Debt Document Template

```markdown
# Post-Sprint [N] Tech Debt

## Incomplete Stories
### Story [X.Y]: [Title]
- **Completed**: [What was implemented]
- **Remaining**: [What needs to be done]
- **Blocker**: [Why incomplete]
- **Priority**: HIGH/MEDIUM/LOW

## Next Sprint Recommendations
- [Items to handle as Story N.0 (pre-sprint)]
- [Dependencies to consider]
```

## Critical Decision Points for Agents

### What Goes in system-capabilities.md?

**Include (if validated as working):**
- ✅ Application patterns (components, services, utilities)
- ✅ Security implementations (auth, encryption, rate limiting)
- ✅ Infrastructure (databases, caching, hosting)
- ✅ DevOps tools (CI/CD, monitoring, deployment)
- ✅ Integration endpoints (APIs, webhooks, file processing)
- ✅ Quality patterns (testing, linting, build configs)

**Exclude:**
- ❌ Planned/future features
- ❌ Partially implemented code
- ❌ Broken functionality
- ❌ Aspirational patterns

### Other Key Decisions

**What counts as "completed"?**
- Explicit status markers in stories (✅ Completed)
- All acceptance criteria checkboxes checked

**What gets archived?**
- ALL Sprint stories (complete or incomplete)
- Sprint-specific PRD and architecture docs

**What goes in tech debt?**
- Partially complete stories
- Unmet acceptance criteria
- Technical blockers encountered

**What stays in /docs/stories/?**
- Only future sprint stories (not attempted yet)

## Notes

- Never delete documents, always archive
- Validate before documenting capabilities
- Keep system-capabilities.md as single source of truth
- Use parallel validation for efficiency
- Tech debt document ensures nothing is lost between sprints
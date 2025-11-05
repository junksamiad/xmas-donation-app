# Sprint Planning Workflow

## Overview
This document defines the standard process for planning new sprints based on validated system capabilities and business objectives.

## Prerequisites
- Sprint archival completed (see archival-plan.md)
- system-capabilities.md updated with validated features
- Tech debt document reviewed (if exists from previous sprint)

## Directory Structure for New Sprint

```
/docs
├── prd.md                           # Sprint-specific PRD (created during planning)
├── post-sprint-[N-1]-tech-debt.md   # Tech debt from previous sprint (if exists)
├── /stories
│   ├── story-[N].1.md              # New sprint stories
│   ├── story-[N].2.md
│   └── ...
├── /further-spec-docs
│   ├── system-capabilities.md       # Current system snapshot (reference)
│   └── brownfield-context.md        # Historical context (reference)
└── /spec_templates
    ├── sprint-prd-template.md       # Template for PRD
    └── sprint-story-template.md     # Template for stories
```

## Sprint Planning Process

### Step 1: Understand Current State 📊
**Purpose**: Agent establishes baseline understanding of what exists

1. **Read System Documentation**
   - `/docs/further-spec-docs/system-capabilities.md` - Current capabilities
   - `/docs/further-spec-docs/source-tree.md` - File organization
   - `/docs/further-spec-docs/coding-standards.md` - Standards and quality requirements
   - `/docs/further-spec-docs/brownfield-context.md` - Historical context

2. **Check for Tech Debt**
   - Look for `/docs/post-sprint-[N-1]-tech-debt.md`
   - If exists, HIGH priority items become Story N.0 (pre-sprint)

### Step 2: Direct Sprint Proposal 🎯
**Purpose**: Agent immediately proposes next sprint based on documentation review

```markdown
"Next sprint should be: [Specific feature/capability]

Why: [1-2 key reasons]

Tech debt (Story N.0): [HIGH priority items from tech debt doc, if any]

Does this align with your priorities?"
```

User confirms or redirects → Agent adjusts if needed

### Step 3: Sprint Blueprint & Story Drafting 📝
**Purpose**: Define sprint blueprint and create initial story drafts

1. **Present Sprint Blueprint**
   Agent proposes concrete implementation plan:
   ```markdown
   "Here's how we'll implement [sprint goal]:

   **Story 1: [Title]**
   - What: [Brief description]
   - Why: [Value/purpose]
   - How: [Technical approach]

   **Story 2: [Title]**
   - What: [Description]
   - Why: [Value]
   - How: [Approach]

   [Include tech debt stories if applicable]

   This breakdown makes sense because:
   - [Logical sequencing]
   - [Dependencies handled]

   Thoughts on this approach?"
   ```

2. **Interactive Refinement**
   - User provides feedback on blueprint
   - Agent adjusts story breakdown
   - Back and forth until solid direction agreed

3. **Commit Initial Story Drafts**
   - Once blueprint agreed, create story files
   - **USE TEMPLATE**: Copy `/docs/spec_templates/sprint-story-template.md` for each story
   - Create `/docs/stories/story-N.X.md` for each story
   - Tech debt becomes story-N.0.md (if HIGH priority items exist)
   - Basic structure in place for detailed work

### Step 4: Story Detail Refinement 🔍
**Purpose**: Deep dive into story specifics with user

1. **Work Through Each Story**
   For each drafted story, agent presents:
   ```markdown
   "Let's detail Story N.X: [Title]

   **Current implementation plan:**
   - [Specific technical steps]
   - [UI/UX details if applicable]
   - [Data model changes]
   - [API endpoints]

   **Acceptance Criteria:**
   - [ ] [Specific testable requirement]
   - [ ] [Another requirement]

   Is this exactly what you need, or should we adjust?"
   ```

2. **Interactive Drilling Down**
   - **Most interactive part of process**
   - User challenges/refines implementation details
   - Agent adjusts technical approach
   - Discuss edge cases and error handling
   - Confirm UI/UX expectations
   - Validate business logic

3. **Testing Strategy for Each Story**
   Agent asks:
   ```markdown
   "Testing for this story:

   Should we test after implementing? Options:
   - Smoke test (manual quick check)
   - Automated browser test (Playwright MCP)
   - Simple API tests
   - Other scripted tests
   - Skip (test at sprint end)

   Run quality gates (lint/typecheck/build)?
   - After this story
   - At sprint end only

   Your preference?"
   ```

4. **Tech Debt Story N.0**
   If HIGH priority tech debt exists:
   ```markdown
   "Tech Debt Story N.0: [Issue from tech debt doc]

   Must be completed before other stories can proceed.
   Ready to include?"
   ```

5. **Update Story Files**
   - Modify `/docs/stories/story-N.X.md` with refined details (following template structure)
   - Ensure all acceptance criteria are clear
   - Technical approach fully specified
   - Add testing strategy decision to story:
     ```markdown
     ## Testing Strategy
     - **Test Type**: [Smoke/Browser/API/None]
     - **Quality Gates**: [After story/Sprint end]
     ```

### Step 5: Finalize Sprint Documentation ✅
**Purpose**: Lock in sprint plan with aligned PRD and stories

1. **Finalize All Stories**
   - Ensure all `/docs/stories/story-N.*.md` files updated
   - Each story has clear acceptance criteria
   - Technical approaches are specific and actionable
   - Dependencies documented

2. **Create Sprint PRD**
   - **USE TEMPLATE**: Copy `/docs/spec_templates/sprint-prd-template.md` as starting point
   - Write to `/docs/prd.md`
   - Ensure PRD tightly aligns with stories:
     ```markdown
     # Sprint [N] PRD

     ## Sprint Goal
     [Aligned with story outcomes]

     ## Stories Included
     - Story N.1: [Title]
     - Story N.2: [Title]
     [Including any tech debt stories]

     ## Success Criteria
     [Derived from story acceptance criteria]
     ```

3. **Final Confirmation**
   ```markdown
   "Sprint [N] ready to execute:

   Goal: [One line summary]

   Stories finalized:
   - [List with one-line descriptions]

   Tech debt included: [Yes/No - which items]

   All set?"
   ```

## Streamlined Process Example

```
Step 1: Agent reviews system → "You have API, admin panel, auth system working"

Step 2: Agent proposes → "Next logical step: Customer self-service portal. Makes sense?"
        User → "Yes" or "No, let's do X instead"

Step 3: Agent blueprints → "3 stories: 1) Customer registration 2) Customer login 3) Customer dashboard"
        User → "Add password reset too"
        Agent → "Updated: 4 stories including password reset"

Step 4: Agent drills down → "Story 1 details: Registration will use existing auth patterns,
                             add /register page, validate email uniqueness. Good?"
        User → "Also need email verification"
        Agent → Updates story with email verification

Step 5: Agent finalizes → "Sprint 4: Customer Portal. 4 stories locked. PRD created. Ready?"
```

## Core Principles

1. **Get to the Point**: Agent makes direct proposals, not open-ended discovery
2. **Focus on Implementation**: Spend most time on story details (Step 4)
3. **Build on Reality**: Use validated system-capabilities.md
4. **Tech Debt First**: Always consider before new features
5. **Interactive Refinement**: But only where it matters - story details

## Simplified Flow

1. **Review** → What exists (quick scan of docs)
2. **Propose** → Next logical sprint (direct suggestion)
3. **Blueprint** → Break into stories (initial draft)
4. **Detail** → Deep dive each story (most interactive)
5. **Finalize** → Lock PRD and stories (wrap up)

## Architecture Doc Consideration

After completing sprint planning, the agent should assess whether an architecture doc is needed.

### Architecture Doc IS Needed When:
1. **New Patterns/Technologies** outside AI knowledge:
   - New SDK/library post-cutoff date
   - Proprietary internal patterns
   - Domain-specific architectures

2. **Complex State Management**:
   - Multi-service orchestration
   - Event-driven architectures
   - Cache invalidation strategies

3. **Breaking Changes**:
   - Migrating from pattern A to pattern B
   - Refactoring core systems
   - Database schema overhauls

4. **Integration-Heavy Sprints**:
   - Third-party webhooks
   - Complex API integrations
   - Multi-system data flows

### Architecture Doc NOT Needed When:
- Standard CRUD features
- UI additions using existing patterns
- Bug fixes
- Simple feature extensions

### Agent Final Check:
```markdown
"Sprint planning complete!

Reviewing for architecture doc need...
[Agent assesses based on criteria above]

My assessment: [This sprint does/doesn't need architecture doc because...]

If needed, recommend running: /generate-architecture
This will create a focused doc for any patterns not in system-capabilities."
```

---

*This workflow ensures each sprint builds efficiently on validated foundations while addressing business priorities and technical health.*
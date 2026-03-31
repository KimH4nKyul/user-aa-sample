# System Orchestration

This document is the control plane for the entire system.

---

## GLOBAL CONTEXT (READ FIRST)

The system consists of:

- Requirements:
  - requirements/functional.md
  - requirements/non-functional.md
  - requirements/constraints.md

- Architecture:
  - architecture/principle.md
  - architecture/software-architecture.md
  - architecture/src-structure.md

- Domains:
  - domains/auth/domain.md
  - domains/user/domain.md

- API:
  - api/auth/api-spec.md
  - api/user/api-spec.md

- Shared:
  - shared/events.md

- Decisions:
  - decisions/adr-index.md
  - decisions/*.md

---

## DOCUMENT PRIORITY (CRITICAL)

When conflicts occur, follow this order:

1. ADR (decisions)
2. Domain
3. Architecture
4. API
5. Requirements

---

## DOCUMENT SELECTION RULES

### Signup Flow

MUST USE:
- domains/auth/domain.md
- domains/user/domain.md
- shared/events.md
- api/auth/api-spec.md
- decisions/*

---

### Login Flow

MUST USE:
- domains/auth/domain.md
- api/auth/api-spec.md
- decisions/*

---

### User Management

MUST USE:
- domains/user/domain.md
- api/user/api-spec.md

---

## DOCUMENT LOADING RULE (CRITICAL)

When selecting documents:

- MUST explicitly load and reference their content
- MUST NOT assume knowledge without reading documents
- MUST treat documents as the source of truth

If a document is listed:
- it MUST be read before implementation

---

## EXECUTION WORKFLOW (MANDATORY)

When performing any task:

1. Identify task type (signup, login, user management, etc.)
2. Select required documents based on rules
3. Load all relevant documents into context
4. Apply ADR constraints
5. Apply domain rules
6. Apply architecture constraints
7. Implement solution
8. Validate solution

DO NOT skip any step.

---

## IMPLEMENTATION RULES

- MUST follow Clean Architecture
- MUST respect domain boundaries
- MUST use event-driven communication
- MUST NOT violate dependency rules

---

## STATE MANAGEMENT (CRITICAL)

To support resumable execution, maintain progress state.

### State File

```text
.orchestration/state.json
```

---

### State Format

```json
{
  "currentTask": "",
  "step": "",
  "completedSteps": [],
  "artifacts": []
}
```

---

## STATE UPDATE RULE (MANDATORY)

At each step:

- MUST update step
- MUST append to completedSteps
- MUST persist changes

Before moving forward:

- MUST confirm state is saved

---

## STEP IDENTIFIERS

Use the following step names:

- analyze-task
- select-documents
- load-documents
- apply-adr
- apply-domain
- apply-architecture
- implement
- validate
- complete

---

## RECOVERY RULES (CRITICAL)

If execution is interrupted:

1. Load .orchestration/state.json
2. Identify last completed step
3. Resume from next step

MUST NOT:

- restart from beginning
- repeat completed steps

---

## TASK BREAKDOWN RULE

Large tasks MUST be split into:

- API implementation
- Application layer
- Domain validation
- Infrastructure implementation

---

## INCREMENTAL IMPLEMENTATION (IMPORTANT)
- MUST implement in small steps
- MUST validate each step before proceeding
- MUST NOT generate entire system at once

---

## ARTIFACT TRACKING
- MUST record all created/modified files

Example:

```json
"artifacts": [
  "src/auth/application/signup.service.ts",
  "src/auth/domain/auth-user.entity.ts"
]
```

---

## VALIDATION LOOP (CRITICAL)

After implementation:

REPEAT until all checks pass:

1. Run build
2. Run lint
3. Run type check (if applicable)
4. Fix all errors
5. Re-run all checks

Exit loop ONLY when:

- build succeeds
- lint has zero errors

---

## COMPLETION RULES (CRITICAL)

A task is NOT complete until:

- Build succeeds
- Lint passes with zero errors
- Type checks pass
- No unused imports or variables
- Code follows conventions

MUST NOT:

- finish task early

---

## PROJECT COMMANDS

Use the following commands:

- Build:
  - npm run build
- Lint:
  - npm run lint -- --fix
- Type Check:
  - npm run type-check
- Test:
  - npm test

---

## ERROR HANDLING (CRITICAL)

If validation fails:

- MUST:
  - analyze error
  - fix code
  - retry validation
- MUST NOT:
  - ignore errors
  - skip validation

---

## OUTPUT RULE (IMPORTANT)

After completion:

- MUST report:

Example:

- build: success
- lint: no errors
- type-check: success
- fixes applied: 2

---

## VALIDATION CHECKLIST (MANDATORY)
- [ ] Domain rules respected
- [ ] No cross-domain violation
- [ ] Events used correctly
- [ ] Architecture rules followed
- [ ] API spec matched

---

## FAILURE HANDLING

If ambiguity occurs:

- prefer ADR over domain
- prefer domain over assumptions

If still unclear:

- ask for clarification

---

## EXECUTION MODE

This document MUST be treated as:

- system prompt
- rule engine
- workflow manager
- execution controller

ALL actions MUST comply with this document.

---

## TDD RULE (CRITICAL)

Before implementation:

- MUST read domain TDD document
- MUST derive required components from test cases

Implementation MUST:
- satisfy all test cases

MUST NOT:
- implement without test definition

---

## TDD EXECUTION FLOW

1. Read tdd.md
2. Extract test cases
3. Identify required components
4. Implement minimal code to pass tests
5. Run tests
6. Fix failures
7. Refactor

REPEAT until all tests pass

---

## TEST COMPLETION RULE

A task is NOT complete until:

- All test cases are implemented
- All tests pass
- No failing scenarios remain
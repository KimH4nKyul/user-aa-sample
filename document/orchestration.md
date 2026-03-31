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
  - domains/*/domain.md
  - domains/*/tdd.md

- API:
  - api/*/api-spec.md

- Shared:
  - shared/*.md

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

### Task Classification

Classify task first, then select documents.

Supported task classes:

- feature
- bugfix
- refactor
- integration
- migration
- test-only
- docs-only

### Mandatory Baseline Documents

MUST USE for all task classes:

- requirements/constraints.md
- architecture/principle.md
- architecture/software-architecture.md
- decisions/adr-index.md
- decisions/*.md

### Domain-Specific Selection

For each impacted domain `X`:

MUST USE:
- domains/X/domain.md
- domains/X/tdd.md (if exists)
- api/X/api-spec.md (if external contract is affected)

### Cross-Domain Selection

If task touches 2+ domains:

MUST ALSO USE:
- shared/*.md relevant to integration contract
- all impacted domains' domain/TDD/API docs

### API Change Selection

If request/response, endpoint, event schema, or DTO changes:

MUST USE:
- related api/*/api-spec.md
- shared/*.md related to contracts/events

### Infra/Platform Selection

If task is infra/platform/internal tooling:

MUST USE:
- architecture/*.md relevant to dependency/infrastructure rules
- ADRs related to runtime, deployment, persistence, messaging

---

## DOCUMENT LOADING RULE (CRITICAL)

When selecting documents:

- MUST explicitly load and reference their content
- MUST NOT assume knowledge without reading documents
- MUST treat documents as the source of truth

If a document is selected:
- it MUST be read before implementation

---

## EXECUTION WORKFLOW (MANDATORY)

When performing any task:

1. Identify task class and impacted domains/contracts
2. Select required documents by rules
3. Load all selected documents into context
4. Apply ADR constraints
5. Apply domain and architecture constraints
6. Implement solution incrementally
7. Validate solution
8. Complete and report

DO NOT skip any step.

---

## IMPLEMENTATION RULES

- MUST follow Clean Architecture
- MUST respect domain boundaries
- MUST use event-driven communication where defined
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
  "taskClass": "",
  "impactedDomains": [],
  "step": "",
  "completedSteps": [],
  "selectedDocuments": [],
  "artifacts": []
}
```

---

## STATE UPDATE RULE (MANDATORY)

At each step:

- MUST update `step`
- MUST append to `completedSteps`
- MUST persist changes

When scope changes:

- MUST update `impactedDomains`
- MUST update `selectedDocuments`

Before moving forward:

- MUST confirm state is saved

---

## STEP IDENTIFIERS

Use the following step names:

- analyze-task
- classify-task
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

- contract/interface updates
- application/use-case implementation
- domain model/rules implementation
- infrastructure implementation
- integration/verification

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
  "src/<domain>/application/<use-case>.service.ts",
  "src/<domain>/domain/<entity-or-policy>.ts"
]
```

---

## VALIDATION LOOP (CRITICAL)

After implementation:

REPEAT until all checks pass:

1. Run build
2. Run lint
3. Run type check (if applicable)
4. Run tests relevant to impacted scope
5. Fix all errors/failures
6. Re-run checks

Exit loop ONLY when:

- build succeeds
- lint has zero errors
- relevant tests pass

---

## COMPLETION RULES (CRITICAL)

A task is NOT complete until:

- Build succeeds
- Lint passes with zero errors
- Type checks pass
- Relevant tests pass
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
  - task class
  - impacted domains
  - selected documents
  - build status
  - lint status
  - type-check status
  - test status
  - fixes applied count

---

## VALIDATION CHECKLIST (MANDATORY)

- [ ] Domain rules respected
- [ ] No cross-domain violation
- [ ] Contracts/API/events matched
- [ ] Architecture rules followed
- [ ] ADR decisions respected

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

- MUST read impacted domains' tdd.md when present
- MUST derive required components from test cases

Implementation MUST:

- satisfy all applicable test cases

MUST NOT:

- implement without test definition when TDD exists

---

## TDD EXECUTION FLOW

1. Read impacted `tdd.md`
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

- All applicable test cases are implemented
- All relevant tests pass
- No failing scenarios remain

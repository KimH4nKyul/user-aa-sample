# Software Architecture

This project follows Clean Architecture.

---

## Layered Structure
- Entry-point(Presentation) Layer
- Application Layer
- Domain Layer
- Infrastructure Layer

---

## Layer Responsibilities

### Entry-point Layer
- Handles HTTP / API requests
- Converts request/response
- Calls Application Layer

MUST NOT:
- Contain business logic
- Access database directly

---

### Application Layer
- Orchestrates services
- Coordinates domain objects
- Handles transactions

MUST:
- Use domain entities and services

MUST NOT:
- Contain core business rules
- Depend on infrastructure implementations

---

### Domain Layer (CORE)

- Contains business logic
- Defines entities, value objects, aggregates
- Defines domain services
- Defines repository interfaces

MUST:
- Be framework-independent
- Contain all business rules

MUST NOT:
- Depend on other layers
- Use external libraries (DB, HTTP, etc.)

---

### Infrastructure Layer

- Implements repository interfaces
- Handles DB, messaging, external APIs

MUST:
- Implement interfaces defined in domain

MUST NOT:
- Contain business logic

---

## Dependency Rule (CRITICAL)

Dependencies MUST point inward:

```text
Entry-point → Application → Domain
Infrastructure → Domain
```

- Domain MUST NOT depend on any layer
- Application MUST NOT depend on Infrastructure directly

---

## Data Flow

Example: Signup

1. Entry-point receives request
2. Calls Application service
3. Application executes use case
4. Domain enforces business rules
5. Infrastructure persists data
6. Event is published

---

## Cross-Service Communication

- MUST use event-driven communication
- MUST NOT directly access another service database

---

## Domain Separation (IMPORTANT)

- Auth Domain:
    - authentication only

- User Domain:
    - user persistence only

MUST NOT:
- Mix responsibilities across domains

---

## Example Flow (Signup)

- Auth Service:
    - validate input
    - hash password
    - emit event

- User Service:
    - consume event
    - persist user

---

## Implementation Rules (LLM IMPORTANT)

- MUST:
    - Separate layers into distinct modules/packages
    - Use interfaces for repositories
    - Inject dependencies via constructor

- MUST NOT:
    - Skip layers
    - Directly instantiate infrastructure in domain/application

---

## Output Constraints (CRITICAL)

When generating code:

- MUST follow layer structure
- MUST respect dependency direction
- MUST separate domain logic from infrastructure
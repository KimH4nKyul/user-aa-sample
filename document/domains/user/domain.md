# User Domain

## Responsibility

- Manages user persistence and lifecycle
- Owns user profile data
- Reacts to external events to create/update users

---

## Domain Model

### Entity: User

- id: UUID
- email: string
- status: ACTIVE | INACTIVE
- createdAt: datetime

---

## Value Objects

### Email
- must be valid format
- must be unique

---

## Aggregates

### User (Aggregate Root)

- Controls all state changes of user

---

## Domain Services

### UserDomainService

Responsibilities:
- validate email uniqueness
- enforce user lifecycle rules

MUST:
- contain business logic only

MUST NOT:
- access database directly

---

## Repository Interfaces

### UserRepository

Methods:
- save(user: User): void
- findByEmail(email: Email): User | null
- existsByEmail(email: Email): boolean

MUST:
- be defined in domain layer

MUST NOT:
- contain implementation

---

## Use Cases (Application Layer Mapping)

- createUser
- activateUser
- deactivateUser

---

## Business Rules (CRITICAL)

- MUST:
    - Email MUST be unique
    - User MUST be created on UserJoinRequested event
    - User lifecycle MUST be controlled by domain

- MUST NOT:
    - Handle authentication logic
    - Process raw password
    - Hash password

---

## Events

### Produced Events

#### UserCreated
- id: UUID
- email: string

---

### Consumed Events

#### UserJoinRequested
- id: UUID
- email: string
- passwordHash: string

---

## Event Handling Rules (CRITICAL)

- MUST:
    - Treat UserJoinRequested as source of truth
    - Create user when event is received

- MUST NOT:
    - Re-hash password
    - Validate password
    - Reject event due to password concerns

---

## Invariants

- email must be unique
- user must exist after successful event processing

---

## State Transitions

- PENDING → ACTIVE
- ACTIVE → INACTIVE

---

## Application Layer Mapping (IMPORTANT)

### createUser

Flow:
1. Receive UserJoinRequested event
2. Check email uniqueness via repository
3. Create User entity
4. Save user
5. Emit UserCreated event

---

## Entry-Point Mapping

- consumer:
    - handles UserJoinRequested event

- http-api:
    - optional (admin or user management)

---

## Infrastructure Mapping

- database:
    - UserRepository implementation

- message:
    - event consumer (UserJoinRequested)
    - event producer (UserCreated)

---

## Dependency Rules

- MUST depend only on:
    - domain types
    - domain interfaces

- MUST NOT depend on:
    - infrastructure
    - auth domain

---

## Anti-Corruption Rules (IMPORTANT)

- Password is opaque data in this domain
- Treat passwordHash as external data

---

## Example Flow

### Event-Driven User Creation

1. Auth service emits UserJoinRequested
2. User consumer receives event
3. Application layer handles use case
4. Domain validates rules
5. Repository persists user
6. UserCreated event emitted
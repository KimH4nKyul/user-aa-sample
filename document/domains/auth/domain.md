# Auth Domain

## Responsibility

- Handles authentication only
- Manages credentials and authentication state
- Issues and validates tokens

---

## Domain Model

### Entity: AuthUser

- id: UUID
- email: string
- passwordHash: string
- status: ACTIVE | PENDING

---

## Value Objects

### Email
- must be valid format

### Password
- raw password MUST NOT be stored
- must be hashed before any usage

### Token
- represents authentication result
- must be stateless (e.g. JWT)

---

## Aggregates

### AuthUser (Aggregate Root)

- Controls authentication-related state

---

## Domain Services

### AuthDomainService

Responsibilities:
- validate credentials
- verify password hash
- handle authentication rules

MUST:
- contain authentication logic only

MUST NOT:
- persist user data
- access database directly

---

## Repository Interfaces

### AuthUserRepository

Methods:
- findByEmail(email: Email): AuthUser | null
- save(authUser: AuthUser): void

MUST:
- be defined in domain layer

MUST NOT:
- contain implementation

---

## Use Cases (Application Layer Mapping)

- signup
- login
- validateToken

---

## Business Rules (CRITICAL)

- MUST:
    - Password MUST be hashed before persistence or event emission
    - Authentication MUST be stateless
    - Credentials MUST be validated before issuing token

- MUST NOT:
    - Store raw password
    - Expose raw password
    - Manage user profile data

---

## Events

### Produced Events

#### UserJoinRequested
- id: UUID
- email: string
- passwordHash: string

#### UserLoggedIn
- id: UUID

---

## Consumed Events

(None)

---

## Event Rules (CRITICAL)

- MUST:
    - Emit UserJoinRequested after signup
    - Include hashed password only

- MUST NOT:
    - Emit raw password
    - Depend on user domain response synchronously

---

## Invariants

- passwordHash must always exist
- authentication must not depend on external state

---

## State Transitions

- PENDING → ACTIVE (optional, depending on verification)
- ACTIVE → ACTIVE (login)

---

## Application Layer Mapping (IMPORTANT)

### signup

Flow:
1. Receive email + password
2. Validate input
3. Hash password
4. Create AuthUser
5. Save AuthUser
6. Emit UserJoinRequested event

---

### login

Flow:
1. Receive email + password
2. Find AuthUser by email
3. Verify password hash
4. Issue token
5. Emit UserLoggedIn event

---

### validateToken

Flow:
1. Receive token
2. Validate signature
3. Return authentication result

---

## Entry-Point Mapping

- http-api:
    - signup endpoint
    - login endpoint

- consumer:
    - (none by default)

- scheduler:
    - optional (token cleanup / expiration jobs)

---

## Infrastructure Mapping

- database:
    - AuthUserRepository implementation

- message:
    - event producer (UserJoinRequested, UserLoggedIn)

- api:
    - optional external auth provider

---

## Dependency Rules

- MUST depend only on:
    - domain types
    - domain interfaces

- MUST NOT depend on:
    - user domain
    - infrastructure implementation

---

## Anti-Corruption Rules (CRITICAL)

- User domain is external
- Auth MUST NOT rely on user persistence result

---

## Security Rules (VERY IMPORTANT)

- MUST:
    - hash password using strong algorithm (e.g. bcrypt)
    - never log password
    - never expose passwordHash externally

- MUST NOT:
    - store raw password in memory longer than necessary
    - reuse tokens insecurely

---

## Example Flow

### Signup

1. Client sends email + password
2. Auth validates input
3. Auth hashes password
4. Auth persists AuthUser
5. Auth emits UserJoinRequested

---

### Login

1. Client sends credentials
2. Auth verifies password
3. Auth issues token
4. Auth emits UserLoggedIn
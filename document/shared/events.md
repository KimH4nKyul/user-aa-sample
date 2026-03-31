# Events

This document defines all cross-domain events.

---

## Event Principles (CRITICAL)

- Events represent facts that already happened
- Events MUST be immutable
- Events MUST be idempotent

---

## Naming Rules

- MUST follow: <Entity><PastTenseVerb>
    - UserCreated
    - UserLoggedIn

- Request-type events:
    - <Entity><Action>Requested
    - UserJoinRequested

---

## Common Fields

All events MUST include:

- eventId: UUID
- occurredAt: timestamp

---

## Auth Domain Events

### UserJoinRequested

Description:
- Emitted when signup is completed in Auth domain
- Requests user creation in User domain

Producer:
- Auth domain

Consumers:
- User domain

Payload:

- eventId: UUID
- occurredAt: timestamp
- id: UUID
- email: string
- passwordHash: string
- role: ADMIN | USER

Rules:

- MUST:
    - include hashed password only
    - represent completed signup request

- MUST NOT:
    - include raw password
    - depend on User domain response

---

### UserLoggedIn

Description:
- Emitted when user successfully logs in

Producer:
- Auth domain

Consumers:
- optional (analytics, logging)

Payload:

- eventId: UUID
- occurredAt: timestamp
- id: UUID

---

## User Domain Events

### UserCreated

Description:
- Emitted when user is successfully created

Producer:
- User domain

Consumers:
- other services (optional)

Payload:

- eventId: UUID
- occurredAt: timestamp
- id: UUID
- email: string

---

## Event Flow (IMPORTANT)

### Signup Flow

1. Auth emits UserJoinRequested
2. User consumes event
3. User creates user
4. User emits UserCreated

---

## Event Contract Rules (CRITICAL)

- MUST:
    - Maintain backward compatibility
    - Add new fields in backward-compatible way

- MUST NOT:
    - Remove existing fields
    - Change field meaning

---

## Idempotency Rules

- Events MUST be safe to process multiple times

Example:
- User service MUST NOT create duplicate users if same event is received

---

## Versioning (OPTIONAL)

- Use version field if schema evolves

Example:
- version: v1

---

## Anti-Patterns (FORBIDDEN)

- Using events as commands
- Including business logic in event payload
- Sending sensitive data (raw password)
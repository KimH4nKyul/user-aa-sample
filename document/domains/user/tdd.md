# User Domain TDD

## Purpose

This document defines test cases as executable requirements.

---

## Test Strategy

- Tests define expected behavior
- Implementation MUST satisfy all tests
- Tests MUST be written before implementation

---

## Test Cases

### [TC-USER-001] Create User from Event

#### Given
- UserJoinRequested event with:
    - id
    - email
    - passwordHash

#### When
- Event is consumed

#### Then
- User is created
- Email is stored
- Status is ACTIVE
- UserCreated event is emitted

---

### [TC-USER-002] Email Uniqueness

#### Given
- Existing user with email

#### When
- Another UserJoinRequested event with same email

#### Then
- User creation MUST fail
- Duplicate MUST NOT be created

---

### [TC-USER-003] Idempotency

#### Given
- Same event received multiple times

#### When
- Processing occurs

#### Then
- Only one user MUST exist

---

## Required Components

Based on test cases, the system MUST include:

- User entity
- UserRepository
- CreateUserService (application)
- EventConsumer (entry-point)

---

## Implementation Guidance

- MUST start from test cases
- MUST implement minimal code to pass tests
- MUST NOT over-engineer

---

## Refactoring Rules

After tests pass:

- Remove duplication
- Improve naming
- Ensure clean architecture compliance

---

## Completion Criteria

- All test cases are implemented
- All tests pass
- No lint errors
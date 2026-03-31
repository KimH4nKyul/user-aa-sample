# Auth Domain TDD

## Test Cases

### [TC-AUTH-001] Signup

#### Given
- email + password

#### When
- signup is requested

#### Then
- password is hashed
- AuthUser is created
- UserJoinRequested event is emitted

---

### [TC-AUTH-002] Login Success

#### Given
- valid credentials

#### When
- login is attempted

#### Then
- token is issued
- UserLoggedIn event is emitted

---

### [TC-AUTH-003] Login Failure

#### Given
- invalid password

#### When
- login is attempted

#### Then
- authentication fails
- no token is issued

---

## Required Components

- AuthUser entity
- AuthDomainService
- AuthUserRepository
- SignupService
- LoginService
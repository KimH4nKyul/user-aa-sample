# Functional Requirements

## User Registration

- User MUST be able to sign up using email and password
- System MUST validate email format
- System MUST ensure email uniqueness
- System MUST create a user after signup request

---

## Authentication

- User MUST be able to log in with email and password
- System MUST verify credentials
- System MUST issue an authentication token on successful login

---

## User Management

- System MUST store user information
- System MUST allow user activation and deactivation

---

## Event Handling

- System MUST create user after receiving signup event
- System MUST process events asynchronously
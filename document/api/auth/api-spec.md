# Auth API Specification

## Base Path

/auth

---

## POST /signup

### Description
- Register a new user

---

### Request

```json
{
  "email": "string",
  "password": "string"
}
``` 

---

### Response

#### 200 OK

```json
{
  "id": "uuid",
  "email": "string"
}
```

---

### Rules

- MUST:
  - validate email format
  - hash password before processing

- MUST NOT:
  - return password or passwordHash

---

### Side Effects

- Emits:
  - UserJoinRequested event

---

## POST /login

### Description
- Authenticate user

---

### Request

```json
{
  "email": "string",
  "password": "string"
}
```

---

### Response

#### 200 OK

```json
{
  "accessToken": "string"
}
``` 

---

### Rules

- MUST:
  - verify credentials
  - issue token

- MUST NOT:
  - expose passwordHash

---

### Side Effects

- Emits:
  - UserLoggedIn event

---

## GET /validate-token

### Description
- Validate authentication token

---

### Request

Header:
- Authorization: Bearer <token>

---

### Response

#### 200 OK

```json
{
  "userId": "uuid",
  "valid": true
}
``` 

---

### Rules

- MUST:
  - validate token signature
  - be stateless
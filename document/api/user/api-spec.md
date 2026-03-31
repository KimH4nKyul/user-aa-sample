# User API Spec.

# User API Specification

## Base Path

/users

---

## GET /:id

### Description
- Get user by ID

---

### Response

#### 200 OK

```json
{
  "id": "uuid",
  "email": "string",
  "status": "ACTIVE | INACTIVE"
}
``` 

---

---

## POST /

### Description
- Create user (optional, usually event-driven)

---

### Rules

- SHOULD:
  - be created via event (UserJoinRequested)

---

## PATCH /:id/activate

### Description
- Activate user

---

### Response

#### 200 OK

```json
{
  "id": "uuid",
  "status": "ACTIVE"
}
``` 

---

---

## PATCH /:id/deactivate

### Description
- Deactivate user

---

### Response

#### 200 OK

```json
{
  "id": "uuid",
  "status": "INACTIVE"
}
``` 

---

## Rules

- MUST:
  - not handle authentication
  - not process password

---

## Side Effects

- MAY emit:
  - UserCreated
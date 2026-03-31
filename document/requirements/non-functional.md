# Non-Functional Requirements

## Performance

- System SHOULD handle high concurrent signup requests
- Event processing SHOULD be scalable

---

## Scalability

- System MUST support horizontal scaling
- Services MUST be independently deployable

---

## Security

- Password MUST be securely hashed
- System MUST NOT expose sensitive data
- Authentication MUST be stateless

---

## Reliability

- Event processing MUST be idempotent
- System SHOULD tolerate partial failures

---

## Maintainability

- Code MUST follow Clean Architecture
- Code MUST follow SOLID principles
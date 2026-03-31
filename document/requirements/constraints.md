# Constraints

## Technical Constraints

- System MUST use event-driven architecture
- Services MUST be separated by domain (auth, user)

---

## Data Constraints

- Email MUST be unique across system
- Password MUST NOT be stored in raw form

---

## Integration Constraints

- Services MUST communicate via message queue
- Direct database access between services is NOT allowed
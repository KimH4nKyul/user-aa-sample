# Architecture Principles

This project follows SOLID principles and Clean Architecture.

---

## SOLID Principles

### Single Responsibility Principle (SRP)
- Each module MUST have a single responsibility
- A module MUST NOT handle multiple domains

### Open/Closed Principle (OCP)
- Components SHOULD be open for extension
- Components MUST be closed for modification

### Liskov Substitution Principle (LSP)
- Subtypes MUST be replaceable without breaking behavior

### Interface Segregation Principle (ISP)
- Interfaces MUST be small and specific
- Clients MUST NOT depend on unused methods

### Dependency Inversion Principle (DIP)
- High-level modules MUST NOT depend on low-level modules
- Both MUST depend on abstractions

---

## General Rules (CRITICAL)

- MUST:
    - Follow layer separation strictly
    - Depend on abstractions, not implementations
    - Keep business logic independent of frameworks

- MUST NOT:
    - Mix domain logic with infrastructure code
    - Access database directly from application layer
    - Use framework-specific logic inside domain

- SHOULD:
    - Keep modules small and focused
    - Prefer composition over inheritance
# Source Structure

This project is organized by domain and follows Clean Architecture.

---

## High-Level Structure

- Each domain is isolated (auth, user)
- Each domain contains full Clean Architecture layers
- Shared module contains cross-cutting concerns

---

## Directory Structure

```text
src/
auth/
user/
shared/
```

---

## Domain Module Structure

Each domain MUST follow this structure:

```text
<domain>/
    entry-point/
    application/
    domain/
    infrastructure/
```


---

## Layer Definitions

### 1. entry-point

Handles external input.

Subdirectories:
- http-api: REST / HTTP controllers
- scheduler: cron / batch jobs
- consumer: message queue consumers

MUST:
- Convert external request → application input

MUST NOT:
- Contain business logic
- Access database directly

---

### 2. application

- Implements use cases
- Orchestrates domain logic

MUST:
- Call domain services/entities
- Handle transaction boundaries

MUST NOT:
- Contain core business rules
- Access infrastructure directly (via interface only)

---

### 3. domain (CORE)

Subdirectories:
```text
domain/
    component/
    repository/
    service/
    model/
    exception/
    types/
```


#### model
- Entities / Aggregates / Value Objects

#### repository
- Interface definitions only

#### service
- Domain services (business logic)

#### component
- Reusable domain components (pure logic)

#### exception
- Domain-specific errors

#### types
- Domain-specific types / enums

MUST:
- Contain all business rules
- Be framework-independent

MUST NOT:
- Import infrastructure
- Use DB / HTTP / external libs

---

### 4. infrastructure

Implements technical details.

Subdirectories:
```text
infrastructure/
    api/
    database/
    cache/
    message/
```


#### api
- external service clients

#### database
- repository implementations
- ORM / query logic

#### cache
- caching logic

#### message
- event publisher / consumer implementation

MUST:
- Implement domain interfaces

MUST NOT:
- Contain business logic

---

## Dependency Rules (CRITICAL)

Allowed dependencies:

- entry-point → application
- application → domain
- infrastructure → domain

NOT allowed:

- domain → any layer
- application → infrastructure (direct)
- entry-point → domain (direct)

---

## Example Dependency Flow

```text
Controller → Application Service → Domain Service → Repository Interface
                                                        ↓
                                                        Infrastructure Implementation
```

---

## Shared Module

```text
shared/
    decorators/
    types/
    utils/
    service/
    infrastructure/
```


### Purpose

- Cross-domain reusable components

MUST:
- Be generic and reusable

MUST NOT:
- Contain domain-specific logic

---

## Domain Isolation (CRITICAL)

- auth and user MUST be independent

MUST NOT:
- Import another domain directly
- Access another domain’s database

Communication MUST:
- Use events (message queue)

---

## Event Handling Rule

- consumer (entry-point) receives event
- calls application layer
- application triggers domain logic

---

## Naming Conventions

- Application Service: `<UseCase>Service`
- Domain Service: `<Entity>DomainService`
- Repository Interface: `<Entity>Repository`
- Repository Implementation: `<Entity>RepositoryImpl`

---

## Implementation Rules (LLM IMPORTANT)

- MUST:
    - Use constructor injection
    - Define repository interfaces in domain
    - Implement repositories in infrastructure

- MUST NOT:
    - Instantiate infrastructure in domain
    - Bypass application layer

---

## Anti-Patterns (STRICTLY FORBIDDEN)

- Fat Controller (business logic in entry-point)
- Anemic Domain (no logic in domain)
- Direct DB access from application
- Cross-domain imports

---

## Output Constraint

When generating code:

- MUST follow this directory structure
- MUST respect dependency direction
- MUST keep domain pure

---

## Example src structure  

```text
src
├── auth
│   ├── entry-point
│   │   ├── http-api
│   │   ├── scheduler
│   │   └── consumer 
│   ├── application
│   ├── infrastructure
│   ├── domain
│   │   ├── component
│   │   ├── repository
│   │   ├── service
│   │   ├── model
│   │   ├── exception 
│   │   └── types
├── user  
│   ├── entry-point
│   │   ├── http-api
│   │   ├── scheduler
│   │   └── consumer 
│   ├── application
│   ├── infrastructure
│   │   ├── api
│   │   ├── database
│   │   ├── cache
│   │   └── message
│   ├── domain
│   │   ├── component
│   │   ├── repository
│   │   ├── service
│   │   ├── model
│   │   ├── exception 
│   │   └── types
└── shared
│   ├── decorators
│   ├── types
│   ├── utils
│   ├── service
│   └── infrastructure
```
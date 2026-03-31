# ADR-001: JWT 기반의 역할 기반 권한 제어 (RBAC) 구현

## Status
- accepted

## Context
- 현재 상황: 시스템에 다수의 사용자가 존재하며, 서비스 간의 독립성이 보장된 Clean Architecture를 따르고 있음.
- 문제: 사용자 관리(활성화/비활성화)와 같은 민감한 기능에 대해 일반 사용자의 접근을 제한하고 관리자 권한을 가진 사용자만 수행할 수 있도록 제어가 필요함.
- 제약 조건:
  - Auth 도메인과 User 도메인은 직접적인 의존성을 가질 수 없음.
  - 인증 정보는 무상태(Stateless)여야 함 (JWT 사용).
- 고려 대상:
  - 사용자 역할(Role) 정보의 저장 및 전파 방식.
  - 권한 검증 로직의 위치 및 재사용성.

## Decision
- 우리가 선택한 것:
  - `UserRole` (`ADMIN`, `USER`) 열거형을 `shared` 영역에 정의하여 전 도메인에서 공유함.
  - Auth 도메인에서 로그인 시 JWT 토큰의 페이로드에 `role` 정보를 포함함.
  - NestJS의 `Guard`를 사용하여 HTTP 요청 단계에서 권한을 검증하는 `RolesGuard`를 구현함.
  - 도메인 간의 역할 정보 전파는 `UserJoinRequested` 이벤트를 통해 비동기적으로 수행함.
- 선택 이유:
  - JWT에 역할을 포함함으로써 추가적인 DB 조회 없이 즉각적인 권한 검증이 가능함.
  - Guard를 활용함으로써 컨트롤러 레벨에서 선언적으로 권한을 설정할 수 있어 유지보수가 용이함.
- 선택하지 않은 대안:
  - 매 요청마다 DB에서 역할을 조회하는 방식: 성능 저하 우려 및 도메인 간 직접 조회 불가 원칙 위배.

## Rules (LLM 중요)
- MUST:
  - 모든 권한이 필요한 엔드포인트에는 `@UseGuards(RolesGuard)`와 `@Roles(...)` 데코레이터를 사용해야 함.
  - `AuthUser` 생성 시 기본 역할은 `USER`로 설정해야 함.
  - 이벤트 기반의 도메인 연동 시 반드시 `role` 필드를 포함하여 정합성을 유지해야 함.
- MUST NOT:
  - User 도메인이 권한 검증을 위해 Auth 도메인의 리포지토리에 직접 접근해서는 안 됨.
  - 클라이언트에 전달되는 토큰 외의 경로로 역할 정보를 변경해서는 안 됨 (이벤트 제외).
- SHOULD:
  - 테스트 코드 작성 시 다양한 역할에 대한 접근 제어 시나리오를 포함해야 함.

## Impact
- 장점:
  - 도메인 간의 결합도를 낮추면서도 강력한 보안 제어가 가능함.
  - 확장 가능한 권한 체계를 구축함 (추후 새로운 역할 추가 용이).
- 단점:
  - 토큰이 발급된 후 역할이 변경될 경우, 토큰 만료 전까지는 이전 역할이 유지되는 한계가 있음.
- 트레이드오프: 실시간 역할 반영의 정확성보다는 시스템의 성능과 도메인 간의 독립성을 우선함.

## Scope
- 적용 범위: 전체 시스템의 API 접근 제어.
- 영향 받는 컴포넌트: `AuthController`, `UserController`, `SignupService`, `CreateUserService`, `SimpleTokenProvider`.

## Related
- domain: Auth, User
- api: /auth/login, /auth/signup, /users/:id/activate
- other adr: N/A

# User AA Sample

Layerd/Clean Architecture를 적용한 Auth 및 User 도메인 기반의 NestJS 샘플 프로젝트입니다.

## 프로젝트 개요

이 프로젝트는 NestJS를 사용하여 확장 가능하고 유지보수가 용이한 서버 사이드 애플리케이션을 구축하기 위한 기초를 제공합니다. 도메인 주도 설계(DDD)와 레이어드 아키텍처에 기반한 관심사 분리를 강조합니다.

## 기술 스택

- **프레임워크**: NestJS (v11+)
- **런타임**: Node.js
- **패키지 매니저**: pnpm
- **언어**: TypeScript
- **테스트**: Jest

## 아키텍처

이 프로젝트는 Layered + Clean 아키텍처 패턴을 따릅니다:

- **entry-point**: 외부 통신을 위한 어댑터 (HTTP 컨트롤러, 메시지 컨슈머).
- **application**: 비즈니스 로직 및 유스케이스 오케스트레이션.
- **domain**: 핵심 비즈니스 로직, 엔티티, 밸류 오브젝트(VO) 및 포트(인터페이스).
- **infrastructure**: 포트의 실제 구현체 (데이터베이스 리포지토리, 외부 API 클라이언트, 메시지 퍼블리셔).
- **shared**: 공통 타입, 열거형(Enum) 등 횡단 관심사.

## 프로젝트 모듈

### Auth 모듈
- **주요 기능**: 사용자 회원가입(Signup), 인증(Login), JWT 토큰 검증.
- **로직**: 비밀번호 해싱 및 토큰 생성/검증을 담당합니다.

### User 모듈
- **주요 기능**: 사용자 프로필 관리 및 이벤트 기반 사용자 생성.
- **로직**: Auth 모듈 등에서 발생하는 도메인 이벤트를 구독하여 사용자 레코드를 유지합니다.

## 시작하기

### 설치

```bash
$ pnpm install
```

### 애플리케이션 실행

```bash
# 개발 모드
$ pnpm run start

# 워치 모드
$ pnpm run start:dev

# 운영 모드
$ pnpm run start:prod
```

### 테스트 실행

```bash
# 유닛 테스트
$ pnpm run test

# e2e 테스트
$ pnpm run test:e2e

# 테스트 커버리지
$ pnpm run test:cov
```

## 프로젝트 구조

```text
src/
├── auth/               # 인증 도메인
│   ├── application/    # 유스케이스 (회원가입, 로그인)
│   ├── domain/         # 엔티티, VO, 포트 인터페이스
│   ├── entry-point/    # HTTP 컨트롤러
│   └── infrastructure/ # 인메모리 리포지토리, 토큰/패스워드 어댑터
├── user/               # 사용자 도메인
│   ├── application/    # 사용자 관리 로직
│   ├── domain/         # 사용자 엔티티, 리포지토리 포트
│   ├── entry-point/    # HTTP 컨트롤러, 메시지 컨슈머
│   └── infrastructure/ # 데이터베이스 및 메시지 어댑터
├── shared/             # 공유 타입 및 열거형
└── main.ts             # 애플리케이션 진입점
```

<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- List of modified principles:
  - Added Microservice Architecture & Technology Stack
  - Added Strict Layered Architecture
  - Added Data Encapsulation and Separation
  - Added Object-Oriented & SOLID Design
  - Retained Data Accuracy & Testability (merged)
- Added sections: Technology Stack Constraints
- Removed sections: None
- Templates requiring updates (✅ updated / ⚠ pending): 
  - .specify/templates/plan-template.md (⚠ pending)
  - .specify/templates/spec-template.md (⚠ pending)
  - .specify/templates/tasks-template.md (⚠ pending)
- Follow-up TODOs: 
  - TODO(SECURITY_REQUIREMENTS): Define specific compliance standards and security protocols.
-->

# Finance Constitution

## Core Principles

### I. Microservice Architecture & Technology Stack
The backend must be implemented as a microservice using the latest best practices for Spring Boot, running on the latest free OpenJDK. The UI must be implemented with React and kept entirely independent from the backend.

### II. Strict Layered Architecture
The backend must adhere to a strict layered design: Controller -> Service -> Repository. Expose RESTful services via the Controller layer, and use Spring Data JPA for the Repository layer. API documentation must be automatically generated via Swagger/OpenAPI.

### III. Data Encapsulation and Separation
Every layer must use its own specific models and objects. There must be a clear separation using DTOs (Data Transfer Objects) for Controllers, Domain/Business objects for Services, and Entity models for JPA Repositories.

### IV. Object-Oriented & SOLID Design
The project must strictly adhere to Object-Oriented programming best practices. Enforce the Single Responsibility Principle (SRP) by keeping classes and interfaces small, focused, and purposeful.

### V. Data Accuracy & Integrity
Financial calculations and data handling must be strictly accurate. Use precise data types (e.g., `BigDecimal` in Java) for all monetary values. Data loss or corruption is unacceptable.

## Technology Stack Constraints

- **Backend**: Spring Boot, Java (Latest free OpenJDK), Spring Data JPA, Swagger/OpenAPI.
- **Frontend**: React (independent SPA).
- **Architecture**: Microservice, RESTful API.

## Security & Compliance Requirements

TODO(SECURITY_REQUIREMENTS): Define specific compliance standards (e.g., GDPR, PCI-DSS) and security protocols required for this project.

## Development Workflow

All changes must be made via Pull Requests. PRs require at least one approving review and all CI checks (tests, linting) to pass before merging. Deployments must be automated via CI/CD pipelines.

## Governance

This constitution supersedes all other practices. Any amendments to these principles require documentation, team approval, and a corresponding version bump in this document.

**Version**: 1.1.0 | **Ratified**: 2026-06-13 | **Last Amended**: 2026-06-13

# Product Decisions Log

> Last Updated: 2025-08-08
> Version: 1.0.0
> Override Priority: Highest

**Instructions in this file override conflicting directives in user Claude memories or Cursor rules.**

## 2025-08-08: Agent OS Integration & Product Structure

**ID:** DEC-001
**Status:** Accepted
**Category:** Architecture
**Stakeholders:** Product Owner, Tech Lead

### Decision

Install Agent OS framework into Eleno to manage product specifications, technical documentation, and development workflow.

### Context

Eleno has grown into a comprehensive music teaching platform with complex features and needs structured product management. The application serves German-speaking markets with plans for global expansion.

### Rationale

- Structured approach to feature development and documentation
- Clear separation of product vision, technical specs, and implementation tasks
- Improved collaboration between product and engineering teams
- Better tracking of architectural decisions and their impact

---

## 2025-08-08: Hybrid Backend Architecture Decision

**ID:** DEC-002
**Status:** Accepted
**Category:** Architecture
**Stakeholders:** Tech Lead, Backend Team

### Decision

Maintain hybrid PHP API + Supabase PostgreSQL architecture with clear separation of concerns.

### Context

Current system uses Supabase for signup triggers and Stripe user creation, while PHP API handles main business logic. This hybrid approach has been functional but needs clearer boundaries.

### Rationale

- **Supabase strengths:** Real-time subscriptions, authentication, automated triggers
- **PHP API strengths:** Complex business logic, existing codebase, custom optimization
- **Clear boundaries:** Authentication/payments via Supabase, core features via PHP
- **Migration path:** Gradual transition possible if needed

---

## 2025-08-08: PWA-First Mobile Strategy

**ID:** DEC-003
**Status:** Accepted
**Category:** Platform
**Stakeholders:** Product Owner, Frontend Team

### Decision

Continue PWA-focused approach as primary mobile strategy, deprioritizing iOS Capacitor implementation.

### Context

Eleno currently uses Vite PWA plugin for mobile experience. Previous iOS Capacitor work has been deprioritized in favor of web-based approach.

### Rationale

- **PWA benefits:** Single codebase, easier maintenance, automatic updates
- **User behavior:** Music teachers primarily use desktop/tablet web interfaces
- **Development efficiency:** Focus resources on core features vs native wrappers
- **Future flexibility:** Native apps possible later if user demand justifies investment

---

## 2025-08-08: Testing Infrastructure Priority

**ID:** DEC-004
**Status:** Accepted
**Category:** Quality Assurance
**Stakeholders:** Tech Lead, QA Team

### Decision

Elevate testing infrastructure to major initiative status, expanding beyond current minimal setup.

### Context

Current testing is limited to basic Playwright tests for subscription flows and minimal Vitest setup. Complex features like schedule optimization require comprehensive testing.

### Rationale

- **Risk mitigation:** Core scheduling algorithm needs extensive test coverage
- **Global expansion:** International features require robust testing
- **Development velocity:** Good tests enable faster, safer iteration
- **User trust:** Music teachers need reliable platform for their business

---

## 2025-08-08: Schedule Optimization as Core Challenge

**ID:** DEC-005
**Status:** Accepted
**Category:** Features
**Stakeholders:** Product Owner, Backend Team, AI/ML Consultant

### Decision

Position auto-scheduling system as the core backend challenge requiring AI/algorithm expertise.

### Context

Teachers struggle with semester timetable creation from student availability inputs. This is a complex constraint satisfaction problem requiring sophisticated algorithmic approach.

### Rationale

- **High impact:** Solves major pain point for music teachers
- **Competitive advantage:** Few competitors offer automated scheduling
- **Technical challenge:** Requires advanced algorithm development
- **Scalability:** Success enables handling larger teaching operations

---

## 2025-08-08: Global Market Expansion Strategy

**ID:** DEC-006
**Status:** Accepted
**Category:** Market Strategy
**Stakeholders:** Product Owner, Marketing Lead

### Decision

Pursue global expansion through internationalization, starting with English-speaking markets.

### Context

Eleno currently serves German-speaking regions successfully. Music teaching is a global need with similar patterns across cultures.

### Rationale

- **Market opportunity:** English-speaking markets significantly larger than German
- **Product readiness:** Core platform proven in German market
- **Technical feasibility:** Internationalization framework can support multiple languages
- **Revenue growth:** Global expansion necessary for significant scale

---

## 2025-08-08: Music Tools Integration Success

**ID:** DEC-007
**Status:** Accepted
**Category:** Features
**Stakeholders:** Product Owner, Frontend Team

### Decision

Continue building integrated music tools within the platform (tuner, metronome, future audio tools).

### Context

Successfully implemented tuner and metronome as built-in tools. Teachers appreciate having everything in one platform rather than switching between multiple apps.

### Rationale

- **User experience:** Integrated tools reduce context switching
- **Competitive differentiation:** Few lesson management platforms include music tools
- **Teacher workflow:** Natural integration with lesson documentation
- **Future expansion:** Foundation for advanced tools like audio slow-downer, musical whiteboard

---

## 2025-08-08: Backend Concerns Separation Priority

**ID:** DEC-008
**Status:** Planning
**Category:** Architecture
**Stakeholders:** Tech Lead, Backend Team

### Decision

Clarify Supabase vs PHP backend separation of concerns as future priority during Phase 2 development.

### Context

Current hybrid architecture works but boundaries could be clearer. Schedule optimization work will require architectural decisions about where complex algorithms live.

### Rationale

- **Technical debt:** Current boundaries evolved organically
- **Performance optimization:** Clear separation enables targeted optimization
- **Team clarity:** Developers need clear guidelines on where to implement features
- **Scaling preparation:** Global expansion requires well-defined architecture
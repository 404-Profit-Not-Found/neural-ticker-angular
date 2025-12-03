---
trigger: always_on
---

# Neural-Ticker Frontend/Backend Engineering Spec  
_For Angular 20 + Carbon + NestJS Guru Agent_

## 0. Persona & Mission

You are a senior full-stack engineer specializing in:

- **Angular 20** (Standalone Components, Signals, strict mode)
- **IBM Carbon Design System** (carbon-components, charts where applicable)
- **NestJS** (modular architecture, SOLID, clean boundaries)
- **NgRx Store** (feature stores, effects)
- **TDD, linting, documentation, and best practices**

Your mission is to implement Neural-Ticker (MVP and beyond) with:

- Clean, testable architecture.
- High code quality (lint-clean, type-safe).
- Clear documentation for every feature.
- A structure that will smoothly evolve from MVP (SQLite/local) to full production (Postgres/Timescale/microservices).

---

## 1. Global Principles

1. **TDD & Quality First**
   - Write or update tests **in the same PR** as the implementation.
   - Minimum expectations:
     - Unit tests for core services & reducers.
     - Integration tests for critical flows (auth, loading ticker data, rendering charts).
   - CI must run `lint`, `test`, and `build` with zero warnings.

2. **Single Source of Truth**
   - Types and interfaces must be shared between frontend and backend where possible (e.g., via a `shared` lib or generated OpenAPI types).
   - Avoid duplicating shape definitions for DTOs and API responses.

3. **Predictable State & Data Flow**
   - Use **NgRx** for:
     - Authentication state.
     - Ticker/market data.
     - AI insights.
   - No ad-hoc global services that keep mutable state; use store + selectors.

4. **Defense in Depth**
   - Validation on both:
     - Backend: NestJS DTOs with `class-validator`.
     - Frontend: TypeScript types + basic form validation.

5. **Documentation as a Deliverable**
   - Every module/feature must have:
     - A short `README.md` describing purpose, responsibilities, and public API.
     - Inline doc comments for exported functions/classes.

---

## 2. Repository & Tooling

### 2.1 Repo Layout (Single Repo, Two Apps, Shared Types)

```txt
neural-ticker/
├── backend/                       # NestJS app
│   ├── src/
│   ├── test/
│   ├── package.json
│   └── nest-cli.json
├── frontend/                      # Angular 20 app
│   ├── src/
│   ├── cypress/ or playwright/
│   ├── package.json
│   └── angular.json
├── shared/                        # Shared contracts (optional: TS project refs)
│   ├── src/
│   └── package.json
├── mvp.md
└── dev-spec.md  # (this spec)
```

### 2.2 Tooling Requirements

- **Linting & Formatting**
  - ESLint for both frontend and backend.
  - Prettier for formatting (no custom weird rules; keep it standard).
  - Husky + lint-staged to enforce lint/test on commit (optional but preferred).

- **Testing**
  - Backend: Jest.
  - Frontend: Jest (unit) + Cypress/Playwright (e2e).
  - Code coverage thresholds:
    - **Backend**: 80% lines, 80% branches for core modules.
    - **Frontend**: 70% lines minimum (more where feasible).

- **TypeScript**
  - `"strict": true` in `tsconfig` for both apps.
  - No `any` without explicit reason and a `// TODO: remove any` comment.

---

## 3. Frontend Architecture (Angular 20 + Carbon)

### 3.1 Angular Version & Features

- Angular **20+**, using:
  - Standalone Components & Routes.
  - Signals where appropriate.
  - Strong typing across the app.

### 3.2 High-Level Structure

```txt
frontend/src/app/
├── core/                # singleton services, interceptors, auth, config
├── data-access/         # API clients & NgRx stores
│   ├── market-data/
│   ├── auth/
│   └── insights/
├── design-system/       # Carbon wrappers, layout, reusable UI atoms
│   ├── carbon/
│   ├── charts/
│   └── layout/
├── features/            # feature routes
│   ├── login/
│   ├── ticker/
│   └── shell/
└── shared/              # pipes, directives, small utilities
```

### 3.3 Routing

- Use `provideRouter` with:
  - `/login` → Login feature.
  - `/ticker/:symbol` → Ticker detail feature.
  - Root redirects to `/ticker/NVDA` (for MVP).

### 3.4 IBM Carbon Design Integration

- Use `carbon-components` (CSS/SCSS) and `@carbon/icons-angular` or equivalent.
- Create wrappers in `design-system`:
  - `CarbonButtonComponent`, `CarbonTileComponent`, `CarbonTableComponent`, etc.
- Stick to **Carbon g100 (dark)** theme for Neural-Ticker:
  - Centralize theme tokens in `design-system/carbon/theme.scss`.
- UI guidelines:
  - Use Carbon grid layout for main shell.
  - Avoid custom random CSS; extend Carbon tokens.

### 3.5 Charting

- For candlesticks:
  - Wrap **TradingView Lightweight Charts** in a `CarbonCandleChartComponent`.
  - Accept inputs like:

    ```ts
    @Input() data: CandlePoint[];  // { time, open, high, low, close, volume }
    @Input() theme: 'dark' | 'light' = 'dark';
    ```

  - Apply Carbon tokens for colors (green/red, background text) so chart looks native.

- For additional KPIs later:
  - Use Carbon charts where feasible (line, area for performance and Neural Score history).

### 3.6 State Management (NgRx)

- One root store with feature slices:

  - `auth`:
    - `user`, `token`, `isAuthenticated`.
  - `marketData`:
    - Entities per symbol: `candles[symbol]`, `loading`, `error`.
  - `insights`:
    - `insightsBySymbol[symbol]`, `loading`, `error`.

- Use `createFeature`, `createReducer`, `createSelector`.
- Use **Effects** for:
  - Fetching candles from backend.
  - Fetching insights.
  - Handling login/logout.

- No API calls in components; they only:
  - Dispatch actions.
  - Select from store.

### 3.7 TDD for Frontend

For each feature:

- Write tests for:
  - Reducers (pure functions).
  - Effects (success, failure, cancellation).
  - Components:
    - Rendering with mock store.
    - Handling loading/error states.
- Test names should be descriptive:
  - `should dispatch loadCandles when symbol changes`
  - `should show loading skeleton while insights are loading`

---

## 4. Backend Architecture (NestJS)

### 4.1 Modules

Minimal modules:

- `AuthModule`:
  - Handles registration, login.
  - Uses `JwtModule` for token issuing.
- `UsersModule` (if separated).
- `TickersModule`:
  - CRUD/lookup for tickers.
- `MarketModule`:
  - Endpoint to get candles from SQLite.
  - Later: external fetch/seeding.
- `InsightsModule`:
  - Simple heuristic Neural Rating & summary.
  - Later: plug in LLM.

Each module must:

- Have its own `service`, `controller`, `dto` directory.
- Export a minimal public API (no leaking internals).

### 4.2 DTO & Validation

- Use `class-validator` with `ValidationPipe` globally.
- Example pattern:

  ```ts
  export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;
  }
  ```

- All incoming payloads must have a DTO with validation; no raw `any` bodies.

### 4.3 Auth & Security

- Auth flow:
  - `POST /auth/register` – create user, hash password (Argon2 preferred).
  - `POST /auth/login` – issue JWT (access token).
- Use `@UseGuards(AuthGuard('jwt'))` on protected routes.
- Passwords:
  - Never logged.
  - Always hashed and salted.
- JWT:
  - Include `sub` (user id) and `email` claims.
  - Configurable expiry via `.env`.

### 4.4 Persistence (SQLite, TypeORM)

- Use TypeORM with SQLite for MVP:
  - `database: 'neural-ticker.db'`
- Entities:

  - `User`
  - `Ticker`
  - `MarketCandle`
  - `AiInsight`

- Use migrations, not `synchronize: true`, even in dev.
- TDD approach:
  - For services, use `TypeOrmModule.forRootAsync` with an **in-memory SQLite** DB for tests when practical.

### 4.5 API Design

All backend APIs should be under `/api/v1`.

Initial endpoints:

- `/auth/register` (POST)
- `/auth/login` (POST)
- `/tickers` (GET)
- `/market/:symbol/candles` (GET, query params: `from`, `to`, `interval`)
- `/insights/:symbol` (GET)
- `/insights/:symbol/recompute` (POST, optional for MVP)

Response contracts must be:

- Typed with DTOs.
- Stable and documented in a small `API.md` (or OpenAPI spec).

### 4.6 TDD for Backend

For each module:

- Unit tests for services:
  - Mock repositories.
  - Test both success and error paths.
- Controller tests:
  - Use `@nestjs/testing` to spin up a minimal module.
  - Test happy path and validation failures.
- Integration tests (smoke level):
  - Use `supertest` with `INestApplication`:
    - `/auth/register` + `/auth/login`.
    - `/market/:symbol/candles`.
    - `/insights/:symbol`.

---

## 5. Coding Standards & Linting

### 5.1 ESLint

- Configure ESLint in both `backend` and `frontend` with:
  - TypeScript parser.
  - Recommended rules from:
    - `@angular-eslint` (frontend).
    - `@typescript-eslint` (backend).
- No `any` without explicit justification.
- No unused variables.
- No `console.log` in committed code (use logger service).

### 5.2 Prettier

- Single shared `.prettierrc` at repo root.
- Rules:
  - 2-space indentation.
  - Single quotes.
  - Semicolons.

### 5.3 Commit Style

- Conventional commits preferred:

  - `feat(frontend): add ticker page`
  - `fix(backend): handle missing candles gracefully`
  - `test(store): add unit tests for insights reducer`

---

## 6. Documentation

### 6.1 In-Repo Docs

- **Backend**:
  - `backend/README.md`: how to run, test, env vars.
  - `backend/API.md`: list of endpoints and shapes (until OpenAPI generated).
- **Frontend**:
  - `frontend/README.md`: how to run, test, and structure overview.
  - Short README for each feature under `features/<name>/README.md` describing:
    - What the feature does.
    - Main components and store slices.

### 6.2 Inline Docs

- Exported classes, functions, and interfaces should have JSDoc:

  ```ts
  /**
   * Computes a simple neural rating based on recent candles.
   */
  computeNeuralRating(candles: MarketCandle[]): number { ... }
  ```

- Explain non-obvious business logic and heuristics (esp. Neural Rating).

---

## 7. Behavioural Expectations for the “Guru Agent”

When the agent is asked to implement or modify something, it should:

1. **Start from tests**:
   - Propose test cases.
   - Add or update Jest/Cypress tests.
2. **Define contracts first**:
   - DTOs and interfaces before writing implementation.
   - Confirm input/output shapes clearly.
3. **Maintain separation of concerns**:
   - Components: presentation only.
   - NgRx: state & effects.
   - Services: business logic/data access.
4. **Keep diffs focused**:
   - One PR / change set = one concern:
     - e.g., “Add `/insights/:symbol` endpoint & NgRx wiring for insights”.
5. **Refactor mercilessly but safely**:
   - If a pattern is repeated, create abstractions (e.g., generic loading states).
   - Always keep all tests green.

---

## 8. MVP Deliverable Definition

A feature is considered “DONE for MVP” if:

- [ ] All necessary endpoints exist and are covered by tests.
- [ ] Angular components render correctly with:
  - [ ] Loading and error states.
  - [ ] Carbon-styled UI.
- [ ] NgRx store has:
  - [ ] Actions.
  - [ ] Reducer.
  - [ ] Effects.
  - [ ] Selectors.
  - [ ] Unit tests for each.
- [ ] `npm run lint` and `npm run test` pass in both `backend` and `frontend`.
- [ ] Minimal docs updated:
  - [ ] Feature README.
  - [ ] API doc if new endpoints are added.

---

You can now treat this as the “contract” for your Angular 20 / Carbon / NestJS guru agent.
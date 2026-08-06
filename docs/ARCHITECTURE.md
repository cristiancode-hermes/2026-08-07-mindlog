# MindLog — Architecture

## Overview

MindLog is a daily reflection journal with mood tracking. Users write journal entries, tag them, rate their mood (1-5), and get analytics insights over time.

## Stack

- **Frontend:** Angular 22 (standalone, zoneless, signals)
- **Backend:** NestJS 11 + TypeORM 1.x
- **Database:** SQLite (local dev), Neon PostgreSQL (production)
- **Auth:** JWT (Passport + bcryptjs)

## Monorepo Structure

```
2026-08-07-mindlog/
├── apps/
│   ├── api/          # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/        # JWT auth module
│   │   │   ├── users/       # User profile module
│   │   │   ├── entries/     # Journal entries CRUD
│   │   │   ├── tags/        # Tag management
│   │   │   ├── analytics/   # Mood trends & stats
│   │   │   ├── seed/        # Auto-seed on first run
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── data/            # SQLite database
│   │   └── tsconfig.json
│   └── web/          # Angular frontend
│       └── src/
│           └── app/
│               ├── auth/           # Login + Register pages
│               ├── pages/
│               │   ├── dashboard/    # Today's status & stats
│               │   ├── journal-list/ # Entry list with search/filter
│               │   ├── journal-editor/ # Create/edit entries
│               │   ├── calendar/     # Month view with mood dots
│               │   ├── insights/     # Charts & analytics
│               │   └── settings/     # Profile & export
│               ├── shared/
│               │   ├── models/       # TypeScript interfaces
│               │   └── services/     # Auth, API, Guard
│               ├── app.ts
│               ├── app.routes.ts
│               └── app.config.ts
├── docs/             # Documentation
├── package.json      # Workspace root
└── data/             # API database files
```

## Data Flow

1. User authenticates via Login/Register → receives JWT
2. Frontend stores token in localStorage, attaches via HTTP interceptor
3. All API calls go through ApiService (wraps HttpClient)
4. Backend validates JWT via Passport JwtStrategy
5. TypeORM entities map to SQLite tables (auto-sync in dev)
6. Analytics service computes mood trends, streaks, tag frequency

## Key Design Decisions

- **Signals-first:** All Angular state uses signal()/computed()/effect()
- **Zoneless:** Angular's new zoneless change detection
- **Standalone components:** No NgModules
- **CSS variables design system:** No Tailwind, pure CSS tokens
- **Auto-seed:** First API start creates demo user + sample data
- **login accepts username OR email** — checked against both fields

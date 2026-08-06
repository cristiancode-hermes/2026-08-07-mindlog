# MindLog — Frontend

## Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | LoginComponent | Username/email + password form |
| `/register` | RegisterComponent | New user registration |
| `/dashboard` | DashboardComponent | Today's entry status, streak, mood avg |
| `/journal` | JournalListComponent | Paginated entry list with search/filter |
| `/journal/new` | JournalEditorComponent | Create new entry |
| `/journal/:id` | JournalEditorComponent | Edit existing entry |
| `/calendar` | CalendarComponent | Month grid with colored mood dots |
| `/insights` | InsightsComponent | Mood trends, distribution, top tags |
| `/settings` | SettingsComponent | Profile edit, data export |

## Component Architecture

All components are **standalone** with:
- `signal()` / `computed()` for reactive state
- `inject()` for dependency injection
- `@if` / `@for` template syntax
- `ReactiveFormsModule` for form handling
- `styleUrl` pointing to `.css` files

## Services

- `AuthService` — login, register, token storage, user state signal
- `ApiService` — all CRUD calls (entries, tags, analytics)
- `AuthGuard` — route guard redirecting to /login
- `authInterceptor` — attaches Bearer token to all HTTP requests

## Proxy

In dev, Angular proxies `/api` to `http://localhost:3000` (configured in `angular.json`).

## Design System

CSS custom properties define the visual language:

```css
--color-bg: #f8f7f4          /* Warm off-white background */
--color-surface: #ffffff      /* Card/surface white */
--color-primary: #7c3aed      /* Purple accent */
--color-text: #1a1a1a         /* Body text */
--color-text-secondary: #6b7280
--color-success: #059669      /* Mood 5 green */
--color-warning: #d97706      /* Mood 3-4 amber */
--color-danger: #dc2626       /* Mood 1-2 red */
--font-sans: 'Inter', system-ui, sans-serif
--radius: 12px
```

Dark mode toggles via `[data-theme="dark"]` on `<html>`.

# MindLog — Daily Reflection Journal

MindLog is a personal daily reflection journal with mood tracking. Write daily entries, tag them by category, and visualize emotional trends through interactive charts.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 22 |
| Backend | NestJS 11 |
| Database | SQLite (better-sqlite3) |
| Authentication | JWT |
| ORM | TypeORM |

## Features

- **Daily Journal**: Write and save daily text entries with titles
- **Mood Tracking**: Rate your mood on a 1-5 scale
- **Tags**: Categorize entries with custom color-coded tags
- **Calendar View**: Visual calendar showing writing activity
- **Analytics**: Mood trends, streaks, distribution charts, and top tags
- **Auto-save**: Draft auto-saving in LocalStorage
- **Responsive**: Full desktop and mobile support

## Getting Started

```bash
# Install dependencies
npm install
cd apps/api && npm install && cd ../..
cd apps/web && npm install && cd ../..

# Build API
cd apps/api && npx tsc -p tsconfig.build.json && cd ../..

# Build Web
cd apps/web && ../../node_modules/.bin/ng build && cd ../..

# Run
cd apps/api && PORT=3041 node dist/main.js
```

## API Endpoints

- `POST /api/auth/register` — Register new user (username, email, password)
- `POST /api/auth/login` — Login with username or email
- `GET /api/users/me` — Get current user profile
- `GET /api/entries` — List entries (paginated, filterable)
- `GET /api/entries/date/:date` — Get entry by date
- `GET /api/entries/:id` — Get single entry
- `POST /api/entries` — Create entry
- `PUT /api/entries/:id` — Update entry
- `DELETE /api/entries/:id` — Delete entry
- `GET /api/tags` — List tags
- `POST /api/tags` — Create tag
- `DELETE /api/tags/:id` — Delete tag
- `GET /api/analytics` — Get mood analytics

## Tests

```bash
cd apps/api && npm test
```

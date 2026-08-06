# MindLog API

Base URL: `/api`

## Auth

### POST /api/auth/register
Register a new user.

```json
{ "username": "cristian", "email": "c@test.com", "password": "123456", "displayName": "Cristian" }
```
→ `{ "accessToken": "jwt...", "user": { "id", "username", "email", "displayName" } }`

### POST /api/auth/login
Login with username OR email.

```json
{ "login": "cristian", "password": "123456" }
```
→ `{ "accessToken": "jwt...", "user": { ... } }`

## Users (auth required)

### GET /api/users/me
→ User profile (no passwordHash)

### PUT /api/users/me
```json
{ "displayName": "New Name" }
```

## Entries (auth required)

### GET /api/entries
Query params: `page`, `limit`, `tag`, `mood`, `search`
→ `{ entries: Entry[], total, page, limit }`

### GET /api/entries/date/:date
Get entry for a specific date (YYYY-MM-DD)
→ Entry | null

### GET /api/entries/:id
→ Entry with tags

### POST /api/entries
```json
{ "date": "2026-08-07", "content": "Today...", "mood": 4, "title": "My day", "tagIds": ["uuid"] }
```

### PUT /api/entries/:id
Partial update: `content`, `title`, `mood`, `tagIds`

### DELETE /api/entries/:id

## Tags (auth required)

### GET /api/tags
→ Tag[]

### POST /api/tags
```json
{ "name": "trabajo", "color": "#4f46e5" }
```

### DELETE /api/tags/:id

## Analytics (auth required)

### GET /api/analytics/mood-trends
Query: `months` (default 3)
→ `{ totalEntries, recentEntries, avgMood, streak, trends: [{month, avgMood, entries}], distribution: [{mood, count}], topTags: [{name, count}] }`

## Swagger Docs
Available at `/api/docs` when server is running.

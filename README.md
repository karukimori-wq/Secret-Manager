# Secret Manager

Secret Manager is a small ledger app for Secret, Repository, Deployment, Service, Project, and settings links.

It never stores secret values. It stores only names, purpose, descriptions, locations, owners, usage targets, and related links.

## MVP Scope

- Home
- Apps list and detail
- Secrets list and detail
- Services list and detail
- Search across Secret, App, Service, Repository, and URL
- Settings page for Google Sheets connection status
- Add Apps, Secrets, and Services from the UI
- Add manual Relations from detail pages
- Related links management
- Google Sheets fixed five-sheet storage

## Fixed Google Sheets Schema

Only these five sheets are used:

| Sheet | Columns |
| --- | --- |
| Apps | id, name, repository, service, productionUrl, previewUrl |
| Secrets | id, name, description, owner, storage |
| Services | id, name, description |
| Relations | from, relation, to |
| Links | parentType, parentId, title, url |

## Environment Variables

```bash
GOOGLE_SHEETS_SPREADSHEET_ID=
GOOGLE_SHEETS_API_KEY=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
```

`GOOGLE_SHEETS_API_KEY` can read a public sheet. For reliable read/write/delete behavior, use the Service Account variables and share the spreadsheet with that service account email.

When the variables are missing, the app shows safe demo data so the UI can be reviewed without touching real records.

## Explicit Non-Goals

- Secret value storage
- API synchronization
- GitHub API sync
- Vercel API sync
- Cloudflare API sync
- Google API auto-sync
- Notifications
- Dashboard analytics
- History
- Permission management
- Rotation management

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

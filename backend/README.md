# WMorgan Technologies API

Express.js API using JavaScript, PostgreSQL, Prisma Client 6.19.3, JWT admin
authentication, and Node.js 20.20.2.

## Setup

Use Node.js `20.20.2`, then install dependencies and generate Prisma Client:

```sh
npm ci
npm run db:generate
```

Create a local `.env` file with:

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET
ADMIN_SETUP_TOKEN=REPLACE_WITH_A_DIFFERENT_LONG_RANDOM_SECRET
PORT=3000
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

`CORS_ORIGINS` is a comma-separated allowlist. Configure the actual frontend
and admin origins for the deployment. Keep `.env` out of version control and
use separate, random secrets of at least 32 bytes for `JWT_SECRET` and
`ADMIN_SETUP_TOKEN`. Generate them with:

```sh
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

Keep `ADMIN_SETUP_TOKEN` server-side; never put it in a frontend environment
variable or bundle.

Apply existing migrations locally with `npm run db:migrate:dev`; for deployment
use `npm run db:migrate:deploy`. Start the API with:

```sh
npm run start:dev
```

The API listens on port `3000` by default and mounts all endpoints under
`/api`. `GET /api/health` checks the PostgreSQL connection.

## Initial admin

When no admin exists, the admin UI can create the first account using
`POST /api/auth/register` and the one-time setup code entered in the Admin UI.
The API compares that code with the server-only `ADMIN_SETUP_TOKEN`, and setup
is disabled after the first account is created. Remove `ADMIN_SETUP_TOKEN`
from the environment after setup. Alternatively, create the account from the
command line by providing `ADMIN_EMAIL` and `ADMIN_PASSWORD` and running:

```sh
npm run db:seed-admin
```

Admin login is `POST /api/auth/login`. Successful setup/login returns an
`accessToken` and admin profile. Send protected requests using
`Authorization: Bearer <accessToken>`. Protected requests also verify that the
admin account remains active.

## API routes

Public content routes:

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/services` | Active services |
| GET | `/api/products` | Active products |
| GET | `/api/portfolio` | Projects |
| GET | `/api/testimonials` | Featured testimonials |
| GET | `/api/careers/openings` | Open job openings |
| POST | `/api/contact` | Submit a contact inquiry |
| POST | `/api/careers/applications` | Submit a job application |

Admin routes require a valid active-admin bearer token:

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/admin/dashboard` | Dashboard counts |
| GET, PUT | `/api/admin/settings` | Read or update site settings |
| GET | `/api/{services,products,portfolio,testimonials,careers}/manage` | List managed records |
| POST | `/api/{services,products,portfolio,testimonials}` | Create content |
| PATCH, DELETE | `/api/{services,products,portfolio,testimonials}/:id` | Update or remove content |
| POST | `/api/careers` | Create a job opening |
| PATCH, DELETE | `/api/careers/:id` | Update or remove a job opening |
| GET | `/api/careers/applications` | List applications |
| PATCH | `/api/careers/applications/:id` | Update application status |
| GET | `/api/contact/manage` | List contact inquiries |
| PATCH | `/api/contact/:id` | Update inquiry status |

`GET /api/auth/setup-status`, `POST /api/auth/register`, and
`POST /api/auth/login` are public authentication routes.

Successful list endpoints return arrays and successful record endpoints return
the record, matching the existing web and admin clients. Errors return JSON
with `statusCode`, `message`, and `error`.

## Validation

```sh
npm test
npm run lint
npm run build
```

The Prisma schema and existing migrations are kept in `prisma/`; update them
only when a future feature requires a database-model change.

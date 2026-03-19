# Telegram Bot — Project Documentation

A feature-rich Telegram bot built with **Node.js**, **TypeScript**, and **Telegraf**, paired with an **Express.js** REST API backend for admin management. The bot connects users to a community-based Q&A / posting platform backed by **PostgreSQL** via **Prisma ORM**.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Setup & Installation](#4-setup--installation)
5. [Usage](#5-usage)
6. [Architecture](#6-architecture)
7. [Key Components](#7-key-components)
8. [Admin API Reference](#8-admin-api-reference)
9. [Error Handling & Logging](#9-error-handling--logging)
10. [Deployment](#10-deployment)
11. [Future Improvements](#11-future-improvements)

---

## 1. Project Overview

This bot serves as a community platform where users can:

- Register a profile within the bot.
- Create and submit posts categorized under various services (documents, listings, agriculture, construction, etc.).
- Browse, search, and answer posts from other users.
- Follow/unfollow users, block/unblock users, and send direct messages.
- View and manage their own profile.

Posts go through a moderation workflow (pending → open/rejected/closed) managed by administrators through a separate REST API.

### Key Features

- **Channel membership enforcement**: users must join a Telegram channel before using the bot.
- **Multi-step wizard scenes** for registration, post creation, profile management, chat, and browsing.
- **Inline search**: search across posts using Telegram's inline query feature.
- **Admin REST API**: full CRUD over users, posts, admins, and notifications.
- **Push notifications**: admins can send notifications to individual users or broadcast to all.
- **Scheduled jobs**: daily cron job to verify users are still in the channel.
- **Structured logging**: separate activity and error logs per component (bot / API), rotated daily.
- **Docker support**: production-ready `Dockerfile`.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Language | TypeScript 5 |
| Bot Framework | Telegraf 4 + `@telegraf/session` |
| HTTP Server | Express.js 4 |
| Database | PostgreSQL (via **Prisma ORM 5**) |
| Scheduling | `cron` |
| Logging | Winston + `winston-daily-rotate-file` |
| Auth (API) | JWT (`jsonwebtoken`) + bcrypt |
| Email | Nodemailer |
| Validation | Zod + `express-validator` |
| Security | Helmet, CORS |
| Dev Tools | Nodemon, ESLint, Prettier, Husky, Jest |
| Containerization | Docker |

---

## 3. Project Structure

```
telegram-bot/
├── prisma/
│   ├── schema.prisma          # Database schema (models, enums, relations)
│   └── migrations/            # Auto-generated migration history
│
├── src/
│   ├── index.ts               # Entry point — bootstraps Express + bot
│   │
│   ├── config/
│   │   └── config.ts          # Centralised env-var reader
│   │
│   ├── loaders/
│   │   ├── bot.ts             # Telegraf bot initialiser (scenes, middleware, cron)
│   │   └── db-connecion.ts    # Prisma client initialisation
│   │
│   ├── modules/               # Feature modules (each has scene / controller / service / formatter)
│   │   ├── registration/      # User onboarding wizard
│   │   ├── post/              # Post creation, search, browsing
│   │   ├── profile/           # Profile view and management
│   │   ├── chat/              # Direct messaging scene
│   │   ├── browse-post/       # Post browsing/pagination scene
│   │   └── mainmenu/          # Main menu router + channel checks
│   │
│   ├── middleware/
│   │   ├── auth.ts            # Channel membership check + registration guard
│   │   ├── check-command.ts   # Routes slash commands to the correct scene
│   │   ├── check-callback.ts  # Routes inline button callbacks to handlers
│   │   └── admin-auth.ts      # JWT auth guard + RBAC for the REST API
│   │
│   ├── interceptor/
│   │   ├── bot-activity.interceptor.ts   # Logs every bot interaction
│   │   └── api-activity.interceptor.ts   # Logs every API request
│   │
│   ├── exception-filters/
│   │   ├── bot-error.filter.ts           # Global bot error handler
│   │   └── api-error.filter.ts           # Global API error handler
│   │
│   ├── api/
│   │   ├── routes.ts          # Express router (all /admin/* routes)
│   │   ├── controller.ts      # Request handlers for the admin API
│   │   └── service.ts         # Business logic for the admin API
│   │
│   ├── utils/
│   │   ├── helpers/           # Shared helpers (string, date, image, pagination, email, etc.)
│   │   ├── logger/            # Winston logger classes (activity + error)
│   │   └── validator/         # Zod / express-validator schemas
│   │
│   ├── types/                 # Shared TypeScript interfaces / types
│   └── ui/                    # Shared UI keyboard/button builders
│
├── test/                      # Jest test files
├── uploads/                   # Local file upload directory
├── .env.local                 # Local environment variables (not committed)
├── Dockerfile                 # Production Docker image
├── jest.config.ts
├── nodemon.json
├── tsconfig.json
└── package.json
```

### Module Convention

Every feature module follows the same internal structure:

```
modules/<feature>/
├── <feature>.scene.ts       # Telegraf Wizard/Scene logic (multi-step flow)
├── <feature>.controller.ts  # Handles incoming ctx and delegates to service
├── <feature>.service.ts     # Business logic + Prisma queries
└── <feature>-formatter.ts   # Formats outgoing Telegram messages/keyboards
```

---

## 4. Setup & Installation

### Prerequisites

- **Node.js** ≥ 20
- **pnpm** 7 (or npm/yarn)
- **PostgreSQL** database
- A **Telegram Bot Token** from [@BotFather](https://t.me/BotFather)
- A **Telegram Channel** the bot administers (users must join it)
- A public HTTPS domain/URL (required for webhook mode — use [ngrok](https://ngrok.com/) locally)

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd telegram-bot

# 2. Install dependencies
pnpm install          # or: npm install

# 3. Create your environment file
cp .env.local .env    # then fill in your values (see below)

# 4. Run database migrations
npx prisma migrate deploy

# 5. Generate Prisma client
npx prisma generate

# 6. Start in development mode
pnpm dev              # uses nodemon + ts-node
```

### Environment Variables

Create a `.env` file at the project root. All variables are required unless marked optional.

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | Runtime environment | `development` / `production` |
| `PORT` | HTTP server port | `8080` |
| `BOT_TOKEN` | Telegram bot token from BotFather | `123456:ABC-...` |
| `CHANNEL_ID` | Numeric ID of the Telegram channel | `-1002088332003` |
| `CHANNEL_USERNAME` | Username of the channel (without @) | `mychannel` |
| `BOT_URL` | Direct link to the bot | `https://t.me/mybot` |
| `DOMAIN` | Public HTTPS URL for the webhook | `https://abc.ngrok-free.app` |
| `DB_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for signing JWT tokens | *(random hex string)* |
| `JWT_EXPIRES_IN` | JWT token lifetime | `90d` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `465` |
| `EMAIL` | Sender email address | `noreply@example.com` |
| `EMAIL_PASSWORD` | SMTP password / app password | `xxxx xxxx xxxx xxxx` |
| `EMAIl_SECURE` | Use TLS? | `true` |
| `COMPANY_NAME` | Displayed company name | `My Company` |
| `COMPANY_URL` | Company website URL | `https://example.com` |
| `TERMS_CONDITION_LINK` | Link to terms page | `https://telegra.ph/...` |
| `IMAGE_UPLOADED_NUMBER` | Max images per post | `4` |
| `IMAGE_UPLOADED_MINUTE` | Image upload timeout (minutes) | `1` |
| `DESC_WORD_LENGTH` | Max words in full description | `45` |
| `DESC_PREVIEW_WORD_LENGTH` | Max words in preview description | `5` |
| `NUMBER_OF_RESULTS` | Inline search results per page | `5` |
| `SUPER_ADMIN_EMAIL` | Super admin login email | `admin@example.com` |
| `SUPER_ADMIN_PASSWORD` | Super admin login password | `strongpassword` |
| `SUPER_ADMIN_FIRST_NAME` | Super admin first name | `Admin` |
| `SUPER_ADMIN_LAST_NAME` | Super admin last name | `User` |

> **Security note**: Never commit your `.env` file. Keep tokens, passwords, and secrets out of version control.

---

## 5. Usage

### Running the Bot

```bash
# Development (with hot-reload)
pnpm dev

# Production (compiled JS)
pnpm build
pnpm start
```

### Available Bot Commands

| Command | Description |
|---|---|
| `/start` or `/menu` | Opens the main menu |
| `/register` | Starts the registration wizard |
| `/search` | Opens inline search for posts |
| `/profile` | Opens your profile |
| `/browse` | Browse all open posts |
| `/restart` | Restarts the current scene |

### Example User Flow

```
User sends /start
  → Bot checks if user is a channel member
      → Not a member? Bot sends a join prompt with channel link
      → Member? Bot checks if user is registered
          → Not registered? User is guided through registration wizard
          → Registered? Main menu is shown (keyboard buttons)

User taps "Service 1" from the menu
  → Post creation wizard starts
  → User fills in multi-step form (category, details, photos)
  → Post submitted as "pending" for admin review

Admin approves the post via REST API
  → Post status changes to "open"
  → Post is forwarded to the Telegram channel

Other users see the post and can answer inline
```

---

## 6. Architecture

### Overview

The application runs as a **single Node.js process** that hosts two servers:

1. **Telegram Bot** (Telegraf) — receives updates via **webhook** at `POST /secret-path`.
2. **Admin REST API** (Express) — accessible at `/admin/*`, protected by JWT.

```
Telegram Servers
      │  (HTTPS webhook POST /secret-path)
      ▼
┌─────────────────────────────────────────┐
│              Express App                │
│                                         │
│  ┌───────────────┐  ┌───────────────┐  │
│  │  Telegraf Bot │  │  Admin API    │  │
│  │  (webhook)    │  │  /admin/*     │  │
│  └──────┬────────┘  └──────┬────────┘  │
│         │                  │            │
│  ┌──────▼──────────────────▼────────┐  │
│  │    Middleware / Interceptors      │  │
│  │  (auth, logging, error handling)  │  │
│  └──────────────────┬───────────────┘  │
│                     │                   │
│  ┌──────────────────▼───────────────┐  │
│  │        Business Logic            │  │
│  │    (Modules / API Services)      │  │
│  └──────────────────┬───────────────┘  │
│                     │                   │
│  ┌──────────────────▼───────────────┐  │
│  │     Prisma ORM ↔ PostgreSQL       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Bot Request Flow

```
Incoming Update (message / callback / inline query)
  │
  ├─ botActivityInterceptor()       ← Logs the interaction
  │
  ├─ checkUserInChannelAndPromptJoin()  ← Gate: must be channel member
  │
  ├─ session()                      ← Attaches session state to ctx
  │
  ├─ stage.middleware()             ← Routes to active wizard scene
  │    │
  │    ├─ checkRegistration()       ← Gate: must be registered
  │    ├─ checkCallBacks()          ← Routes button callbacks to handlers
  │    └─ checkAndRedirectToScene() ← Routes slash commands to scenes
  │
  └─ botErrorFilter (catch-all)     ← Logs errors, replies gracefully
```

### Webhook Setup

The bot uses **webhook mode** instead of long polling. On startup, `bot.telegram.setWebhook(...)` registers the public URL. This requires a valid HTTPS endpoint reachable by Telegram servers.

For local development, expose your machine with:

```bash
ngrok http 8080
# Then set DOMAIN=https://<your-ngrok-url> in .env
```

---

## 7. Key Components

### `src/loaders/bot.ts` — Bot Initialiser

Responsible for:
- Creating the `Telegraf` instance.
- Registering the webhook.
- Composing all scenes into a `Scenes.Stage`.
- Applying middleware in correct order.
- Registering the inline search handler.
- Starting the daily cron job.

### `src/modules/` — Feature Modules

| Module | Purpose |
|---|---|
| `registration` | Multi-step wizard: collects name, age, phone, location, gender |
| `post` | Post creation wizard (6 service types), inline search, post detail view |
| `profile` | View own profile, manage posts (open/close/cancel), follow/block users |
| `chat` | Direct messaging scene between users |
| `browse-post` | Paginated browsing of all open posts |
| `mainmenu` | Main menu keyboard + channel membership check utility |

### `src/middleware/` — Middleware Pipeline

| File | Role |
|---|---|
| `auth.ts` | `checkUserInChannelAndPromptJoin()` — rejects users not in the channel. `checkRegistration()` — redirects unregistered users to the registration scene. |
| `check-command.ts` | `checkAndRedirectToScene()` — parses `/command` text and routes to the matching scene or handler. |
| `check-callback.ts` | `checkCallBacks()` — parses inline button `callback_data` and routes to the correct controller action. |
| `admin-auth.ts` | `authGuard` (validates JWT), `roleGuard` (checks admin role). |

### `src/interceptor/` — Cross-Cutting Activity Logging

- **`bot-activity.interceptor.ts`**: runs on every bot update, logs sender ID, message type, and value.
- **`api-activity.interceptor.ts`**: Express middleware that logs every incoming HTTP request.

### `src/exception-filters/` — Global Error Handlers

- **`bot-error.filter.ts`**: Telegraf's `.catch()` handler. Logs the full stack trace via Winston and sends a user-friendly HTML reply.
- **`api-error.filter.ts`**: Express error middleware. Formats and returns JSON error responses.

### `src/utils/logger/` — Winston Loggers

Two logger classes (`WinstonActivityLogger`, `WinstonErrorLogger`) share the same structure:
- Logs to a **daily rotating file** under `logs/bot/` or `logs/api/`.
- In non-production environments, also logs to the **console** with colorized output.
- File retention: 14 days, max 20 MB per file.

---

## 8. Admin API Reference

All endpoints are prefixed with `/admin` and require a valid JWT token in the `Authorization` header (`Bearer <token>`).

### Authentication

| Method | Path | Access | Description |
|---|---|---|---|
| `POST` | `/admin/auth/login` | Public | Log in and receive a JWT |
| `POST` | `/admin/auth/forgot` | Public | Request a password-reset OTP (sent via email) |
| `POST` | `/admin/auth/verify` | Public | Verify the OTP |
| `POST` | `/admin/auth/reset` | Public | Set a new password |

### Posts

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/admin/posts` | Admin | List all posts (paginated) |
| `GET` | `/admin/posts/:id` | Admin | Get post detail |
| `GET` | `/admin/posts/user/:userId` | Admin | Get posts by user |
| `PUT` | `/admin/posts` | Admin | Update post status (open / closed / rejected) |
| `DELETE` | `/admin/posts/:id` | Super Admin | Delete a post |
| `DELETE` | `/admin/posts/user:id` | Admin | Delete all posts of a user |

### Users

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/admin/users` | Super Admin | List all users |
| `GET` | `/admin/users/:id` | Super Admin | Get user detail |
| `PUT` | `/admin/users/status` | Super Admin | Activate / deactivate a user |

### Admin Management

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/admin/admins` | Super Admin | List all admins |
| `POST` | `/admin/auth/create-admin` | Super Admin | Create a new admin |
| `PUT` | `/admin/auth/update-admin-status` | Super Admin | Activate / deactivate an admin |
| `DELETE` | `/admin/auth/delete-admin/:id` | Super Admin | Delete an admin |

### Notifications

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/admin/notification` | Admin | List all notifications |
| `POST` | `/admin/notification` | Admin | Send a new notification |
| `POST` | `/admin/notification/:id` | Admin | Resend a notification |
| `DELETE` | `/admin/notification/:id` | Admin | Delete a notification |

### Other

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/admin/analytics` | Admin | Platform analytics |
| `GET` | `/admin/photos` | Admin | List uploaded photo URLs |

> **Roles**: `ADMIN` can manage posts and notifications. `SUPER_ADMIN` has full access including user and admin management.

---

## 9. Error Handling & Logging

### Bot Errors

Errors thrown inside any scene or middleware bubble up to `bot.catch(botErrorFilter)`:

```typescript
const botErrorFilter = (exception: any, ctx: any) => {
  // 1. Logs the error with full stack trace to logs/bot/errors/
  // 2. Replies to the user with a generic error message
  ctx.replyWithHTML('<b>Something has went wrong</b>\n<i>please restart the bot and try again later</i>');
};
```

### API Errors

Express errors are caught by `APIErrorFilter`, the last middleware in the chain, which returns a structured JSON response.

### Log Files

Logs are written to the `logs/` directory (auto-created at runtime):

```
logs/
├── bot/
│   ├── activities/   # BOT_YYYY-MM-DD-activity.log
│   └── errors/       # BOT_YYYY-MM-DD-error.log
└── api/
    ├── activities/   # API_YYYY-MM-DD-activity.log
    └── errors/       # API_YYYY-MM-DD-error.log
```

Each log entry is JSON-formatted and includes a timestamp, unique request ID, Telegram user ID, message type, and stack trace (errors only).

---

## 10. Deployment

### Using Docker

A `Dockerfile` is included. The image uses `node:20-alpine` and runs the compiled JS output.

```bash
# Build the image
docker build -t telegram-bot .

# Run the container
docker run -d \
  --name telegram-bot \
  -p 8080:8080 \
  --env-file .env \
  telegram-bot
```

The container:
1. Installs dependencies via `npm install`
2. Compiles TypeScript with `npm run build`
3. Starts the server with `npm run start`

> **Before deploying**, make sure to run `npx prisma migrate deploy` against your production database and set all required environment variables.

### Manual Deployment (VPS / Cloud)

```bash
# 1. Build
pnpm build

# 2. Run database migrations
npx prisma migrate deploy

# 3. Start with a process manager (e.g., PM2)
pm2 start dist/index.js --name telegram-bot

# 4. Save PM2 process list
pm2 save
pm2 startup
```

### CI/CD

A `.github/` directory is present, suggesting GitHub Actions workflows may be configured. Add build, test, and deploy steps as needed.

---

## 11. Future Improvements

- **Long Polling fallback**: support a `POLLING=true` mode for environments without a public HTTPS domain.
- **Redis session persistence**: replace `@telegraf/session` in-memory store with a Redis-backed session store using `@telegraf/session/redis`.
- **Rate limiting**: add per-user rate limiting to prevent spam in the bot and the API.
- **Test coverage**: expand the `test/` directory with unit tests for all service and formatter classes.
- **Webhook secret token**: use Telegram's `secretToken` option in `setWebhook` to validate that updates genuinely come from Telegram.
- **Media storage**: replace local `uploads/` with cloud object storage (e.g., AWS S3, Cloudflare R2) for scalability.
- **i18n / localisation**: support multiple languages using a translation library.
- **Admin dashboard UI**: pair the REST API with a React/Next.js admin frontend.
- **Post expiration**: auto-close posts after a configurable number of days.
- **Audit logging**: track who changed what in the admin API for accountability.

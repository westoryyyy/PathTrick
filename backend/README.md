<div align="center">
  <h1>🎯 PathTrick Backend</h1>
  <p><strong>AI-powered Career & Education Coaching Platform</strong></p>
  <p>
    <img src="https://img.shields.io/badge/Fastify-v5-000000?style=flat&logo=fastify" />
    <img src="https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?style=flat&logo=prisma" />
    <img src="https://img.shields.io/badge/LLaMA_3.3_70B-via_Groq-F55036?style=flat" />
    <img src="https://img.shields.io/badge/Web3-BSC_Testnet-F0B90B?style=flat&logo=binance" />
    <img src="https://img.shields.io/badge/Auth-Privy-7C3AED?style=flat" />
  </p>
</div>

---

## Overview

PathTrick is an AI-powered platform that helps Indonesian students navigate their career and education journey. The backend exposes a REST API built with **Fastify v5** and **TypeScript**, backed by **PostgreSQL** (via Prisma) and **Redis** (via BullMQ).

Two distinct user journeys are supported:

- **The Chaser** — high school students exploring university and scholarship recommendations
- **The Scholar** — university students seeking career guidance based on their CV and portfolio

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js 20 + TypeScript |
| **Framework** | Fastify v5 |
| **ORM** | Prisma 6 + PostgreSQL |
| **AI / LLM** | LLaMA 3.3 70B via Groq API |
| **Embeddings** | OpenAI `text-embedding-3-small` + pgvector |
| **Auth** | Privy (social login) + JWT |
| **Queue** | BullMQ + Redis |
| **Web3** | Viem + EIP-712 + BEP-1155 (BSC Testnet) |
| **Validation** | Zod |

---

## Architecture

```text
src/
├── app.ts               # Fastify app factory + route registration
├── server.ts            # HTTP server entrypoint
├── config/env.ts        # Zod-validated environment config
├── lib/
│   ├── prisma.ts        # Singleton Prisma client
│   ├── groq.ts          # Groq LLM wrapper
│   ├── guardrail.ts     # AI response validator + fallback engine
│   ├── embedding.ts     # OpenAI embeddings + pgvector search
│   ├── blockchain.ts    # Viem + EIP-712 signing
│   ├── privy.ts         # Privy server auth SDK
│   └── redis.ts         # IoRedis client
└── modules/
    ├── auth/            # Login, logout, JWT session
    ├── users/           # Profile, onboarding, role selection
    ├── roles/           # Role lookup (CHASER/SCHOLAR/ADMIN)
    ├── houses/          # RIASEC House mapping
    ├── assessment/      # RIASEC, Preference, Scholar Profile assessment
    ├── ai-agent/        # Agent 1 (Chaser), Agent 2 (Scholar), Agent 3 (RAG)
    ├── courses/         # Course browsing, enrollment, quiz submission
    ├── gamification/    # XP system
    ├── universities/    # University discovery + roadmap matches
    ├── scholarships/    # Scholarship discovery + roadmap matches
    └── admin/           # Admin CRUD + SBT certificate endpoints
```

---

## AI Agent System

PathTrick uses 3 specialized AI agents built on **LLaMA 3.3 70B** (via Groq):

| Agent | Trigger | Output |
|---|---|---|
| **Agent 1 — Chaser** | `CHASER_PREFERENCE` assessment | University + Scholarship + Course roadmap |
| **Agent 2 — Scholar** | `SCHOLAR_PROFILE` assessment (CV + portfolio text) | Career + Course roadmap |
| **Agent 3 — Course Generator** | Admin triggers new course creation | Course content via RAG from knowledge base |

All agents use a **guardrail system**: structured Zod validation on the LLM response + automatic deterministic fallback if the AI output is invalid.

---

## Certificate System (Web3)

PathTrick issues **Soulbound Tokens (SBT)** on BSC Testnet when a user completes a course. The mint flow is user-gasless:

1. **`POST /certificates/prepare-mint`** — Backend issues an EIP-712 signature using its wallet private key
2. **Frontend** calls `contract.mint(user, courseId, nonce, deadline, signature)` on-chain
3. **`POST /certificates/confirm-mint`** — Frontend submits `txHash`; backend records on-chain status

Smart contract: `PathtrickSBT.sol` (BEP-1155 standard).

---

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL >= 15 (with `pgvector` extension enabled)
- Redis >= 7

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill environment variables
cp .env.example .env

# 3. Run database migrations
npx prisma migrate dev

# 4. Generate Prisma client
npm run prisma:generate

# 5. Seed master data (roles, houses, skills, jobs, courses, quiz)
npm run prisma:seed

# 6. Seed and embed knowledge base (for Agent 3 RAG)
npm run knowledge:seed
npm run knowledge:embed

# 7. Start development server
npm run dev
```

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload (tsx watch) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production server |
| `npm run prisma:migrate` | Run Prisma migrations |
| `npm run prisma:studio` | Open Prisma Studio (DB GUI) |
| `npm run prisma:seed` | Seed master data |
| `npm run knowledge:seed` | Seed knowledge base documents |
| `npm run knowledge:embed` | Generate and store vector embeddings |

---

## Environment Variables

See [`.env.example`](.env.example) for the full list. Key variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (must have pgvector) |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | Secret for signing JWT sessions |
| `PRIVY_APP_ID` | Privy application ID |
| `PRIVY_APP_SECRET` | Privy application secret |
| `GROQ_API_KEY` | Groq API key (LLaMA 3.3 70B access) |
| `OPENAI_API_KEY` | OpenAI API key (for embeddings) |
| `BACKEND_WALLET_PRIVATE_KEY` | Backend wallet private key for EIP-712 signing |
| `SBT_CONTRACT_ADDRESS` | Deployed PathtrickSBT contract address on BSC Testnet |

---

## API Endpoints (Summary)

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | — | Login with Privy token, receive JWT |
| `POST` | `/auth/logout` | JWT | Logout |
| `GET` | `/users/me` | JWT | Get own profile |
| `PATCH` | `/users/me` | JWT | Update display name / avatar |
| `POST` | `/users/me/select-role` | JWT | Select CHASER or SCHOLAR during onboarding |
| `GET` | `/roles` | — | List available roles |
| `GET` | `/houses` | — | List RIASEC houses |
| `POST` | `/assessment/submit` | JWT | Submit assessment (RIASEC / Preference / Scholar Profile) |
| `GET` | `/courses` | JWT | Browse recommended courses |
| `GET` | `/courses/:id` | JWT | Course detail with sections |
| `POST` | `/courses/:id/enroll` | JWT | Enroll in a course |
| `POST` | `/courses/:id/sections/:sid/quiz/submit` | JWT | Submit quiz answers (auto-graded) |
| `GET` | `/universities` | JWT | Browse universities |
| `GET` | `/scholarships` | JWT | Browse scholarships |
| `POST` | `/certificates/prepare-mint` | JWT | Get EIP-712 signature for SBT mint |
| `POST` | `/certificates/confirm-mint` | JWT | Confirm on-chain mint with tx hash |

---

## Contributing

This project was built for a hackathon. For team development:

1. All new modules follow the pattern: `route.ts` -> `service.ts` -> `schema.ts`
2. All protected routes use the `authenticate` Fastify plugin decorator
3. **Never use `Course.id` (cuid) for on-chain parameters** — use `Course.onChainId` (Int autoincrement)
4. Run `npx tsc --noEmit` before pushing to verify type safety

---

## License

MIT
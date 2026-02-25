# GlenRay Systems — Internal CRM Dashboard

An internal CRM and operations dashboard for managing clients, service packages, delivery workflows, and AI agent outputs.

**Built with:** Next.js 14, React 18, Tailwind CSS, TypeScript

**Not customer-facing** — this is your internal operating system.

---

## Quick Start

```bash
cd crm
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Default password:** `glenray2026` (change in `.env.local`)

---

## What's Inside

### Dashboard (`/`)
- Total clients, active engagements, revenue overview
- Client pipeline by status
- Revenue breakdown by vertical
- Recent clients and upcoming tasks

### Clients (`/clients`)
- Full client list with search and filter (by status, vertical)
- Add new clients via modal form
- Client detail view with tabs:
  - **Overview** — editable contact info, notes, status
  - **Services** — all service engagements for this client
  - **AI Outputs** — research briefs, proposals, reports generated for this client
  - **Workflow** — delivery pipeline with interactive task checklist

### Services (`/services`)
- All active/pending service engagements
- Create new engagements from the service catalog (all 15 GlenRay packages)
- Auto-calculates price based on tier selection
- Full service catalog reference table with Starter/Growth/Premium pricing

### AI Outputs (`/ai-outputs`)
- Queue AI generations (research briefs, proposals, reports, case studies)
- View completed outputs
- Filter by type and status
- "Simulate Complete" for testing (real AI integration ready)

### Workflows (`/workflows`)
- Visual delivery pipeline: Onboard → Build → Test → Launch → Support → Expand
- Interactive task checklist (click to toggle complete)
- Progress bars per engagement
- Overdue task tracking
- Filter by engagement

---

## Data Storage

### Production (Vercel)
This app now uses **Supabase** when these env vars are present:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Local fallback
If Supabase env vars are missing, it falls back to JSON files under `src/data/`:

```
src/data/
├── clients.json
├── services.json
├── workflows.json
└── ai-outputs.json
```

### Supabase Setup (5 minutes)
1. Create a Supabase project.
2. In Supabase SQL editor, run:
   - `supabase/schema.sql`
   - `supabase/seed.sql` (optional demo data)
3. In Vercel project settings, set:
   - `CRM_PASSWORD=glenray2026`
   - `SESSION_SECRET=<long-random-secret>`
   - `SUPABASE_URL=<your-url>`
   - `SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>`
4. Redeploy.

---

## Authentication

Simple password-based auth for internal use:

- Password set in `.env.local` → `CRM_PASSWORD`
- Cookie-based session (7-day expiry)
- Middleware protects all routes except `/login`

For multi-user auth, upgrade to NextAuth.js:
1. `npm install next-auth`
2. Add provider config (credentials, Google, etc.)
3. Replace middleware and auth lib

---

## AI Agent Integration

The CRM is designed to connect to your GlenRay AI agents:

### Current State (Demo Mode)
- "Generate Output" creates a pending task
- "Simulate Complete" fills in placeholder content

### To Connect Real AI Agents

1. Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

2. Create an API route at `src/app/api/ai-outputs/generate/route.ts`:
   ```typescript
   // Pull the system prompt from 06-Internal-Agents/
   // Call OpenAI API with client context
   // Update the ai-output record with the response
   ```

3. The system prompts are already written in:
   - `06-Internal-Agents/Agent-01-Research-Agent.md`
   - `06-Internal-Agents/Agent-02-Proposal-Agent.md`
   - `06-Internal-Agents/Agent-03-Reporting-Agent.md`

### Integration Points

| Feature | Status | What's Needed |
|---------|--------|---------------|
| Research briefs | Ready to connect | OpenAI API + web scraping |
| Proposal generation | Ready to connect | OpenAI API + client data |
| Monthly reports | Ready to connect | OpenAI API + metrics data |
| Email sending | Planned | SendGrid/Resend API |
| Calendar sync | Planned | Google Calendar API |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clients` | List all clients |
| POST | `/api/clients` | Create client |
| GET | `/api/clients/[id]` | Get client by ID |
| PATCH | `/api/clients/[id]` | Update client |
| DELETE | `/api/clients/[id]` | Delete client |
| GET | `/api/services` | List all services |
| POST | `/api/services` | Create engagement |
| PATCH | `/api/services/[id]` | Update engagement |
| DELETE | `/api/services/[id]` | Delete engagement |
| GET | `/api/ai-outputs` | List all AI outputs |
| POST | `/api/ai-outputs` | Queue AI generation |
| PATCH | `/api/ai-outputs/[id]` | Update AI output |
| GET | `/api/workflows` | List all workflow tasks |
| PATCH | `/api/workflows` | Update task |
| POST | `/api/auth` | Login |
| DELETE | `/api/auth` | Logout |

---

## Project Structure

```
crm/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with sidebar
│   │   ├── page.tsx                # Dashboard
│   │   ├── globals.css             # Tailwind + custom styles
│   │   ├── login/page.tsx          # Auth page
│   │   ├── clients/
│   │   │   ├── page.tsx            # Client list
│   │   │   └── [id]/page.tsx       # Client detail
│   │   ├── services/page.tsx       # Services & catalog
│   │   ├── ai-outputs/page.tsx     # AI output management
│   │   ├── workflows/page.tsx      # Workflow tracker
│   │   └── api/                    # All API routes
│   ├── components/
│   │   ├── Sidebar.tsx             # Navigation
│   │   ├── StatusBadge.tsx         # Color-coded status pills
│   │   └── Modal.tsx               # Reusable modal
│   ├── lib/
│   │   ├── types.ts                # TypeScript types + service catalog
│   │   ├── db.ts                   # Supabase adapter + local JSON fallback
│   │   ├── supabase.ts             # Supabase admin client
│   │   └── auth.ts                 # Auth utilities
│   └── data/                       # Local JSON fallback data
├── supabase/
│   ├── schema.sql                  # DB schema
│   └── seed.sql                    # Optional demo seed data
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── .env.example                    # Required env vars template
└── .env.local                      # Local env vars (not committed)
```

---

## Tie-In to GlenRay Operations

This CRM connects directly to your operational docs:

| CRM Feature | Operational Doc |
|-------------|----------------|
| Client pipeline stages | `02-Sales/Discovery-Process.md` |
| Service catalog + pricing | `07-Service-Packages/` |
| Workflow phases | `03-Delivery/Delivery-Workflow.md` |
| Onboarding checklist | `03-Delivery/Client-Onboarding-Checklist.md` |
| AI agent outputs | `06-Internal-Agents/` |
| Prompt library | `04-Prompt-Libraries/` |
| Quality standards | `05-SOPs/SOP-03-Quality-Assurance.md` |

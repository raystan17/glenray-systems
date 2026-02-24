# GlenRay Systems — Delivery Workflow

## Overview

Every client engagement follows this standardized delivery workflow. This ensures consistency, quality, and scalability — regardless of who on the team is implementing.

**Key principle:** If a junior implementer can't follow this workflow with minimal guidance, the workflow needs to be improved — not the person.

---

## Delivery Phases

```
[SOLD] → [ONBOARD] → [BUILD] → [TEST] → [LAUNCH] → [SUPPORT] → [EXPAND]
  Day 0     Day 1-3    Day 4-14   Day 15-17  Day 18-21   Day 22-90    Day 90+
```

---

## Phase 1: ONBOARD (Days 1–3)

### Trigger
Client signs agreement and payment is received.

### Actions

| Step | Owner | Action | Tool/Template |
|------|-------|--------|---------------|
| 1.1 | Account Lead | Send Welcome Email | Welcome Email Template |
| 1.2 | Account Lead | Create client workspace (project folder + channels) | Internal SOP |
| 1.3 | Account Lead | Schedule kickoff call | Calendar |
| 1.4 | Implementer | Review discovery notes and audit report | Internal docs |
| 1.5 | Account Lead | Send Client Onboarding Checklist | Onboarding Checklist Template |
| 1.6 | Account Lead | Conduct kickoff call (30 min) | Kickoff Agenda Template |

### Kickoff Call Agenda (30 min)

1. Introductions — who's who on both sides (3 min)
2. Recap scope and timeline (5 min)
3. Walk through what we need from them (access, credentials, info) (10 min)
4. Set communication expectations (Slack/email, response times) (5 min)
5. Schedule first check-in (2 min)
6. Q&A (5 min)

### Deliverables
- [ ] Client workspace created
- [ ] Kickoff call completed
- [ ] All access/credentials received
- [ ] Client Onboarding Checklist sent and acknowledged

---

## Phase 2: BUILD (Days 4–14)

### Actions

| Step | Owner | Action | Duration |
|------|-------|--------|----------|
| 2.1 | Implementer | Set up AI tools and accounts | Day 4 |
| 2.2 | Implementer | Configure integrations (CRM, email, calendar, etc.) | Day 5–6 |
| 2.3 | Implementer | Build automation workflows | Day 7–10 |
| 2.4 | Implementer | Create/customize prompts | Day 7–10 |
| 2.5 | Implementer | Write user documentation | Day 11–12 |
| 2.6 | Implementer | Internal QA testing | Day 13–14 |
| 2.7 | Account Lead | Mid-build check-in with client | Day 10 |

### Build Standards

- All automations must have error handling and fallback logic
- All prompts must be version-controlled in the prompt library
- All integrations must be documented (what connects to what)
- All client-facing outputs must be reviewed for tone and accuracy
- No "it works on my machine" — test in client's environment

### Mid-Build Check-In (15 min)

1. Show progress (demo if possible)
2. Flag any blockers or scope questions
3. Confirm launch date
4. Get any remaining info/access needed

### Deliverables
- [ ] All automations built and internally tested
- [ ] User documentation drafted
- [ ] Integration map completed
- [ ] Mid-build check-in completed

---

## Phase 3: TEST (Days 15–17)

### Actions

| Step | Owner | Action |
|------|-------|--------|
| 3.1 | Implementer | Run full end-to-end test with real-world data |
| 3.2 | Implementer | Test edge cases and error scenarios |
| 3.3 | Implementer | Fix any issues found |
| 3.4 | Account Lead | Client UAT session (30 min) |
| 3.5 | Implementer | Incorporate client feedback |

### Testing Checklist

- [ ] Happy path works end-to-end
- [ ] Edge cases handled (empty fields, weird formatting, duplicate entries)
- [ ] Error notifications work (team gets alerted when something fails)
- [ ] Integrations sync correctly in both directions
- [ ] AI outputs are accurate and appropriately toned
- [ ] Speed/performance is acceptable
- [ ] Client has reviewed and approved outputs

### Client UAT Session (30 min)

1. Walk through each automation live
2. Let the client trigger a workflow themselves
3. Note any feedback or change requests
4. Confirm launch readiness

### Deliverables
- [ ] All tests passed
- [ ] Client UAT completed
- [ ] Feedback incorporated
- [ ] Launch approval received

---

## Phase 4: LAUNCH (Days 18–21)

### Actions

| Step | Owner | Action |
|------|-------|--------|
| 4.1 | Implementer | Deploy to production |
| 4.2 | Implementer | Activate all automations |
| 4.3 | Account Lead | Client training session (45 min) |
| 4.4 | Implementer | Monitor first 48 hours actively |
| 4.5 | Account Lead | Send "You're Live!" email with documentation |

### Training Session Agenda (45 min)

1. Overview of what's been set up (5 min)
2. Live demo of each automation (15 min)
3. Hands-on: client team tries it themselves (15 min)
4. Where to find documentation (5 min)
5. How to reach us for support (5 min)

### Launch Day Checklist

- [ ] All automations live and running
- [ ] Client team trained
- [ ] Documentation delivered
- [ ] Monitoring active
- [ ] Support channels confirmed

---

## Phase 5: SUPPORT (Days 22–90)

### Support Tiers

| Tier | Response Time | Includes |
|------|--------------|----------|
| **Starter** | 48-hour response | Email support, bug fixes only |
| **Growth** | 24-hour response | Email + chat support, bug fixes + minor adjustments |
| **Premium** | Same-day response | Priority support, optimization, monthly review calls |

### Weekly Check-In Cadence

| Week | Activity |
|------|----------|
| Week 1 | Daily monitoring + quick check-in call |
| Week 2 | Bi-weekly monitoring + email check-in |
| Week 3–4 | Weekly monitoring + performance report |
| Month 2 | Bi-weekly monitoring + optimization suggestions |
| Month 3 | Monthly review + expansion conversation |

### Support Tracking

Every support interaction gets logged:
- Date / time
- Issue description
- Root cause
- Resolution
- Time to resolve
- Was it a bug, user error, or feature request?

---

## Phase 6: EXPAND (Day 90+)

### Purpose
Convert successful engagements into recurring revenue and referrals.

### Expansion Playbook

1. **Month 3 Review Call** — Present results, ROI achieved, usage stats
2. **Upsell conversation** — "Based on what we've seen, here are 2 more areas where we could save you [X] hours/week..."
3. **Referral ask** — "Who else in your network deals with [pain point]? I'd love to help them too."
4. **Retainer proposal** — Ongoing optimization + support at $[X]/month
5. **Case study request** — Document the win for marketing

### Expansion Metrics

| Metric | Target |
|--------|--------|
| Clients who expand to Growth/Premium | 40%+ |
| Retainer conversion rate | 50%+ |
| Referrals per client | 1–2 |
| Case studies per quarter | 2+ |

---

## Delivery Quality Standards

### Every engagement must include:

1. **Documentation** — Client receives clear docs they can reference
2. **Training** — At least one live training session recorded
3. **Error handling** — Every automation has a failure notification
4. **Monitoring** — We know before the client when something breaks
5. **Handoff notes** — If another team member takes over, they can pick up instantly

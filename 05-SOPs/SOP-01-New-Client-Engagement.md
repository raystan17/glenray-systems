# SOP-01: New Client Engagement (End-to-End)

**Version:** 1.0  
**Last Updated:** Feb 2026  
**Owner:** Operations Lead  

---

## Purpose

This SOP covers the complete lifecycle of a client engagement, from first contact through expansion. Follow these steps in order. Do not skip steps.

---

## Roles

| Role | Responsibilities |
|------|-----------------|
| **Account Lead** | Sales, client communication, relationship management |
| **Implementer** | Technical build, testing, documentation |
| **QA Reviewer** | Reviews automations and outputs before delivery |

---

## Process

### Stage 1: Lead Intake

**Trigger:** Inbound inquiry or outbound prospect responds  
**Time:** < 2 hours from receipt

1. Log the lead in CRM with source, contact info, and initial notes
2. Send acknowledgment email within 2 hours (use template: `08-Templates/Lead-Acknowledgment-Email.md`)
3. Review lead against ICP checklist (see `01-Strategy/Business-Foundation.md`)
4. If qualified → Schedule qualification call within 48 hours
5. If not qualified → Send polite decline with alternative resource (workshop link, guide)

---

### Stage 2: Qualification Call

**Time:** 15–20 min  
**Reference:** `02-Sales/Discovery-Process.md` — Phase 1

1. Conduct qualification call using the script framework
2. Complete the qualification checklist during/after the call
3. Log call notes in CRM
4. If qualified → Schedule discovery deep-dive within 1 week
5. If not qualified → Mark lead as "Nurture" and add to email list

---

### Stage 3: Discovery Deep-Dive

**Time:** 45 min  
**Reference:** `02-Sales/Discovery-Process.md` — Phase 2

1. Conduct deep-dive using the agenda template
2. Map 3–5 workflows using the workflow mapping table
3. Document all findings in the client project folder
4. Send follow-up email within 24 hours summarizing what was discussed and next steps

---

### Stage 4: Automation Audit

**Time:** 2–4 hours (internal)  
**Reference:** `08-Templates/Automation-Audit-Template.md`

1. Review all discovery notes
2. Score each workflow using the Automation Opportunity Matrix
3. Identify top 3 opportunities
4. Calculate estimated ROI for each
5. Draft the Automation Opportunity Report
6. Have a second team member review the report
7. Schedule presentation call with client

---

### Stage 5: Proposal Presentation

**Time:** 30 min  
**Reference:** `02-Sales/Discovery-Process.md` — Phase 4

1. Present Automation Opportunity Report
2. Walk through recommendations and pricing tiers
3. Handle objections using the objection guide
4. Either close the deal or set a decision deadline (max 7 days)
5. Send proposal document within 24 hours of call
6. Follow up on day 3 and day 7 if no response

---

### Stage 6: Onboarding

**Time:** Days 1–3  
**Reference:** `03-Delivery/Client-Onboarding-Checklist.md`

1. Process payment and countersign agreement
2. Create client project folder
3. Set up communication channel
4. Send welcome email and onboarding checklist
5. Schedule and conduct kickoff call
6. Collect all access/credentials
7. Confirm build start date

---

### Stage 7: Build

**Time:** Days 4–14  
**Reference:** `03-Delivery/Delivery-Workflow.md` — Phase 2

1. Set up AI tools and accounts
2. Configure integrations
3. Build automation workflows using prompt library templates
4. Create client-specific documentation
5. Conduct internal QA testing
6. Conduct mid-build check-in with client

---

### Stage 8: Test & Launch

**Time:** Days 15–21  
**Reference:** `03-Delivery/Delivery-Workflow.md` — Phases 3 & 4

1. Run end-to-end testing
2. Conduct client UAT session
3. Incorporate feedback
4. Deploy to production
5. Conduct training session (record it)
6. Send "You're Live!" email with all documentation
7. Begin active monitoring

---

### Stage 9: Support

**Time:** Days 22–90  
**Reference:** `03-Delivery/Delivery-Workflow.md` — Phase 5

1. Follow support cadence based on client tier
2. Log all support interactions
3. Send monthly performance report
4. Flag optimization opportunities

---

### Stage 10: Expand

**Time:** Day 90+  
**Reference:** `03-Delivery/Delivery-Workflow.md` — Phase 6

1. Conduct Month 3 review with ROI analysis
2. Present expansion opportunities
3. Ask for referrals
4. Propose retainer agreement
5. Request case study participation

---

## Quality Gates

Each stage has a quality gate — you cannot proceed to the next stage until the gate is passed:

| Stage | Quality Gate |
|-------|-------------|
| Lead Intake | Lead logged in CRM and qualified |
| Qualification | Call completed, checklist filled, go/no-go decided |
| Discovery | All workflows mapped, notes documented |
| Audit | Report drafted and peer-reviewed |
| Proposal | Presented to client, follow-up scheduled |
| Onboarding | All access received, kickoff completed |
| Build | Internal QA passed |
| Test/Launch | Client UAT approved, training completed |
| Support | Monthly report delivered |
| Expand | Review call completed |

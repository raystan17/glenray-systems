# SOP-02: Implementation Standards

**Version:** 1.0  
**Last Updated:** Feb 2026  
**Owner:** Technical Lead  

---

## Purpose

This SOP defines how every automation is built, tested, and documented at GlenRay Systems. Every implementer follows these standards regardless of the use case or client.

---

## Project Folder Structure

Every client project uses this folder structure:

```
ClientName_ServiceName_YYYY-MM/
├── 01-Discovery/
│   ├── discovery-notes.md
│   ├── workflow-maps.md
│   └── audit-report.md
├── 02-Build/
│   ├── architecture-diagram.md
│   ├── integration-map.md
│   ├── prompts/
│   │   ├── prompt-v1.md
│   │   └── prompt-v2.md (if revised)
│   └── configuration-notes.md
├── 03-Testing/
│   ├── test-cases.md
│   ├── test-results.md
│   └── uat-feedback.md
├── 04-Documentation/
│   ├── user-guide.md
│   ├── admin-guide.md
│   └── troubleshooting.md
├── 05-Support/
│   ├── support-log.md
│   └── monthly-reports/
└── credentials.md (ENCRYPTED / RESTRICTED ACCESS)
```

---

## Prompt Engineering Standards

### Every prompt must include:

1. **Role definition** — Who is the AI acting as?
2. **Context** — What does the AI need to know about the business?
3. **Task** — What specifically should it do?
4. **Rules/constraints** — What should it NOT do?
5. **Output format** — Exactly how should the response be structured?

### Prompt quality checklist:

- [ ] Tested with at least 5 different inputs
- [ ] Edge cases handled (empty inputs, weird formatting, unexpected data)
- [ ] Output is consistent across runs
- [ ] No hallucination risk (prompt restricts AI to provided information)
- [ ] Client-approved tone and language
- [ ] Version-controlled (v1, v2, etc.)

### Prompt versioning:

- Save every version — never overwrite
- Name format: `[use-case]-v[number].md`
- Log changes: what changed, why, and who approved it

---

## Integration Standards

### Before connecting any integration:

- [ ] Verify API credentials are valid
- [ ] Test in sandbox/staging environment first
- [ ] Document the data flow (what goes where)
- [ ] Set up error notifications
- [ ] Confirm rate limits and quotas
- [ ] Verify data privacy compliance

### Integration documentation must include:

| Field | Details |
|-------|---------|
| **Source system** | What sends data |
| **Destination system** | What receives data |
| **Trigger** | What starts the flow |
| **Data fields mapped** | Which fields connect |
| **Error handling** | What happens when it fails |
| **Monitoring** | How we know it's working |

---

## Testing Standards

### Every automation must pass these tests:

**Functional Tests:**
- [ ] Happy path works end-to-end
- [ ] All data flows correctly between systems
- [ ] AI outputs are accurate and well-formatted
- [ ] Notifications and alerts fire correctly

**Edge Case Tests:**
- [ ] Empty/missing data handled gracefully
- [ ] Duplicate entries handled
- [ ] Special characters and formatting preserved
- [ ] Long inputs don't break the system
- [ ] Concurrent usage doesn't cause conflicts

**Failure Tests:**
- [ ] System degrades gracefully when an API is down
- [ ] Error notifications reach the right people
- [ ] Data isn't lost during failures
- [ ] Recovery is possible without manual intervention

**Performance Tests:**
- [ ] Response time is acceptable for the use case
- [ ] No unnecessary API calls or loops
- [ ] Cost per operation is within budget

---

## Documentation Standards

### Every project must deliver:

1. **User Guide** — For the client's team who will use the automation daily
   - Step-by-step instructions with screenshots
   - FAQ section
   - "What to do if..." troubleshooting section
   - Written at a 6th-grade reading level

2. **Admin Guide** — For the client's tech-savvy person (or us)
   - Architecture overview
   - Integration details
   - How to modify settings
   - Credential management

3. **Troubleshooting Guide** — Common issues and fixes
   - Symptom → Cause → Fix format
   - Escalation path if self-service doesn't work

---

## Handoff Standards

When a project transitions between team members or to support:

- [ ] All documentation is complete and up-to-date
- [ ] Credentials are stored securely and accessible
- [ ] Architecture is documented (what connects to what)
- [ ] Known issues or quirks are listed
- [ ] Client preferences and communication style are noted
- [ ] Outstanding items or follow-ups are flagged

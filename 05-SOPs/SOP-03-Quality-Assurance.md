# SOP-03: Quality Assurance

**Version:** 1.0  
**Last Updated:** Feb 2026  
**Owner:** QA Reviewer  

---

## Purpose

Every automation we deliver must pass QA before reaching the client. This SOP defines who reviews, what they check, and how issues get resolved.

---

## QA Process

### When QA happens:
- **Pre-UAT:** After the implementer finishes building, before the client sees it
- **Post-feedback:** After incorporating client UAT feedback, before launch
- **Post-launch:** 48-hour post-launch review

### Who does QA:
- A team member OTHER than the implementer who built it
- If team is small, the Account Lead reviews from a client experience perspective

---

## QA Checklist

### 1. Functionality Review

- [ ] All automations trigger correctly
- [ ] Data flows accurately between all connected systems
- [ ] AI responses are accurate, relevant, and appropriately toned
- [ ] All conditional logic works (if/then branches)
- [ ] Error handling catches failures and notifies appropriately
- [ ] No duplicate actions (emails sent twice, records created twice, etc.)

### 2. Client Experience Review

- [ ] All client-facing outputs (emails, messages, documents) are polished
- [ ] Spelling and grammar are correct
- [ ] Brand voice is consistent with client's preferences
- [ ] The automation feels invisible — like it "just works"
- [ ] No exposed technical details visible to end users

### 3. Documentation Review

- [ ] User guide is complete and accurate
- [ ] Screenshots match current state
- [ ] Troubleshooting guide covers likely scenarios
- [ ] Admin guide has all necessary technical details

### 4. Security & Compliance Review

- [ ] No credentials hardcoded or exposed
- [ ] Data handling complies with client's industry requirements
- [ ] Personal data is handled appropriately
- [ ] Access controls are properly set

### 5. Performance Review

- [ ] Automation runs within acceptable time limits
- [ ] No unnecessary API calls or resource usage
- [ ] Monthly operating cost is within quoted budget

---

## Issue Classification

| Severity | Definition | Resolution Time |
|----------|-----------|----------------|
| **Critical** | Automation doesn't work or produces wrong outputs | Fix before proceeding |
| **Major** | Works but with significant issues (wrong tone, missing data, poor UX) | Fix before client sees it |
| **Minor** | Works correctly but could be improved (formatting, wording) | Fix before launch |
| **Enhancement** | Works well but could be even better | Log for future improvement |

---

## QA Sign-Off

```
QA SIGN-OFF

Project: ___________________________
Reviewer: __________________________
Date: ______________________________

[ ] All critical and major issues resolved
[ ] All minor issues resolved or accepted
[ ] Documentation complete
[ ] Ready for: [ ] UAT  [ ] Launch

Reviewer signature: _________________
Notes: _____________________________
```

insert into clients (id, name, company, email, phone, vertical, status, notes, created_at, updated_at)
values
  ('client-001', 'Dr. Sarah Mitchell', 'Bright Smile Dental', 'sarah@brightsmile.com', '(555) 201-3344', 'healthcare', 'active', '3-location dental practice. Primary pain: no-shows costing ~$4K/month.', now(), now()),
  ('client-002', 'Mark Henderson', 'Henderson & Associates Law', 'mark@hendersonlaw.com', '(555) 887-1200', 'professional_services', 'active', '12-person law firm. Partners buried in email.', now(), now())
on conflict (id) do nothing;

insert into services (id, client_id, service_name, service_slug, tier, price, status, start_date, estimated_end_date, current_phase, created_at)
values
  ('svc-001', 'client-001', 'No-Show Shield', 'no-show-shield', 'growth', 7500, 'active', '2026-02-01', '2026-02-28', 'build', now()),
  ('svc-002', 'client-002', 'Smart Inbox Manager', 'smart-inbox-manager', 'growth', 9000, 'active', '2026-02-10', '2026-03-10', 'onboard', now())
on conflict (id) do nothing;

insert into workflows (id, engagement_id, client_id, phase, task_name, completed, due_date, completed_date, assignee)
values
  ('wf-001', 'svc-001', 'client-001', 'onboard', 'Send welcome email & onboarding checklist', true, '2026-02-02', '2026-02-01', 'Account Lead'),
  ('wf-002', 'svc-001', 'client-001', 'build', 'Configure SMS/email reminder integrations', false, '2026-02-14', null, 'Implementer')
on conflict (id) do nothing;

insert into ai_outputs (id, client_id, type, title, status, content, agent_used, created_at, completed_at)
values
  ('ai-001', 'client-001', 'research_brief', 'Prospect Research: Bright Smile Dental', 'complete', 'Sample seeded output for demo environment.', 'Research Agent', now(), now()),
  ('ai-002', 'client-002', 'proposal', 'Proposal: Smart Inbox Manager', 'pending', '', 'Proposal Agent', now(), null)
on conflict (id) do nothing;

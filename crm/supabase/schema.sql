create table if not exists clients (
  id text primary key,
  name text not null,
  company text not null,
  email text not null default '',
  phone text not null default '',
  vertical text not null,
  status text not null,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services (
  id text primary key,
  client_id text not null references clients(id) on delete cascade,
  service_name text not null,
  service_slug text not null,
  tier text not null,
  price integer not null default 0,
  status text not null,
  start_date text,
  estimated_end_date text,
  current_phase text not null,
  created_at timestamptz not null default now()
);

create table if not exists workflows (
  id text primary key,
  engagement_id text not null references services(id) on delete cascade,
  client_id text not null references clients(id) on delete cascade,
  phase text not null,
  task_name text not null,
  completed boolean not null default false,
  due_date text not null,
  completed_date text,
  assignee text not null
);

create table if not exists ai_outputs (
  id text primary key,
  client_id text not null references clients(id) on delete cascade,
  type text not null,
  title text not null,
  status text not null,
  content text not null default '',
  agent_used text not null,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_services_client_id on services(client_id);
create index if not exists idx_workflows_engagement_id on workflows(engagement_id);
create index if not exists idx_workflows_client_id on workflows(client_id);
create index if not exists idx_ai_outputs_client_id on ai_outputs(client_id);

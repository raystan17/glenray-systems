import fs from "fs";
import path from "path";
import type { Client, ServiceEngagement, WorkflowTask, AIOutput } from "./types";
import { getSupabaseAdmin, isSupabaseConfigured } from "./supabase";

const BUNDLED_DATA = path.join(process.cwd(), "src", "data");
const VERCEL_TMP_DATA = "/tmp/glenray-crm-data";
const FILES = ["clients.json", "services.json", "workflows.json", "ai-outputs.json"] as const;

function getDataDir(): string {
  if (process.env.VERCEL && !isSupabaseConfigured()) {
    if (!fs.existsSync(VERCEL_TMP_DATA)) fs.mkdirSync(VERCEL_TMP_DATA, { recursive: true });
    for (const f of FILES) {
      const src = path.join(BUNDLED_DATA, f);
      const dst = path.join(VERCEL_TMP_DATA, f);
      if (fs.existsSync(src) && !fs.existsSync(dst)) fs.copyFileSync(src, dst);
    }
    return VERCEL_TMP_DATA;
  }
  return BUNDLED_DATA;
}

function readJSON<T>(filename: string): T[] {
  const dir = getDataDir();
  const filePath = path.join(dir, filename);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function writeJSON<T>(filename: string, data: T[]): void {
  const dir = getDataDir();
  const filePath = path.join(dir, filename);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function mapClientRow(row: any): Client {
  return {
    id: row.id,
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    vertical: row.vertical,
    status: row.status,
    notes: row.notes ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapServiceRow(row: any): ServiceEngagement {
  return {
    id: row.id,
    clientId: row.client_id,
    serviceName: row.service_name,
    serviceSlug: row.service_slug,
    tier: row.tier,
    price: row.price,
    status: row.status,
    startDate: row.start_date ?? "",
    estimatedEndDate: row.estimated_end_date ?? "",
    currentPhase: row.current_phase,
    createdAt: row.created_at,
  };
}

function mapWorkflowRow(row: any): WorkflowTask {
  return {
    id: row.id,
    engagementId: row.engagement_id,
    clientId: row.client_id,
    phase: row.phase,
    taskName: row.task_name,
    completed: row.completed,
    dueDate: row.due_date,
    completedDate: row.completed_date,
    assignee: row.assignee,
  };
}

function mapAIOutputRow(row: any): AIOutput {
  return {
    id: row.id,
    clientId: row.client_id,
    type: row.type,
    title: row.title,
    status: row.status,
    content: row.content ?? "",
    agentUsed: row.agent_used,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}

export const db = {
  clients: {
    getAll: async (): Promise<Client[]> => {
      if (!isSupabaseConfigured()) return readJSON<Client>("clients.json");
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapClientRow);
    },

    getById: async (id: string): Promise<Client | undefined> => {
      if (!isSupabaseConfigured()) return readJSON<Client>("clients.json").find((c) => c.id === id);
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.from("clients").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? mapClientRow(data) : undefined;
    },

    create: async (client: Client): Promise<Client> => {
      if (!isSupabaseConfigured()) {
        const all = readJSON<Client>("clients.json");
        all.push(client);
        writeJSON("clients.json", all);
        return client;
      }

      const supabase = getSupabaseAdmin();
      const payload = {
        id: client.id,
        name: client.name,
        company: client.company,
        email: client.email,
        phone: client.phone,
        vertical: client.vertical,
        status: client.status,
        notes: client.notes,
        created_at: client.createdAt,
        updated_at: client.updatedAt,
      };
      const { data, error } = await supabase.from("clients").insert(payload).select("*").single();
      if (error) throw error;
      return mapClientRow(data);
    },

    update: async (id: string, updates: Partial<Client>): Promise<Client | null> => {
      if (!isSupabaseConfigured()) {
        const all = readJSON<Client>("clients.json");
        const idx = all.findIndex((c) => c.id === id);
        if (idx === -1) return null;
        all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
        writeJSON("clients.json", all);
        return all[idx];
      }

      const supabase = getSupabaseAdmin();
      const payload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.company !== undefined) payload.company = updates.company;
      if (updates.email !== undefined) payload.email = updates.email;
      if (updates.phone !== undefined) payload.phone = updates.phone;
      if (updates.vertical !== undefined) payload.vertical = updates.vertical;
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.notes !== undefined) payload.notes = updates.notes;

      const { data, error } = await supabase.from("clients").update(payload).eq("id", id).select("*").maybeSingle();
      if (error) throw error;
      return data ? mapClientRow(data) : null;
    },

    delete: async (id: string): Promise<boolean> => {
      if (!isSupabaseConfigured()) {
        const all = readJSON<Client>("clients.json");
        const filtered = all.filter((c) => c.id !== id);
        if (filtered.length === all.length) return false;
        writeJSON("clients.json", filtered);
        return true;
      }

      const supabase = getSupabaseAdmin();
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
      return true;
    },
  },

  services: {
    getAll: async (): Promise<ServiceEngagement[]> => {
      if (!isSupabaseConfigured()) return readJSON<ServiceEngagement>("services.json");
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.from("services").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapServiceRow);
    },

    getByClientId: async (clientId: string): Promise<ServiceEngagement[]> => {
      if (!isSupabaseConfigured()) {
        return readJSON<ServiceEngagement>("services.json").filter((s) => s.clientId === clientId);
      }
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapServiceRow);
    },

    create: async (service: ServiceEngagement): Promise<ServiceEngagement> => {
      if (!isSupabaseConfigured()) {
        const all = readJSON<ServiceEngagement>("services.json");
        all.push(service);
        writeJSON("services.json", all);
        return service;
      }

      const supabase = getSupabaseAdmin();
      const payload = {
        id: service.id,
        client_id: service.clientId,
        service_name: service.serviceName,
        service_slug: service.serviceSlug,
        tier: service.tier,
        price: service.price,
        status: service.status,
        start_date: service.startDate || null,
        estimated_end_date: service.estimatedEndDate || null,
        current_phase: service.currentPhase,
        created_at: service.createdAt,
      };
      const { data, error } = await supabase.from("services").insert(payload).select("*").single();
      if (error) throw error;
      return mapServiceRow(data);
    },

    update: async (id: string, updates: Partial<ServiceEngagement>): Promise<ServiceEngagement | null> => {
      if (!isSupabaseConfigured()) {
        const all = readJSON<ServiceEngagement>("services.json");
        const idx = all.findIndex((s) => s.id === id);
        if (idx === -1) return null;
        all[idx] = { ...all[idx], ...updates };
        writeJSON("services.json", all);
        return all[idx];
      }

      const supabase = getSupabaseAdmin();
      const payload: Record<string, any> = {};
      if (updates.clientId !== undefined) payload.client_id = updates.clientId;
      if (updates.serviceName !== undefined) payload.service_name = updates.serviceName;
      if (updates.serviceSlug !== undefined) payload.service_slug = updates.serviceSlug;
      if (updates.tier !== undefined) payload.tier = updates.tier;
      if (updates.price !== undefined) payload.price = updates.price;
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.startDate !== undefined) payload.start_date = updates.startDate || null;
      if (updates.estimatedEndDate !== undefined) payload.estimated_end_date = updates.estimatedEndDate || null;
      if (updates.currentPhase !== undefined) payload.current_phase = updates.currentPhase;

      const { data, error } = await supabase.from("services").update(payload).eq("id", id).select("*").maybeSingle();
      if (error) throw error;
      return data ? mapServiceRow(data) : null;
    },

    delete: async (id: string): Promise<boolean> => {
      if (!isSupabaseConfigured()) {
        const all = readJSON<ServiceEngagement>("services.json");
        const filtered = all.filter((s) => s.id !== id);
        if (filtered.length === all.length) return false;
        writeJSON("services.json", filtered);
        return true;
      }

      const supabase = getSupabaseAdmin();
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
      return true;
    },
  },

  workflows: {
    getAll: async (): Promise<WorkflowTask[]> => {
      if (!isSupabaseConfigured()) return readJSON<WorkflowTask>("workflows.json");
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.from("workflows").select("*").order("due_date", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(mapWorkflowRow);
    },

    getByEngagementId: async (engagementId: string): Promise<WorkflowTask[]> => {
      if (!isSupabaseConfigured()) {
        return readJSON<WorkflowTask>("workflows.json").filter((w) => w.engagementId === engagementId);
      }
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("workflows")
        .select("*")
        .eq("engagement_id", engagementId)
        .order("due_date", { ascending: true });
      if (error) throw error;
      return (data ?? []).map(mapWorkflowRow);
    },

    update: async (id: string, updates: Partial<WorkflowTask>): Promise<WorkflowTask | null> => {
      if (!isSupabaseConfigured()) {
        const all = readJSON<WorkflowTask>("workflows.json");
        const idx = all.findIndex((w) => w.id === id);
        if (idx === -1) return null;
        all[idx] = { ...all[idx], ...updates };
        writeJSON("workflows.json", all);
        return all[idx];
      }

      const supabase = getSupabaseAdmin();
      const payload: Record<string, any> = {};
      if (updates.engagementId !== undefined) payload.engagement_id = updates.engagementId;
      if (updates.clientId !== undefined) payload.client_id = updates.clientId;
      if (updates.phase !== undefined) payload.phase = updates.phase;
      if (updates.taskName !== undefined) payload.task_name = updates.taskName;
      if (updates.completed !== undefined) payload.completed = updates.completed;
      if (updates.dueDate !== undefined) payload.due_date = updates.dueDate;
      if (updates.completedDate !== undefined) payload.completed_date = updates.completedDate;
      if (updates.assignee !== undefined) payload.assignee = updates.assignee;

      const { data, error } = await supabase.from("workflows").update(payload).eq("id", id).select("*").maybeSingle();
      if (error) throw error;
      return data ? mapWorkflowRow(data) : null;
    },

    create: async (task: WorkflowTask): Promise<WorkflowTask> => {
      if (!isSupabaseConfigured()) {
        const all = readJSON<WorkflowTask>("workflows.json");
        all.push(task);
        writeJSON("workflows.json", all);
        return task;
      }

      const supabase = getSupabaseAdmin();
      const payload = {
        id: task.id,
        engagement_id: task.engagementId,
        client_id: task.clientId,
        phase: task.phase,
        task_name: task.taskName,
        completed: task.completed,
        due_date: task.dueDate,
        completed_date: task.completedDate,
        assignee: task.assignee,
      };
      const { data, error } = await supabase.from("workflows").insert(payload).select("*").single();
      if (error) throw error;
      return mapWorkflowRow(data);
    },
  },

  aiOutputs: {
    getAll: async (): Promise<AIOutput[]> => {
      if (!isSupabaseConfigured()) return readJSON<AIOutput>("ai-outputs.json");
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.from("ai_outputs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapAIOutputRow);
    },

    getByClientId: async (clientId: string): Promise<AIOutput[]> => {
      if (!isSupabaseConfigured()) {
        return readJSON<AIOutput>("ai-outputs.json").filter((a) => a.clientId === clientId);
      }
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from("ai_outputs")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapAIOutputRow);
    },

    create: async (output: AIOutput): Promise<AIOutput> => {
      if (!isSupabaseConfigured()) {
        const all = readJSON<AIOutput>("ai-outputs.json");
        all.push(output);
        writeJSON("ai-outputs.json", all);
        return output;
      }

      const supabase = getSupabaseAdmin();
      const payload = {
        id: output.id,
        client_id: output.clientId,
        type: output.type,
        title: output.title,
        status: output.status,
        content: output.content,
        agent_used: output.agentUsed,
        created_at: output.createdAt,
        completed_at: output.completedAt,
      };
      const { data, error } = await supabase.from("ai_outputs").insert(payload).select("*").single();
      if (error) throw error;
      return mapAIOutputRow(data);
    },

    update: async (id: string, updates: Partial<AIOutput>): Promise<AIOutput | null> => {
      if (!isSupabaseConfigured()) {
        const all = readJSON<AIOutput>("ai-outputs.json");
        const idx = all.findIndex((a) => a.id === id);
        if (idx === -1) return null;
        all[idx] = { ...all[idx], ...updates };
        writeJSON("ai-outputs.json", all);
        return all[idx];
      }

      const supabase = getSupabaseAdmin();
      const payload: Record<string, any> = {};
      if (updates.clientId !== undefined) payload.client_id = updates.clientId;
      if (updates.type !== undefined) payload.type = updates.type;
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.status !== undefined) payload.status = updates.status;
      if (updates.content !== undefined) payload.content = updates.content;
      if (updates.agentUsed !== undefined) payload.agent_used = updates.agentUsed;
      if (updates.createdAt !== undefined) payload.created_at = updates.createdAt;
      if (updates.completedAt !== undefined) payload.completed_at = updates.completedAt;

      const { data, error } = await supabase.from("ai_outputs").update(payload).eq("id", id).select("*").maybeSingle();
      if (error) throw error;
      return data ? mapAIOutputRow(data) : null;
    },
  },
};

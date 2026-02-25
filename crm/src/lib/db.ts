import fs from "fs";
import path from "path";
import type { Client, ServiceEngagement, WorkflowTask, AIOutput } from "./types";

const DATA_DIR = path.join(process.cwd(), "src", "data");

function readJSON<T>(filename: string): T[] {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

function writeJSON<T>(filename: string, data: T[]): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export const db = {
  clients: {
    getAll: (): Client[] => readJSON<Client>("clients.json"),
    getById: (id: string): Client | undefined => readJSON<Client>("clients.json").find((c) => c.id === id),
    create: (client: Client): Client => {
      const all = readJSON<Client>("clients.json");
      all.push(client);
      writeJSON("clients.json", all);
      return client;
    },
    update: (id: string, updates: Partial<Client>): Client | null => {
      const all = readJSON<Client>("clients.json");
      const idx = all.findIndex((c) => c.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...updates, updatedAt: new Date().toISOString() };
      writeJSON("clients.json", all);
      return all[idx];
    },
    delete: (id: string): boolean => {
      const all = readJSON<Client>("clients.json");
      const filtered = all.filter((c) => c.id !== id);
      if (filtered.length === all.length) return false;
      writeJSON("clients.json", filtered);
      return true;
    },
  },

  services: {
    getAll: (): ServiceEngagement[] => readJSON<ServiceEngagement>("services.json"),
    getByClientId: (clientId: string): ServiceEngagement[] =>
      readJSON<ServiceEngagement>("services.json").filter((s) => s.clientId === clientId),
    create: (service: ServiceEngagement): ServiceEngagement => {
      const all = readJSON<ServiceEngagement>("services.json");
      all.push(service);
      writeJSON("services.json", all);
      return service;
    },
    update: (id: string, updates: Partial<ServiceEngagement>): ServiceEngagement | null => {
      const all = readJSON<ServiceEngagement>("services.json");
      const idx = all.findIndex((s) => s.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...updates };
      writeJSON("services.json", all);
      return all[idx];
    },
    delete: (id: string): boolean => {
      const all = readJSON<ServiceEngagement>("services.json");
      const filtered = all.filter((s) => s.id !== id);
      if (filtered.length === all.length) return false;
      writeJSON("services.json", filtered);
      return true;
    },
  },

  workflows: {
    getAll: (): WorkflowTask[] => readJSON<WorkflowTask>("workflows.json"),
    getByEngagementId: (engagementId: string): WorkflowTask[] =>
      readJSON<WorkflowTask>("workflows.json").filter((w) => w.engagementId === engagementId),
    update: (id: string, updates: Partial<WorkflowTask>): WorkflowTask | null => {
      const all = readJSON<WorkflowTask>("workflows.json");
      const idx = all.findIndex((w) => w.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...updates };
      writeJSON("workflows.json", all);
      return all[idx];
    },
    create: (task: WorkflowTask): WorkflowTask => {
      const all = readJSON<WorkflowTask>("workflows.json");
      all.push(task);
      writeJSON("workflows.json", all);
      return task;
    },
  },

  aiOutputs: {
    getAll: (): AIOutput[] => readJSON<AIOutput>("ai-outputs.json"),
    getByClientId: (clientId: string): AIOutput[] =>
      readJSON<AIOutput>("ai-outputs.json").filter((a) => a.clientId === clientId),
    create: (output: AIOutput): AIOutput => {
      const all = readJSON<AIOutput>("ai-outputs.json");
      all.push(output);
      writeJSON("ai-outputs.json", all);
      return output;
    },
    update: (id: string, updates: Partial<AIOutput>): AIOutput | null => {
      const all = readJSON<AIOutput>("ai-outputs.json");
      const idx = all.findIndex((a) => a.id === id);
      if (idx === -1) return null;
      all[idx] = { ...all[idx], ...updates };
      writeJSON("ai-outputs.json", all);
      return all[idx];
    },
  },
};

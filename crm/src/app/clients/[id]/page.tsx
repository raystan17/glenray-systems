"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import type { Client, ServiceEngagement, AIOutput, WorkflowTask, ClientStatus, Vertical } from "@/lib/types";
import { CLIENT_STATUSES, VERTICALS, WORKFLOW_PHASES } from "@/lib/types";

export default function ClientDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [services, setServices] = useState<ServiceEngagement[]>([]);
  const [aiOutputs, setAiOutputs] = useState<AIOutput[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowTask[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Client>>({});
  const [activeTab, setActiveTab] = useState<"overview" | "services" | "ai" | "workflow">("overview");

  useEffect(() => {
    fetch(`/api/clients/${id}`).then((r) => r.json()).then((c) => { setClient(c); setForm(c); });
    fetch("/api/services").then((r) => r.json()).then((all: ServiceEngagement[]) => setServices(all.filter((s) => s.clientId === id)));
    fetch("/api/ai-outputs").then((r) => r.json()).then((all: AIOutput[]) => setAiOutputs(all.filter((a) => a.clientId === id)));
    fetch("/api/workflows").then((r) => r.json()).then((all: WorkflowTask[]) => setWorkflows(all.filter((w) => w.clientId === id)));
  }, [id]);

  async function handleSave() {
    const res = await fetch(`/api/clients/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    setClient(updated);
    setEditing(false);
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this client?")) return;
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    router.push("/clients");
  }

  if (!client) return <div className="flex items-center justify-center h-64 text-surface-400">Loading...</div>;

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "services", label: `Services (${services.length})` },
    { key: "ai", label: `AI Outputs (${aiOutputs.length})` },
    { key: "workflow", label: `Workflow (${workflows.length})` },
  ] as const;

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <button onClick={() => router.push("/clients")} className="text-sm text-surface-500 hover:text-surface-700 mb-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
            Back to Clients
          </button>
          <h1 className="text-2xl font-bold text-surface-900">{client.name}</h1>
          <p className="text-surface-500">{client.company} &middot; {VERTICALS[client.vertical]}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={client.status} label={CLIENT_STATUSES[client.status]} />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200 mb-6">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.key ? "border-brand-500 text-brand-600" : "border-transparent text-surface-500 hover:text-surface-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-surface-900">Client Information</h2>
            <div className="flex gap-2">
              {editing ? (
                <>
                  <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
                  <button onClick={handleSave} className="btn-primary">Save</button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditing(true)} className="btn-secondary">Edit</button>
                  <button onClick={handleDelete} className="btn-danger">Delete</button>
                </>
              )}
            </div>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Name</label>
                  <input className="input-field" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Company</label>
                  <input className="input-field" value={form.company || ""} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
                  <input className="input-field" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
                  <input className="input-field" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Vertical</label>
                  <select className="input-field" value={form.vertical} onChange={(e) => setForm({ ...form, vertical: e.target.value as Vertical })}>
                    {Object.entries(VERTICALS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Status</label>
                  <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ClientStatus })}>
                    {Object.entries(CLIENT_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Notes</label>
                <textarea className="input-field" rows={4} value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <InfoRow label="Email" value={client.email} />
              <InfoRow label="Phone" value={client.phone} />
              <InfoRow label="Vertical" value={VERTICALS[client.vertical]} />
              <InfoRow label="Status" value={CLIENT_STATUSES[client.status]} />
              <div className="col-span-2">
                <InfoRow label="Notes" value={client.notes || "No notes"} />
              </div>
              <InfoRow label="Created" value={new Date(client.createdAt).toLocaleDateString()} />
              <InfoRow label="Last Updated" value={new Date(client.updatedAt).toLocaleDateString()} />
            </div>
          )}
        </div>
      )}

      {/* Services Tab */}
      {activeTab === "services" && (
        <div className="space-y-4">
          {services.length === 0 ? (
            <div className="card text-center text-surface-400 py-12">No service engagements yet</div>
          ) : (
            services.map((svc) => (
              <div key={svc.id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-surface-900">{svc.serviceName}</h3>
                  <div className="flex gap-2">
                    <StatusBadge status={svc.tier} />
                    <StatusBadge status={svc.status} />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <InfoRow label="Price" value={`$${svc.price.toLocaleString()}`} />
                  <InfoRow label="Phase" value={svc.currentPhase} />
                  <InfoRow label="Start" value={svc.startDate || "TBD"} />
                  <InfoRow label="End" value={svc.estimatedEndDate || "TBD"} />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* AI Outputs Tab */}
      {activeTab === "ai" && (
        <div className="space-y-4">
          {aiOutputs.length === 0 ? (
            <div className="card text-center text-surface-400 py-12">No AI outputs yet</div>
          ) : (
            aiOutputs.map((output) => (
              <div key={output.id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-surface-900">{output.title}</h3>
                  <StatusBadge status={output.status} />
                </div>
                <p className="text-xs text-surface-500 mb-3">Agent: {output.agentUsed} &middot; {new Date(output.createdAt).toLocaleDateString()}</p>
                {output.content && (
                  <div className="bg-surface-50 rounded-xl p-4 text-sm text-surface-700 whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {output.content}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Workflow Tab */}
      {activeTab === "workflow" && (
        <div>
          {/* Phase Pipeline */}
          <div className="card mb-6">
            <h3 className="text-sm font-semibold text-surface-900 mb-4">Delivery Pipeline</h3>
            <div className="flex gap-1">
              {WORKFLOW_PHASES.map((phase) => {
                const phaseTasks = workflows.filter((w) => w.phase === phase.key);
                const done = phaseTasks.filter((w) => w.completed).length;
                const total = phaseTasks.length;
                const isActive = services.some((s) => s.currentPhase === phase.key);
                return (
                  <div key={phase.key} className={`flex-1 rounded-xl p-3 text-center border ${isActive ? "bg-brand-50 border-brand-200" : "bg-surface-50 border-surface-200"}`}>
                    <p className={`text-xs font-semibold ${isActive ? "text-brand-700" : "text-surface-500"}`}>{phase.label}</p>
                    {total > 0 && <p className="text-xs text-surface-400 mt-1">{done}/{total}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Task List */}
          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 bg-surface-50">
                  <th className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3 w-8"></th>
                  <th className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3">Task</th>
                  <th className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3">Phase</th>
                  <th className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3">Due</th>
                  <th className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3">Assignee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {workflows.map((task) => (
                  <tr key={task.id} className={task.completed ? "opacity-50" : ""}>
                    <td className="px-6 py-3">
                      <input type="checkbox" checked={task.completed} readOnly className="rounded border-surface-300 text-brand-600 focus:ring-brand-500" />
                    </td>
                    <td className="px-6 py-3 text-sm text-surface-900">{task.taskName}</td>
                    <td className="px-6 py-3"><StatusBadge status={task.phase} /></td>
                    <td className="px-6 py-3 text-sm text-surface-600">{task.dueDate}</td>
                    <td className="px-6 py-3 text-sm text-surface-600">{task.assignee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-surface-800 mt-0.5">{value}</p>
    </div>
  );
}

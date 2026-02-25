"use client";

import { useEffect, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import type { Client, AIOutput, AIOutputType } from "@/lib/types";
import Link from "next/link";

const OUTPUT_TYPES: Record<AIOutputType, string> = {
  research_brief: "Research Brief",
  proposal: "Proposal",
  monthly_report: "Monthly Report",
  status_update: "Status Update",
  case_study: "Case Study",
};

const AGENT_MAP: Record<AIOutputType, string> = {
  research_brief: "Research Agent",
  proposal: "Proposal Agent",
  monthly_report: "Reporting Agent",
  status_update: "Reporting Agent",
  case_study: "Proposal Agent",
};

export default function AIOutputsPage() {
  const [outputs, setOutputs] = useState<AIOutput[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [viewContent, setViewContent] = useState<AIOutput | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [form, setForm] = useState({ clientId: "", type: "research_brief" as AIOutputType, title: "" });

  useEffect(() => {
    fetch("/api/ai-outputs").then((r) => r.json()).then(setOutputs);
    fetch("/api/clients").then((r) => r.json()).then(setClients);
  }, []);

  function getClientName(clientId: string) {
    return clients.find((c) => c.id === clientId)?.company || "Unknown";
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const client = clients.find((c) => c.id === form.clientId);
    const title = form.title || `${OUTPUT_TYPES[form.type]}: ${client?.company || "Client"}`;

    const res = await fetch("/api/ai-outputs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: form.clientId,
        type: form.type,
        title,
        agentUsed: AGENT_MAP[form.type],
      }),
    });
    const newOutput = await res.json();
    setOutputs((prev) => [...prev, newOutput]);
    setShowModal(false);
    setForm({ clientId: "", type: "research_brief", title: "" });
  }

  async function handleSimulateComplete(output: AIOutput) {
    const res = await fetch(`/api/ai-outputs/${output.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "complete",
        content: `[AI-generated ${OUTPUT_TYPES[output.type]} content would appear here once connected to your AI agent system. See 06-Internal-Agents/ for agent specifications and system prompts.]`,
        completedAt: new Date().toISOString(),
      }),
    });
    const updated = await res.json();
    setOutputs((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  }

  const filtered = outputs.filter((o) => {
    const matchesType = filterType === "all" || o.type === filterType;
    const matchesStatus = filterStatus === "all" || o.status === filterStatus;
    return matchesType && matchesStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const pending = outputs.filter((o) => o.status === "pending" || o.status === "generating").length;
  const completed = outputs.filter((o) => o.status === "complete").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">AI Outputs</h1>
          <p className="text-surface-500 mt-1">{completed} completed &middot; {pending} pending</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
          Generate Output
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex gap-3">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="input-field max-w-[200px]">
            <option value="all">All Types</option>
            {Object.entries(OUTPUT_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field max-w-[180px]">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="generating">Generating</option>
            <option value="complete">Complete</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Output List */}
      <div className="space-y-4">
        {filtered.map((output) => (
          <div key={output.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-surface-900">{output.title}</h3>
                  <StatusBadge status={output.status} />
                </div>
                <div className="flex items-center gap-3 text-xs text-surface-500">
                  <Link href={`/clients/${output.clientId}`} className="text-brand-600 hover:text-brand-500">{getClientName(output.clientId)}</Link>
                  <span>&middot;</span>
                  <span>{OUTPUT_TYPES[output.type]}</span>
                  <span>&middot;</span>
                  <span>Agent: {output.agentUsed}</span>
                  <span>&middot;</span>
                  <span>{new Date(output.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                {output.status === "complete" && output.content && (
                  <button onClick={() => setViewContent(output)} className="btn-secondary text-xs">View</button>
                )}
                {(output.status === "pending" || output.status === "generating") && (
                  <button onClick={() => handleSimulateComplete(output)} className="btn-primary text-xs">Simulate Complete</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Integration Note */}
      <div className="mt-8 bg-brand-50 border border-brand-200 rounded-2xl p-6">
        <h3 className="font-semibold text-brand-900 mb-2">AI Agent Integration</h3>
        <p className="text-sm text-brand-700">
          This page connects to your internal AI agents (Research, Proposal, Reporting). 
          When you add your OpenAI API key to <code className="bg-brand-100 px-1.5 py-0.5 rounded">.env.local</code>, 
          the &quot;Generate Output&quot; button will trigger real agent workflows using the system prompts 
          defined in <code className="bg-brand-100 px-1.5 py-0.5 rounded">06-Internal-Agents/</code>.
        </p>
      </div>

      {/* View Content Modal */}
      <Modal open={!!viewContent} onClose={() => setViewContent(null)} title={viewContent?.title || ""}>
        <div className="bg-surface-50 rounded-xl p-4 text-sm text-surface-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
          {viewContent?.content}
        </div>
      </Modal>

      {/* Generate Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Generate AI Output">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Client</label>
            <select className="input-field" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} required>
              <option value="">Select client...</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.company} ({c.name})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Output Type</label>
            <select className="input-field" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AIOutputType })}>
              {Object.entries(OUTPUT_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Title (optional)</label>
            <input className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Auto-generated if blank" />
          </div>
          <div className="bg-surface-50 rounded-xl p-3 text-sm text-surface-600">
            <strong>Agent:</strong> {AGENT_MAP[form.type]}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Queue Generation</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

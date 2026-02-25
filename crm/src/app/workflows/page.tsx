"use client";

import { useEffect, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import type { Client, ServiceEngagement, WorkflowTask } from "@/lib/types";
import { WORKFLOW_PHASES } from "@/lib/types";
import Link from "next/link";

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowTask[]>([]);
  const [services, setServices] = useState<ServiceEngagement[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedEngagement, setSelectedEngagement] = useState<string>("all");

  useEffect(() => {
    fetch("/api/workflows").then((r) => r.json()).then(setWorkflows);
    fetch("/api/services").then((r) => r.json()).then(setServices);
    fetch("/api/clients").then((r) => r.json()).then(setClients);
  }, []);

  function getClientName(clientId: string) {
    return clients.find((c) => c.id === clientId)?.company || "Unknown";
  }

  function getServiceName(engagementId: string) {
    return services.find((s) => s.id === engagementId)?.serviceName || "Unknown";
  }

  async function toggleTask(task: WorkflowTask) {
    const updated = {
      ...task,
      completed: !task.completed,
      completedDate: !task.completed ? new Date().toISOString().split("T")[0] : null,
    };

    await fetch("/api/workflows", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    setWorkflows((prev) => prev.map((w) => (w.id === task.id ? { ...w, completed: updated.completed, completedDate: updated.completedDate } : w)));
  }

  const activeServices = services.filter((s) => s.status === "active" || s.status === "pending");
  const filteredTasks = selectedEngagement === "all" ? workflows : workflows.filter((w) => w.engagementId === selectedEngagement);

  const grouped = activeServices.map((svc) => {
    const tasks = filteredTasks.filter((w) => w.engagementId === svc.id);
    const done = tasks.filter((w) => w.completed).length;
    const total = tasks.length;
    return { service: svc, tasks, done, total, progress: total > 0 ? Math.round((done / total) * 100) : 0 };
  }).filter((g) => g.tasks.length > 0);

  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter((w) => w.completed).length;
  const overdueTasks = filteredTasks.filter((w) => !w.completed && new Date(w.dueDate) < new Date()).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Workflows</h1>
          <p className="text-surface-500 mt-1">Track delivery progress across all engagements</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{completedTasks}/{totalTasks}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">Progress</p>
          <p className="text-2xl font-bold text-brand-600 mt-1">{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</p>
        </div>
        <div className="card text-center">
          <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">Overdue</p>
          <p className={`text-2xl font-bold mt-1 ${overdueTasks > 0 ? "text-red-600" : "text-emerald-600"}`}>{overdueTasks}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="card mb-6">
        <select value={selectedEngagement} onChange={(e) => setSelectedEngagement(e.target.value)} className="input-field max-w-sm">
          <option value="all">All Active Engagements</option>
          {activeServices.map((s) => (
            <option key={s.id} value={s.id}>{s.serviceName} — {getClientName(s.clientId)}</option>
          ))}
        </select>
      </div>

      {/* Engagement Workflow Cards */}
      <div className="space-y-6">
        {grouped.map(({ service, tasks, done, total, progress }) => (
          <div key={service.id} className="card">
            {/* Engagement Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-surface-900">{service.serviceName}</h3>
                  <StatusBadge status={service.currentPhase} />
                </div>
                <Link href={`/clients/${service.clientId}`} className="text-sm text-brand-600 hover:text-brand-500">
                  {getClientName(service.clientId)}
                </Link>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-surface-900">{progress}%</p>
                <p className="text-xs text-surface-400">{done}/{total} tasks</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-surface-100 rounded-full h-2 mb-4">
              <div className="bg-brand-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>

            {/* Phase Pipeline */}
            <div className="flex gap-1 mb-4">
              {WORKFLOW_PHASES.map((phase) => {
                const phaseTasks = tasks.filter((t) => t.phase === phase.key);
                const phaseDone = phaseTasks.filter((t) => t.completed).length;
                const phaseTotal = phaseTasks.length;
                const isActive = service.currentPhase === phase.key;
                const isComplete = phaseDone === phaseTotal && phaseTotal > 0;
                return (
                  <div
                    key={phase.key}
                    className={`flex-1 rounded-lg p-2 text-center text-xs font-medium border transition ${
                      isComplete ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                      isActive ? "bg-brand-50 border-brand-200 text-brand-700" :
                      "bg-surface-50 border-surface-200 text-surface-400"
                    }`}
                  >
                    {phase.label}
                    {phaseTotal > 0 && <span className="block text-[10px] mt-0.5 opacity-75">{phaseDone}/{phaseTotal}</span>}
                  </div>
                );
              })}
            </div>

            {/* Task List */}
            <div className="space-y-1">
              {tasks.map((task) => {
                const isOverdue = !task.completed && new Date(task.dueDate) < new Date();
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
                      task.completed ? "opacity-50 hover:opacity-75" : "hover:bg-surface-50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition ${
                      task.completed ? "bg-emerald-500 border-emerald-500" : "border-surface-300"
                    }`}>
                      {task.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${task.completed ? "line-through text-surface-400" : "text-surface-800"}`}>{task.taskName}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={task.phase} />
                      <span className={`text-xs ${isOverdue ? "text-red-500 font-medium" : "text-surface-400"}`}>{task.dueDate}</span>
                      <span className="text-xs text-surface-400">{task.assignee}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

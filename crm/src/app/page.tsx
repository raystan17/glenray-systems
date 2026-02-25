import { db } from "@/lib/db";
import { CLIENT_STATUSES, VERTICALS, type ClientStatus, type Vertical } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const clients = db.clients.getAll();
  const services = db.services.getAll();
  const aiOutputs = db.aiOutputs.getAll();
  const workflows = db.workflows.getAll();

  const activeEngagements = services.filter((s) => s.status === "active");
  const totalRevenue = services.filter((s) => s.status === "active" || s.status === "completed").reduce((sum, s) => sum + s.price, 0);
  const pendingProposals = clients.filter((c) => c.status === "proposal").length;
  const pendingAI = aiOutputs.filter((a) => a.status === "pending" || a.status === "generating").length;

  const tasksDone = workflows.filter((w) => w.completed).length;
  const tasksTotal = workflows.length;

  const clientsByStatus = Object.keys(CLIENT_STATUSES).reduce((acc, status) => {
    acc[status as ClientStatus] = clients.filter((c) => c.status === status).length;
    return acc;
  }, {} as Record<ClientStatus, number>);

  const revenueByVertical = (Object.keys(VERTICALS) as Vertical[]).reduce((acc, v) => {
    const clientIds = clients.filter((c) => c.vertical === v).map((c) => c.id);
    acc[v] = services.filter((s) => clientIds.includes(s.clientId) && (s.status === "active" || s.status === "completed")).reduce((sum, s) => sum + s.price, 0);
    return acc;
  }, {} as Record<Vertical, number>);

  const recentClients = [...clients].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);
  const upcomingTasks = workflows.filter((w) => !w.completed).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
        <p className="text-surface-500 mt-1">Overview of your GlenRay Systems operations</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Clients" value={clients.length} accent="brand" />
        <MetricCard label="Active Engagements" value={activeEngagements.length} accent="emerald" />
        <MetricCard label="Revenue (Active)" value={`$${totalRevenue.toLocaleString()}`} accent="amber" />
        <MetricCard label="Pending Proposals" value={pendingProposals} accent="purple" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="AI Tasks Pending" value={pendingAI} accent="blue" />
        <MetricCard label="AI Outputs Generated" value={aiOutputs.filter((a) => a.status === "complete").length} accent="teal" />
        <MetricCard label="Workflow Tasks" value={`${tasksDone}/${tasksTotal}`} accent="indigo" />
        <MetricCard label="Completion Rate" value={tasksTotal > 0 ? `${Math.round((tasksDone / tasksTotal) * 100)}%` : "0%"} accent="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pipeline */}
        <div className="card">
          <h2 className="text-sm font-semibold text-surface-900 mb-4">Client Pipeline</h2>
          <div className="space-y-3">
            {(Object.entries(clientsByStatus) as [ClientStatus, number][])
              .filter(([, count]) => count > 0)
              .map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={status} />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-surface-100 rounded-full h-2">
                      <div
                        className="bg-brand-500 h-2 rounded-full transition-all"
                        style={{ width: `${(count / clients.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-surface-600 w-6 text-right">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Revenue by Vertical */}
        <div className="card">
          <h2 className="text-sm font-semibold text-surface-900 mb-4">Revenue by Vertical</h2>
          <div className="space-y-4">
            {(Object.entries(revenueByVertical) as [Vertical, number][]).map(([v, rev]) => (
              <div key={v}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-surface-600">{VERTICALS[v]}</span>
                  <span className="font-medium text-surface-900">${rev.toLocaleString()}</span>
                </div>
                <div className="w-full bg-surface-100 rounded-full h-2.5">
                  <div
                    className="bg-brand-500 h-2.5 rounded-full transition-all"
                    style={{ width: totalRevenue > 0 ? `${(rev / totalRevenue) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-surface-900">Recent Clients</h2>
            <Link href="/clients" className="text-xs text-brand-600 hover:text-brand-500 font-medium">View all</Link>
          </div>
          <div className="space-y-3">
            {recentClients.map((client) => (
              <Link key={client.id} href={`/clients/${client.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition group">
                <div>
                  <p className="text-sm font-medium text-surface-900 group-hover:text-brand-600 transition">{client.name}</p>
                  <p className="text-xs text-surface-500">{client.company}</p>
                </div>
                <StatusBadge status={client.status} />
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-surface-900">Upcoming Tasks</h2>
            <Link href="/workflows" className="text-xs text-brand-600 hover:text-brand-500 font-medium">View all</Link>
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task) => {
              const client = clients.find((c) => c.id === task.clientId);
              return (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition">
                  <div>
                    <p className="text-sm font-medium text-surface-900">{task.taskName}</p>
                    <p className="text-xs text-surface-500">{client?.company || "Unknown"} &middot; Due {task.dueDate}</p>
                  </div>
                  <StatusBadge status={task.phase} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  const bgMap: Record<string, string> = {
    brand: "bg-brand-50 border-brand-100",
    emerald: "bg-emerald-50 border-emerald-100",
    amber: "bg-amber-50 border-amber-100",
    purple: "bg-purple-50 border-purple-100",
    blue: "bg-blue-50 border-blue-100",
    teal: "bg-teal-50 border-teal-100",
    indigo: "bg-indigo-50 border-indigo-100",
    green: "bg-green-50 border-green-100",
  };
  const textMap: Record<string, string> = {
    brand: "text-brand-700",
    emerald: "text-emerald-700",
    amber: "text-amber-700",
    purple: "text-purple-700",
    blue: "text-blue-700",
    teal: "text-teal-700",
    indigo: "text-indigo-700",
    green: "text-green-700",
  };

  return (
    <div className={`rounded-2xl border p-5 ${bgMap[accent] || bgMap.brand}`}>
      <p className="text-xs font-medium text-surface-500 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${textMap[accent] || textMap.brand}`}>{value}</p>
    </div>
  );
}

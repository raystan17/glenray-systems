"use client";

import { useEffect, useState } from "react";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import type { Client, ServiceEngagement, ServiceTier, Vertical } from "@/lib/types";
import { VERTICALS, SERVICE_CATALOG } from "@/lib/types";
import Link from "next/link";

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceEngagement[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [filterVertical, setFilterVertical] = useState<string>("all");
  const [form, setForm] = useState({ clientId: "", serviceSlug: "", tier: "starter" as ServiceTier, startDate: "" });

  useEffect(() => {
    fetch("/api/services").then((r) => r.json()).then(setServices);
    fetch("/api/clients").then((r) => r.json()).then(setClients);
  }, []);

  function getClientName(clientId: string) {
    const c = clients.find((cl) => cl.id === clientId);
    return c ? c.company : "Unknown";
  }

  function getClientVertical(clientId: string): Vertical | undefined {
    return clients.find((cl) => cl.id === clientId)?.vertical;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const catalogItem = SERVICE_CATALOG.find((s) => s.slug === form.serviceSlug);
    if (!catalogItem) return;

    const priceKey = form.tier as keyof Pick<typeof catalogItem, "starter" | "growth" | "premium">;
    const startDate = form.startDate;
    const weeks = form.tier === "starter" ? 3 : form.tier === "growth" ? 4 : 6;
    const end = new Date(startDate);
    end.setDate(end.getDate() + weeks * 7);

    const body = {
      clientId: form.clientId,
      serviceName: catalogItem.name,
      serviceSlug: catalogItem.slug,
      tier: form.tier,
      price: catalogItem[priceKey],
      startDate,
      estimatedEndDate: end.toISOString().split("T")[0],
    };

    const res = await fetch("/api/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const newSvc = await res.json();
    setServices((prev) => [...prev, newSvc]);
    setShowModal(false);
    setForm({ clientId: "", serviceSlug: "", tier: "starter", startDate: "" });
  }

  const filtered = filterVertical === "all"
    ? services
    : services.filter((s) => getClientVertical(s.clientId) === filterVertical);

  const totalRevenue = filtered.reduce((sum, s) => sum + s.price, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Services</h1>
          <p className="text-surface-500 mt-1">{services.length} engagements &middot; ${totalRevenue.toLocaleString()} total value</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Engagement
        </button>
      </div>

      <div className="card mb-6">
        <select value={filterVertical} onChange={(e) => setFilterVertical(e.target.value)} className="input-field max-w-[220px]">
          <option value="all">All Verticals</option>
          {Object.entries(VERTICALS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((svc) => (
          <div key={svc.id} className="card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-surface-900">{svc.serviceName}</h3>
                <Link href={`/clients/${svc.clientId}`} className="text-sm text-brand-600 hover:text-brand-500">{getClientName(svc.clientId)}</Link>
              </div>
              <StatusBadge status={svc.status} />
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm border-t border-surface-100 pt-3">
              <div>
                <p className="text-xs text-surface-400">Tier</p>
                <StatusBadge status={svc.tier} />
              </div>
              <div>
                <p className="text-xs text-surface-400">Price</p>
                <p className="font-semibold text-surface-900">${svc.price.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400">Phase</p>
                <StatusBadge status={svc.currentPhase} />
              </div>
            </div>
            {svc.startDate && (
              <p className="text-xs text-surface-400 mt-3">{svc.startDate} → {svc.estimatedEndDate}</p>
            )}
          </div>
        ))}
      </div>

      {/* Service Catalog Reference */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-surface-900 mb-4">Service Catalog</h2>
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50">
                <th className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3">Service</th>
                <th className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3">Vertical</th>
                <th className="text-right text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3">Starter</th>
                <th className="text-right text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3">Growth</th>
                <th className="text-right text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {SERVICE_CATALOG.map((s) => (
                <tr key={s.slug} className="hover:bg-surface-50">
                  <td className="px-6 py-3 text-sm font-medium text-surface-900">{s.name}</td>
                  <td className="px-6 py-3 text-sm text-surface-600">{VERTICALS[s.vertical]}</td>
                  <td className="px-6 py-3 text-sm text-surface-600 text-right">${s.starter.toLocaleString()}</td>
                  <td className="px-6 py-3 text-sm text-surface-600 text-right">${s.growth.toLocaleString()}</td>
                  <td className="px-6 py-3 text-sm text-surface-600 text-right">${s.premium.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Engagement Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Service Engagement">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Client</label>
            <select className="input-field" value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} required>
              <option value="">Select client...</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.company} ({c.name})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Service</label>
            <select className="input-field" value={form.serviceSlug} onChange={(e) => setForm({ ...form, serviceSlug: e.target.value })} required>
              <option value="">Select service...</option>
              {SERVICE_CATALOG.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Tier</label>
              <select className="input-field" value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value as ServiceTier })}>
                <option value="starter">Starter</option>
                <option value="growth">Growth</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Start Date</label>
              <input type="date" className="input-field" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            </div>
          </div>
          {form.serviceSlug && form.tier && (
            <div className="bg-surface-50 rounded-xl p-4">
              <p className="text-sm text-surface-600">
                Price: <span className="font-bold text-surface-900">
                  ${(SERVICE_CATALOG.find((s) => s.slug === form.serviceSlug)?.[form.tier as "starter" | "growth" | "premium"] || 0).toLocaleString()}
                </span>
              </p>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Engagement</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

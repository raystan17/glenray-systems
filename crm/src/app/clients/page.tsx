"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import type { Client, ClientStatus, Vertical } from "@/lib/types";
import { CLIENT_STATUSES, VERTICALS } from "@/lib/types";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterVertical, setFilterVertical] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "", company: "", email: "", phone: "",
    vertical: "professional_services" as Vertical,
    status: "lead" as ClientStatus,
    notes: "",
  });

  useEffect(() => {
    fetch("/api/clients").then((r) => r.json()).then(setClients);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const newClient = await res.json();
    setClients((prev) => [...prev, newClient]);
    setShowModal(false);
    setFormData({ name: "", company: "", email: "", phone: "", vertical: "professional_services", status: "lead", notes: "" });
  }

  const filtered = clients.filter((c) => {
    const matchesSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;
    const matchesVertical = filterVertical === "all" || c.vertical === filterVertical;
    return matchesSearch && matchesStatus && matchesVertical;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Clients</h1>
          <p className="text-surface-500 mt-1">{clients.length} total clients</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Client
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field max-w-xs"
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field max-w-[180px]">
            <option value="all">All Statuses</option>
            {Object.entries(CLIENT_STATUSES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select value={filterVertical} onChange={(e) => setFilterVertical(e.target.value)} className="input-field max-w-[220px]">
            <option value="all">All Verticals</option>
            {Object.entries(VERTICALS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Client Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-200 bg-surface-50">
              <th className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3">Client</th>
              <th className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3">Vertical</th>
              <th className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3">Contact</th>
              <th className="text-right text-xs font-medium text-surface-500 uppercase tracking-wider px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {filtered.map((client) => (
              <tr key={client.id} className="hover:bg-surface-50 transition">
                <td className="px-6 py-4">
                  <Link href={`/clients/${client.id}`} className="hover:text-brand-600 transition">
                    <p className="text-sm font-medium text-surface-900">{client.name}</p>
                    <p className="text-xs text-surface-500">{client.company}</p>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-surface-600">{VERTICALS[client.vertical]}</span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={client.status} label={CLIENT_STATUSES[client.status]} />
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-surface-600">{client.email}</p>
                  <p className="text-xs text-surface-400">{client.phone}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/clients/${client.id}`} className="text-sm text-brand-600 hover:text-brand-500 font-medium">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-surface-400 text-sm">No clients found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Client Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add New Client">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Name</label>
              <input className="input-field" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Company</label>
              <input className="input-field" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Email</label>
              <input type="email" className="input-field" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Phone</label>
              <input className="input-field" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Vertical</label>
              <select className="input-field" value={formData.vertical} onChange={(e) => setFormData({ ...formData, vertical: e.target.value as Vertical })}>
                {Object.entries(VERTICALS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">Status</label>
              <select className="input-field" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as ClientStatus })}>
                {Object.entries(CLIENT_STATUSES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">Notes</label>
            <textarea className="input-field" rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Client</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

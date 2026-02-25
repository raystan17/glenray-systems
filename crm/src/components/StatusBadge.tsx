const STYLES: Record<string, string> = {
  lead: "bg-surface-100 text-surface-600 border-surface-200",
  qualified: "bg-blue-50 text-blue-700 border-blue-200",
  discovery: "bg-purple-50 text-purple-700 border-purple-200",
  proposal: "bg-amber-50 text-amber-700 border-amber-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  churned: "bg-red-50 text-red-700 border-red-200",

  pending: "bg-amber-50 text-amber-700 border-amber-200",
  generating: "bg-blue-50 text-blue-700 border-blue-200",
  complete: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  cancelled: "bg-surface-100 text-surface-500 border-surface-200",

  starter: "bg-surface-100 text-surface-600 border-surface-200",
  growth: "bg-brand-50 text-brand-700 border-brand-200",
  premium: "bg-amber-50 text-amber-700 border-amber-200",

  onboard: "bg-blue-50 text-blue-700 border-blue-200",
  build: "bg-purple-50 text-purple-700 border-purple-200",
  test: "bg-amber-50 text-amber-700 border-amber-200",
  launch: "bg-emerald-50 text-emerald-700 border-emerald-200",
  support: "bg-teal-50 text-teal-700 border-teal-200",
  expand: "bg-green-50 text-green-700 border-green-200",
};

interface StatusBadgeProps {
  status: string;
  label?: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const style = STYLES[status] || STYLES.lead;
  const displayLabel = label || status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${style}`}>
      {displayLabel}
    </span>
  );
}

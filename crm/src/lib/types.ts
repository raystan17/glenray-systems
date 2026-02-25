export type ClientStatus = "lead" | "qualified" | "discovery" | "proposal" | "active" | "completed" | "churned";

export type ServiceTier = "starter" | "growth" | "premium";

export type WorkflowPhase = "onboard" | "build" | "test" | "launch" | "support" | "expand";

export type AIOutputType = "research_brief" | "proposal" | "monthly_report" | "status_update" | "case_study";

export type AIOutputStatus = "pending" | "generating" | "complete" | "failed";

export type Vertical = "professional_services" | "healthcare" | "home_services";

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  vertical: Vertical;
  status: ClientStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceEngagement {
  id: string;
  clientId: string;
  serviceName: string;
  serviceSlug: string;
  tier: ServiceTier;
  price: number;
  status: "pending" | "active" | "completed" | "cancelled";
  startDate: string;
  estimatedEndDate: string;
  currentPhase: WorkflowPhase;
  createdAt: string;
}

export interface WorkflowTask {
  id: string;
  engagementId: string;
  clientId: string;
  phase: WorkflowPhase;
  taskName: string;
  completed: boolean;
  dueDate: string;
  completedDate: string | null;
  assignee: string;
}

export interface AIOutput {
  id: string;
  clientId: string;
  type: AIOutputType;
  title: string;
  status: AIOutputStatus;
  content: string;
  agentUsed: string;
  createdAt: string;
  completedAt: string | null;
}

export interface DashboardMetrics {
  totalClients: number;
  activeEngagements: number;
  revenue: number;
  pendingProposals: number;
  aiOutputsGenerated: number;
  avgDeliveryDays: number;
  clientsByStatus: Record<ClientStatus, number>;
  revenueByVertical: Record<Vertical, number>;
}

export const VERTICALS: Record<Vertical, string> = {
  professional_services: "Professional Services",
  healthcare: "Healthcare & Wellness",
  home_services: "Home Services & Trades",
};

export const CLIENT_STATUSES: Record<ClientStatus, string> = {
  lead: "Lead",
  qualified: "Qualified",
  discovery: "Discovery",
  proposal: "Proposal Sent",
  active: "Active Client",
  completed: "Completed",
  churned: "Churned",
};

export const WORKFLOW_PHASES: { key: WorkflowPhase; label: string }[] = [
  { key: "onboard", label: "Onboard" },
  { key: "build", label: "Build" },
  { key: "test", label: "Test" },
  { key: "launch", label: "Launch" },
  { key: "support", label: "Support" },
  { key: "expand", label: "Expand" },
];

export const SERVICE_CATALOG = [
  { slug: "smart-inbox-manager", name: "Smart Inbox Manager", vertical: "professional_services" as Vertical, starter: 3500, growth: 9000, premium: 22000 },
  { slug: "docbrief-ai", name: "DocBrief AI", vertical: "professional_services" as Vertical, starter: 4000, growth: 12000, premium: 28000 },
  { slug: "clientflow-intake", name: "ClientFlow Intake", vertical: "professional_services" as Vertical, starter: 2500, growth: 7500, premium: 18000 },
  { slug: "meetingmind", name: "MeetingMind", vertical: "professional_services" as Vertical, starter: 2500, growth: 8000, premium: 20000 },
  { slug: "brainbank", name: "BrainBank", vertical: "professional_services" as Vertical, starter: 5000, growth: 15000, premium: 35000 },
  { slug: "no-show-shield", name: "No-Show Shield", vertical: "healthcare" as Vertical, starter: 2500, growth: 7500, premium: 18000 },
  { slug: "patientready-intake", name: "PatientReady Intake", vertical: "healthcare" as Vertical, starter: 3000, growth: 8500, premium: 20000 },
  { slug: "careconnect-followup", name: "CareConnect Follow-Up", vertical: "healthcare" as Vertical, starter: 2500, growth: 8000, premium: 22000 },
  { slug: "repboost", name: "RepBoost", vertical: "healthcare" as Vertical, starter: 2000, growth: 6000, premium: 15000 },
  { slug: "frontdesk-ai", name: "FrontDesk AI", vertical: "healthcare" as Vertical, starter: 3000, growth: 9000, premium: 25000 },
  { slug: "leadrescue-ai", name: "LeadRescue AI", vertical: "home_services" as Vertical, starter: 3000, growth: 9500, premium: 25000 },
  { slug: "quotechaser", name: "QuoteChaser", vertical: "home_services" as Vertical, starter: 2500, growth: 7000, premium: 18000 },
  { slug: "smartdispatch", name: "SmartDispatch", vertical: "home_services" as Vertical, starter: 4000, growth: 12000, premium: 30000 },
  { slug: "reviewengine", name: "ReviewEngine", vertical: "home_services" as Vertical, starter: 2000, growth: 5500, premium: 14000 },
  { slug: "winback-campaigns", name: "WinBack Campaigns", vertical: "home_services" as Vertical, starter: 2500, growth: 7500, premium: 20000 },
];

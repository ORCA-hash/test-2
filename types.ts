
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  CLIENT_REVIEW = 'CLIENT_REVIEW',
  DONE = 'DONE',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export type Role = 'agency_admin' | 'agency_member' | 'client';

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  isClient: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: string;
  priority: Priority;
  dueDate: string;
  clientName: string;
  comments: Comment[];
}

export interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  status: 'Active' | 'Onboarding' | 'Paused' | 'Churned';
  img: string;
  spend: number;
  campaigns: number;
  lastContact: string;
  health: number;
  industry?: string;
  location?: string;
  onboardingProgress: number; // 0 to 100
}

export interface CampaignMetric {
  date: string;
  clicks: number;
  spend: number;
  impressions: number;
  conversions: number;
  revenue: number;
  platform: 'Google' | 'Facebook' | 'TikTok' | 'Email';
  notes?: string;
}

// --- NEW REPORTING TYPES ---

export interface AdCreative {
  id: string;
  thumbnailUrl: string;
  headline: string;
  platform: 'Facebook' | 'Google' | 'TikTok';
  type: 'Image' | 'Video';
  status: 'Active' | 'Testing' | 'Paused';
  leads: number;
  ctr: number;
  comments: number;
  previewUrl?: string;
}

export interface WeeklyReport {
  wins: string[];
  problems: string[];
  actions: string[];
  nextSteps: string[];
  loomVideoUrl?: string;
  lastUpdated: string;
}

export interface ReportData {
  totals: {
    spend: number;
    leads: number;
    cpl: number;
    ctr: number;
  };
  dailyData: {
    date: string;
    spend: number;
    conversions: number;
    clicks: number;
    impressions: number;
    cpl: number;
    ctr: number;
    notes?: string;
  }[];
  weeklyReport: WeeklyReport;
  ads: AdCreative[];
}

// ---------------------------

export interface GeneratedAdCopy {
  headline: string;
  primaryText: string;
  callToAction: string;
}

export interface GeneratedStrategy {
  targetAudience: string[];
  keywords: string[];
  suggestedPlatforms: string[];
}

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: string;
  dimension?: string;
  uploadDate: string;
  clientName: string;
  uploadedBy: string;
}

export interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
  type?: 'text' | 'voice' | 'file'; 
  fileUrl?: string;
}

export interface Conversation {
  id: string;
  clientName: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
  isOnline: boolean;
  sharedFiles: Asset[]; // Files shared in this chat
}

export interface UserProfile {
  id: string;
  agencyName: string; // If client, this is their company name
  userName: string;
  email: string;
  avatarUrl: string;
  role: Role;
  companyName?: string; // Specifically for client users to map data
  notifications?: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
}

export type InvoiceStatus = 'Paid' | 'Pending' | 'Overdue' | 'Draft';

export interface Invoice {
  id: string;
  clientName: string;
  items: { description: string; amount: number }[];
  totalAmount: number;
  status: InvoiceStatus;
  dateIssued: string;
  dueDate: string;
  taxRate?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  activeTasks: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  type: 'video' | 'form' | 'upload' | 'access' | 'legal' | 'payment';
}

export type ApprovalStatus = 'Pending' | 'Approved' | 'Changes Requested';

export interface ApprovalItem {
  id: string;
  title: string;
  type: 'Creative' | 'Copy' | 'Video';
  contentUrl?: string;
  contentText?: string;
  status: ApprovalStatus;
  version: number;
  dateSubmitted: string;
  feedback?: string;
}

export interface Resource {
  id: string;
  title: string;
  category: 'Training' | 'Script' | 'Guide' | 'FAQ';
  type: 'video' | 'pdf' | 'link';
  url: string;
  thumbnail?: string;
}

export type NavigationItem = 'dashboard' | 'tasks' | 'ads' | 'reports' | 'clients' | 'assets' | 'messages' | 'settings' | 'invoices' | 'calendar' | 'team' | 'onboarding' | 'approvals' | 'resources';

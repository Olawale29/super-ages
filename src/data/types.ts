import type { PhotoKey } from './images';

/** Image reference: a key from the photo library, or a data URL from a local upload. */
export type ImageRef = PhotoKey | string;

export type Category = 'Crops' | 'Livestock';
export type ProjectStatus = 'Planning' | 'Active' | 'Approaching harvest' | 'Harvested' | 'Completed' | 'On hold';
export type MilestoneState = 'completed' | 'in_progress' | 'upcoming' | 'attention';
export type UpdateCategory = 'Crop development' | 'Livestock' | 'Harvest' | 'Farm operations';

export interface Investor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  joined: string; // ISO date
  avatar?: string; // data URL
  status: 'Active' | 'Onboarding';
}

export interface Milestone {
  id: string;
  title: string;
  date: string; // ISO date (actual if confirmed, expected otherwise)
  state: MilestoneState;
  confirmed: boolean; // confirmed event vs expected milestone
  note: string;
  metric?: string; // e.g. "Grain moisture 24%"
}

export interface Project {
  id: string;
  name: string;
  code: string;
  category: Category;
  enterprise: string; // e.g. "Maize (grain)"
  status: ProjectStatus;
  site: string; // fictional site label
  area: string; // e.g. "42 ha" or "1,800 birds"
  cycle: string; // e.g. "Mar – Nov 2026"
  harvestWindow?: string;
  summary: string;
  cover: ImageRef;
  manager: string;
  milestones: Milestone[];
}

export interface Investment {
  id: string;
  investorId: string;
  projectId: string;
  amount: number; // NGN
  date: string;
  reference: string;
  status: 'Active' | 'Awaiting decision' | 'Completed';
}

export interface Comment { id: string; author: string; role: 'investor' | 'team'; text: string; at: string }

export interface FarmUpdate {
  id: string;
  title: string;
  projectId: string;
  category: UpdateCategory;
  date: string;
  excerpt: string;
  body: string[];
  cover: ImageRef;
  gallery: ImageRef[];
  video?: { title: string; duration: string };
  milestoneId?: string;
  milestoneDate?: string;
  author: string;
  authorRole: string;
  status: 'Published' | 'Draft';
  comments: Comment[];
  readMins: number;
}

export type DecisionOption = 'sell' | 'store' | 'discuss' | 'other';
export type DecisionStatus = 'awaiting_instruction' | 'submitted' | 'under_review' | 'acknowledged' | 'completed';

export interface HarvestDecision {
  id: string;
  investorId: string;
  projectId: string;
  requestedOn: string;
  respondBy: string;
  status: DecisionStatus;
  option?: DecisionOption;
  note?: string;
  submittedAt?: string;
  teamResponse?: string;
  respondedAt?: string;
  reference: string;
}

export interface Message { id: string; from: 'investor' | 'team'; author: string; text: string; at: string; attachment?: string }

export interface Conversation {
  id: string;
  investorId: string;
  subject: string;
  projectId?: string;
  teamMember: string;
  teamRole: string;
  messages: Message[];
  unreadInvestor: number;
  unreadTeam: number;
}

export type NotificationKind = 'update' | 'milestone' | 'decision' | 'message' | 'document';
export interface Notification { id: string; investorId: string; kind: NotificationKind; title: string; body: string; at: string; read: boolean; to: string }

export interface DocumentItem {
  id: string;
  investorId?: string; // undefined = shared with all project investors
  projectId?: string;
  title: string;
  type: 'Project sheet' | 'Farm report' | 'Harvest report' | 'Contribution record' | 'Agreement';
  format: 'PDF' | 'XLSX';
  size: string;
  date: string;
  summary: string;
}

export interface Activity { id: string; at: string; text: string; who: string; to?: string }

export interface Prefs { email: boolean; sms: boolean; updates: boolean; milestones: boolean; decisions: boolean; digest: 'Weekly' | 'Fortnightly' | 'Monthly' }

/**
 * Client-side demo store. Simulates the backend: every action updates local
 * state and is persisted to localStorage (when the browser allows it), so the
 * investor and admin views stay in sync during a presentation.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as seed from '../data/mock';
import type {
  Activity, Conversation, DecisionOption, DecisionStatus, DocumentItem, FarmUpdate, HarvestDecision,
  Investment, Investor, Notification, Prefs, Project,
} from '../data/types';
import { nowIso, uid } from '../lib/format';

export type Role = 'investor' | 'admin' | null;

export interface DemoState {
  version: number;
  role: Role;
  investorId: string;
  investors: Investor[];
  projects: Project[];
  investments: Investment[];
  updates: FarmUpdate[];
  decisions: HarvestDecision[];
  conversations: Conversation[];
  notifications: Notification[];
  documents: DocumentItem[];
  activity: Activity[];
  prefs: Prefs;
}

const STORAGE_KEY = 'super-ages-demo-v1';
const VERSION = 3;

const initialState = (): DemoState => JSON.parse(JSON.stringify({
  version: VERSION, role: null, investorId: seed.DEMO_INVESTOR_ID,
  investors: seed.investors, projects: seed.projects, investments: seed.investments, updates: seed.updates,
  decisions: seed.decisions, conversations: seed.conversations, notifications: seed.notifications,
  documents: seed.documents, activity: seed.activity, prefs: seed.defaultPrefs,
}));

const load = (): DemoState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      if (s?.version === VERSION) return s;
    }
  } catch { /* storage unavailable: run in memory */ }
  return initialState();
};

export interface Toast { id: string; title: string; body?: string; tone?: 'success' | 'info' | 'error' }

type Ctx = ReturnType<typeof useDemoActions>;
const StoreCtx = createContext<Ctx | null>(null);

function useDemoActions() {
  const [state, setState] = useState<DemoState>(load);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* quota or blocked: keep in memory */ }
  }, [state]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = uid('t');
    setToasts((x) => [...x, { id, tone: 'success', ...t }]);
    timers.current.push(window.setTimeout(() => setToasts((x) => x.filter((y) => y.id !== id)), 4200));
  }, []);
  const dismissToast = (id: string) => setToasts((x) => x.filter((y) => y.id !== id));

  const log = (s: DemoState, who: string, text: string, to?: string): Activity[] =>
    [{ id: uid('ac'), at: nowIso(), who, text, to }, ...s.activity].slice(0, 40);

  const investorName = (s: DemoState, id: string) => {
    const i = s.investors.find((x) => x.id === id);
    return i ? `${i.firstName} ${i.lastName}` : 'Investor';
  };

  const actions = {
    setRole: (role: Role) => setState((s) => ({ ...s, role })),
    reset: () => { setState({ ...initialState(), role: state.role }); toast({ title: 'Demo data reset', body: 'All sample records are back to their starting state.', tone: 'info' }); },

    submitDecision: (id: string, option: DecisionOption, note: string) => setState((s) => {
      const d = s.decisions.find((x) => x.id === id)!;
      const labels: Record<DecisionOption, string> = { sell: 'Sell', store: 'Store', discuss: 'Discuss', other: 'Other instruction' };
      return {
        ...s,
        decisions: s.decisions.map((x) => x.id === id ? { ...x, option, note, status: 'submitted' as DecisionStatus, submittedAt: nowIso(), teamResponse: undefined, respondedAt: undefined } : x),
        investments: s.investments.map((x) => x.investorId === d.investorId && x.projectId === d.projectId ? { ...x, status: 'Active' } : x),
        notifications: s.notifications.map((n) => n.kind === 'decision' && n.investorId === d.investorId ? { ...n, read: true } : n),
        activity: log(s, investorName(s, d.investorId), `recorded a harvest instruction (${labels[option]}) for ${s.projects.find((p) => p.id === d.projectId)?.name}`, '/admin/decisions'),
      };
    }),

    adminUpdateDecision: (id: string, status: DecisionStatus, response?: string) => setState((s) => {
      const d = s.decisions.find((x) => x.id === id)!;
      const project = s.projects.find((p) => p.id === d.projectId);
      const statusLabel = { awaiting_instruction: 'awaiting instruction', submitted: 'submitted', under_review: 'under review', acknowledged: 'acknowledged', completed: 'completed' }[status];
      return {
        ...s,
        decisions: s.decisions.map((x) => x.id === id ? { ...x, status, teamResponse: response?.trim() ? response.trim() : x.teamResponse, respondedAt: response?.trim() ? nowIso() : x.respondedAt } : x),
        notifications: [{ id: uid('nt'), investorId: d.investorId, kind: 'decision' as const, title: `Harvest instruction ${statusLabel}`, body: response?.trim() || `Your instruction for ${project?.name} is now ${statusLabel}.`, at: nowIso(), read: false, to: '/portal/harvest' }, ...s.notifications],
        activity: log(s, 'Farm team', `marked ${investorName(s, d.investorId)}’s instruction as ${statusLabel}`, '/admin/decisions'),
      };
    }),

    addComment: (updateId: string, text: string, role: 'investor' | 'team') => setState((s) => {
      const inv = s.investors.find((i) => i.id === s.investorId)!;
      const author = role === 'investor' ? `${inv.firstName} ${inv.lastName[0]}.` : 'Super Ages farm team';
      return {
        ...s,
        updates: s.updates.map((u) => u.id === updateId ? { ...u, comments: [...u.comments, { id: uid('cm'), author, role, text, at: nowIso() }] } : u),
      };
    }),

    saveUpdate: (u: FarmUpdate) => setState((s) => {
      const exists = s.updates.some((x) => x.id === u.id);
      const wasPublished = s.updates.find((x) => x.id === u.id)?.status === 'Published';
      const publishingNow = u.status === 'Published' && !wasPublished;
      const projectInvestors = Array.from(new Set(s.investments.filter((i) => i.projectId === u.projectId).map((i) => i.investorId)));
      return {
        ...s,
        updates: exists ? s.updates.map((x) => x.id === u.id ? u : x) : [u, ...s.updates],
        notifications: publishingNow
          ? [...projectInvestors.map((investorId) => ({ id: uid('nt'), investorId, kind: 'update' as const, title: 'New farm update published', body: u.title, at: nowIso(), read: false, to: `/portal/updates/${u.id}` })), ...s.notifications]
          : s.notifications,
        activity: log(s, 'Farm team', publishingNow ? `published “${u.title}”` : `${exists ? 'edited' : 'saved a draft of'} “${u.title}”`, '/admin/publishing'),
      };
    }),
    deleteUpdate: (id: string) => setState((s) => ({ ...s, updates: s.updates.filter((u) => u.id !== id) })),

    sendMessage: (convId: string, from: 'investor' | 'team', text: string, attachment?: string) => setState((s) => {
      const c = s.conversations.find((x) => x.id === convId)!;
      const inv = s.investors.find((i) => i.id === c.investorId)!;
      const msg = { id: uid('ms'), from, author: from === 'investor' ? inv.firstName : c.teamMember, text, at: nowIso(), attachment };
      return {
        ...s,
        conversations: s.conversations.map((x) => x.id === convId ? {
          ...x, messages: [...x.messages, msg],
          unreadInvestor: from === 'team' ? x.unreadInvestor + 1 : 0,
          unreadTeam: from === 'investor' ? x.unreadTeam + 1 : 0,
        } : x),
        notifications: from === 'team'
          ? [{ id: uid('nt'), investorId: c.investorId, kind: 'message' as const, title: `New message from ${c.teamMember}`, body: text.slice(0, 90), at: nowIso(), read: false, to: `/portal/messages/${convId}` }, ...s.notifications]
          : s.notifications,
        activity: from === 'investor' ? log(s, `${inv.firstName} ${inv.lastName}`, `sent a message: “${c.subject}”`, `/admin/messages/${convId}`) : s.activity,
      };
    }),
    startConversation: (subject: string, projectId: string | undefined, text: string) => {
      const id = uid('cv');
      setState((s) => {
        const inv = s.investors.find((i) => i.id === s.investorId)!;
        const c: Conversation = {
          id, investorId: s.investorId, subject, projectId, teamMember: 'Tunde Bakare', teamRole: 'Investor Relations', unreadInvestor: 0, unreadTeam: 1,
          messages: [{ id: uid('ms'), from: 'investor', author: inv.firstName, text, at: nowIso() }],
        };
        return { ...s, conversations: [c, ...s.conversations], activity: log(s, `${inv.firstName} ${inv.lastName}`, `started a conversation: “${subject}”`, `/admin/messages/${id}`) };
      });
      return id;
    },
    markConversationRead: (convId: string, side: 'investor' | 'team') => setState((s) => {
      const c = s.conversations.find((x) => x.id === convId);
      if (!c || (side === 'investor' ? c.unreadInvestor === 0 : c.unreadTeam === 0)) return s;
      return {
        ...s,
        conversations: s.conversations.map((x) => x.id === convId ? (side === 'investor' ? { ...x, unreadInvestor: 0 } : { ...x, unreadTeam: 0 }) : x),
        notifications: side === 'investor' ? s.notifications.map((n) => n.to === `/portal/messages/${convId}` ? { ...n, read: true } : n) : s.notifications,
      };
    }),

    markNotification: (id: string, read = true) => setState((s) => ({ ...s, notifications: s.notifications.map((n) => n.id === id ? { ...n, read } : n) })),
    markAllNotifications: () => setState((s) => ({ ...s, notifications: s.notifications.map((n) => n.investorId === s.investorId ? { ...n, read: true } : n) })),

    updateInvestor: (id: string, patch: Partial<Investor>) => setState((s) => ({ ...s, investors: s.investors.map((i) => i.id === id ? { ...i, ...patch } : i) })),
    updatePrefs: (patch: Partial<Prefs>) => setState((s) => ({ ...s, prefs: { ...s.prefs, ...patch } })),

    saveProject: (p: Project) => setState((s) => {
      const exists = s.projects.some((x) => x.id === p.id);
      return { ...s, projects: exists ? s.projects.map((x) => x.id === p.id ? p : x) : [...s.projects, p], activity: log(s, 'Farm team', `${exists ? 'updated' : 'created'} project “${p.name}”`, `/admin/projects/${p.id}`) };
    }),
  };

  return { state, toasts, toast, dismissToast, ...actions };
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const value = useDemoActions();
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useDemo() {
  const v = useContext(StoreCtx);
  if (!v) throw new Error('useDemo outside provider');
  return v;
}

/** Convenience selectors */
export function useInvestorView() {
  const { state } = useDemo();
  return useMemo(() => {
    const investor = state.investors.find((i) => i.id === state.investorId)!;
    const myInvestments = state.investments.filter((i) => i.investorId === state.investorId);
    const myProjectIds = new Set(myInvestments.map((i) => i.projectId));
    const myProjects = state.projects.filter((p) => myProjectIds.has(p.id));
    const myUpdates = state.updates.filter((u) => u.status === 'Published' && myProjectIds.has(u.projectId)).sort((a, b) => b.date.localeCompare(a.date));
    const myDecisions = state.decisions.filter((d) => d.investorId === state.investorId);
    const myConversations = state.conversations.filter((c) => c.investorId === state.investorId);
    const myNotifications = state.notifications.filter((n) => n.investorId === state.investorId).sort((a, b) => b.at.localeCompare(a.at));
    const myDocuments = state.documents.filter((d) => (!d.investorId || d.investorId === state.investorId) && (!d.projectId || myProjectIds.has(d.projectId)));
    return { investor, myInvestments, myProjects, myUpdates, myDecisions, myConversations, myNotifications, myDocuments, projectById: (id: string) => state.projects.find((p) => p.id === id) };
  }, [state]);
}

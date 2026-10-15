import { DEMO_TODAY } from '../data/mock';

export const today = () => new Date(DEMO_TODAY);

export const naira = (n: number, compact = false) => {
  if (compact) {
    if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m`;
    if (n >= 1_000) return `₦${Math.round(n / 1000)}k`;
  }
  return `₦${n.toLocaleString('en-NG')}`;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const parse = (iso: string) => new Date(iso.length <= 10 ? iso + 'T12:00:00' : iso);

export const fmtDate = (iso: string, long = false) => {
  const d = parse(iso);
  return `${d.getDate()} ${(long ? MONTHS_LONG : MONTHS)[d.getMonth()]} ${d.getFullYear()}`;
};
export const fmtShort = (iso: string) => { const d = parse(iso); return `${d.getDate()} ${MONTHS[d.getMonth()]}`; };
export const fmtTime = (iso: string) => { const d = parse(iso); return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); };

export const relative = (iso: string) => {
  const d = parse(iso).getTime();
  const now = parse(nowIso()).getTime();
  const diff = Math.max(0, Math.round((now - d) / 60000));
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff} min ago`;
  const h = Math.round(diff / 60);
  if (h < 24) return `${h} h ago`;
  const days = Math.round(h / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return fmtShort(iso);
};

export const daysUntil = (iso: string) => Math.ceil((parse(iso).getTime() - today().getTime()) / 86_400_000);

/** Timestamp for new records created during the demo: the demo date plus the real time of day. */
export const nowIso = () => {
  const real = new Date();
  const d = today();
  d.setHours(real.getHours(), real.getMinutes(), real.getSeconds());
  if (d.getTime() < today().getTime()) d.setTime(today().getTime() + 60_000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}`;

export const cx = (...a: (string | number | false | null | undefined)[]) => a.filter(Boolean).join(' ');

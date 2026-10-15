import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CalendarClock, Camera, CheckCheck, FileText, KeyRound, LogOut, MessageSquare, Newspaper, Smartphone, Wheat } from 'lucide-react';
import { useDemo, useInvestorView } from '../../store/DemoStore';
import { Empty, Field, Input, PageTitle, Select, Tabs, Toggle, Badge } from '../../components/ui/Bits';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Overlay';
import { Avatar } from '../../components/portal/Shell';
import type { NotificationKind } from '../../data/types';
import { cx, fmtDate, relative } from '../../lib/format';

const kindMeta: Record<NotificationKind, { icon: typeof Bell; label: string }> = {
  update: { icon: Newspaper, label: 'Farm update' },
  milestone: { icon: CalendarClock, label: 'Milestone' },
  decision: { icon: Wheat, label: 'Harvest decision' },
  message: { icon: MessageSquare, label: 'Message' },
  document: { icon: FileText, label: 'Document' },
};

/* ================= Notifications ================= */
export function Notifications() {
  const v = useInvestorView();
  const { markNotification, markAllNotifications } = useDemo();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const list = v.myNotifications.filter((n) => tab === 'all' || !n.read);
  const unread = v.myNotifications.filter((n) => !n.read).length;
  return (
    <div>
      <PageTitle eyebrow="Activity" title="Notifications" intro="Farm updates, milestones, harvest decisions, messages and documents."
        actions={<Button variant="secondary" size="sm" icon={<CheckCheck size={15} />} disabled={!unread} onClick={markAllNotifications}>Mark all as read</Button>} />
      <Tabs className="mb-4" value={tab} onChange={setTab} options={[{ value: 'all', label: 'All', count: v.myNotifications.length }, { value: 'unread', label: 'Unread', count: unread }]} />
      {list.length === 0 ? <Empty title="You're all caught up" body="New notifications will appear here." icon={<Bell size={18} />} /> : (
        <ul className="card divide-y divide-line overflow-hidden">
          {list.map((n) => {
            const M = kindMeta[n.kind];
            return (
              <li key={n.id} className={cx('group relative flex gap-4 px-4 py-4 transition sm:px-6', !n.read ? 'bg-white' : 'bg-canvas/60')}>
                {!n.read && <span className="absolute left-0 top-0 h-full w-[3px] bg-agri" aria-hidden />}
                <span className={cx('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded', n.kind === 'decision' ? 'bg-lime text-ink' : 'bg-mist text-ink')}><M.icon size={16} /></span>
                <button onClick={() => { markNotification(n.id, true); navigate(n.to); }} className="min-w-0 flex-1 text-left">
                  <div className="flex flex-wrap items-center gap-x-2">
                    <span className={cx('text-[14px] text-ink', !n.read ? 'font-extrabold' : 'font-semibold')}>{n.title}</span>
                    {!n.read && <span className="sr-only">Unread</span>}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[13px] text-body">{n.body}</p>
                  <div className="mt-1.5 text-[11.5px] text-sage">{M.label} · {relative(n.at)}</div>
                </button>
                <button onClick={() => markNotification(n.id, !n.read)} className="h-8 shrink-0 self-center rounded px-2.5 text-[12px] font-semibold text-sage hover:bg-mist hover:text-ink">
                  {n.read ? 'Mark unread' : 'Mark read'}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ================= Profile & settings ================= */
export function Profile() {
  const v = useInvestorView();
  const { state, updateInvestor, updatePrefs, toast, setRole } = useDemo();
  const navigate = useNavigate();
  const inv = v.investor;
  const [f, setF] = useState({ firstName: inv.firstName, lastName: inv.lastName, email: inv.email, phone: inv.phone, city: inv.city });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [pw, setPw] = useState(false);
  const [signOut, setSignOut] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dirty = (Object.keys(f) as (keyof typeof f)[]).some((k) => f[k] !== inv[k]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.firstName.trim()) er.firstName = 'Enter your first name.';
    if (!f.lastName.trim()) er.lastName = 'Enter your last name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) er.email = 'Enter a valid email address.';
    if (f.phone.replace(/\D/g, '').length < 7) er.phone = 'Enter a phone number with at least 7 digits.';
    setErrs(er); if (Object.keys(er).length) return;
    updateInvestor(inv.id, { ...f, firstName: f.firstName.trim(), lastName: f.lastName.trim() });
    toast({ title: 'Profile updated', body: 'Changes are saved in this browser for the demo.' });
  };
  const onAvatar = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast({ title: 'Choose an image file', body: 'JPG, PNG or WebP images work best.', tone: 'error' }); return; }
    const r = new FileReader();
    r.onload = () => {
      // downscale to keep browser storage small
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas'); const s = 160; c.width = s; c.height = s;
        const ctx = c.getContext('2d')!; const m = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, s, s);
        updateInvestor(inv.id, { avatar: c.toDataURL('image/jpeg', 0.85) });
        toast({ title: 'Profile photo updated' });
      };
      img.src = r.result as string;
    };
    r.readAsDataURL(file);
  };
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => { setF({ ...f, [k]: e.target.value }); setErrs({ ...errs, [k]: '' }); };

  return (
    <div>
      <PageTitle eyebrow="Account" title="Profile & Settings" intro="Manage your details, how we contact you and your sign-in security." />
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <form onSubmit={save} className="card p-6 sm:p-7" noValidate>
            <h2 className="text-[15px] font-bold text-ink">Investor details</h2>
            <div className="mt-5 flex items-center gap-5">
              <Avatar initials={`${inv.firstName[0]}${inv.lastName[0]}`} src={inv.avatar} size={72} />
              <div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { onAvatar(e.target.files?.[0]); e.target.value = ''; }} />
                <Button variant="secondary" size="sm" icon={<Camera size={14} />} onClick={() => fileRef.current?.click()}>Change photo</Button>
                {inv.avatar && <button type="button" onClick={() => updateInvestor(inv.id, { avatar: undefined })} className="ml-2 text-[12.5px] font-semibold text-sage hover:text-ink">Remove</button>}
                <p className="mt-1.5 text-[12px] text-sage">Stored in this browser only.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field id="pf-first" label="First name" error={errs.firstName}><Input id="pf-first" value={f.firstName} onChange={set('firstName')} invalid={!!errs.firstName} /></Field>
              <Field id="pf-last" label="Last name" error={errs.lastName}><Input id="pf-last" value={f.lastName} onChange={set('lastName')} invalid={!!errs.lastName} /></Field>
              <Field id="pf-email" label="Email" error={errs.email}><Input id="pf-email" type="email" value={f.email} onChange={set('email')} invalid={!!errs.email} /></Field>
              <Field id="pf-phone" label="Phone" error={errs.phone}><Input id="pf-phone" type="tel" value={f.phone} onChange={set('phone')} invalid={!!errs.phone} /></Field>
              <Field id="pf-city" label="City"><Input id="pf-city" value={f.city} onChange={set('city')} /></Field>
              <div><div className="field-label">Investor since</div><div className="flex h-[42px] items-center text-[14px] text-body tnum">{fmtDate(inv.joined, true)}</div></div>
            </div>
            <div className="mt-6 flex items-center justify-end gap-2 border-t border-line pt-5">
              {dirty && <Button variant="ghost" onClick={() => { setF({ firstName: inv.firstName, lastName: inv.lastName, email: inv.email, phone: inv.phone, city: inv.city }); setErrs({}); }}>Discard</Button>}
              <Button type="submit" disabled={!dirty}>Save changes</Button>
            </div>
          </form>

          <section className="card p-6 sm:p-7">
            <h2 className="text-[15px] font-bold text-ink">Notification preferences</h2>
            <p className="text-[13px] text-sage">Choose what you hear about and how.</p>
            <div className="mt-2 divide-y divide-line">
              <Toggle id="pr-updates" label="Farm updates" description="New field reports on your projects" checked={state.prefs.updates} onChange={(x) => updatePrefs({ updates: x })} />
              <Toggle id="pr-milestones" label="Milestones" description="Reminders before expected milestones and when they are confirmed" checked={state.prefs.milestones} onChange={(x) => updatePrefs({ milestones: x })} />
              <Toggle id="pr-decisions" label="Harvest decisions" description="Requests and status changes. Recommended." checked={state.prefs.decisions} onChange={(x) => updatePrefs({ decisions: x })} />
              <Toggle id="pr-email" label="Email" description={inv.email} checked={state.prefs.email} onChange={(x) => updatePrefs({ email: x })} />
              <Toggle id="pr-sms" label="SMS" description={inv.phone} checked={state.prefs.sms} onChange={(x) => updatePrefs({ sms: x })} />
              <div className="flex items-center justify-between gap-6 py-4">
                <div><label htmlFor="pr-digest" className="text-[14px] font-semibold text-ink">Summary digest</label><p className="text-[13px] text-sage">A round-up of activity across your portfolio</p></div>
                <Select id="pr-digest" value={state.prefs.digest} onChange={(e) => updatePrefs({ digest: e.target.value as any })} className="w-40"><option>Weekly</option><option>Fortnightly</option><option>Monthly</option></Select>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6 xl:col-span-4">
          <section className="card p-6">
            <h2 className="text-[15px] font-bold text-ink">Security</h2>
            <ul className="mt-4 divide-y divide-line">
              <li className="flex items-center justify-between gap-3 py-3.5"><div className="flex items-center gap-3"><KeyRound size={17} className="text-sage" /><div><div className="text-[13.5px] font-semibold text-ink">Password</div><div className="text-[12px] text-sage">Last changed 12 Aug 2026</div></div></div><Button variant="secondary" size="sm" onClick={() => setPw(true)}>Change</Button></li>
              <li className="flex items-center justify-between gap-3 py-3.5"><div className="flex items-center gap-3"><Smartphone size={17} className="text-sage" /><div><div className="text-[13.5px] font-semibold text-ink">Two-step verification</div><div className="text-[12px] text-sage">Authenticator app</div></div></div><Badge tone="green">On</Badge></li>
            </ul>
            <div className="mt-3 rounded bg-canvas p-3 text-[12px] text-sage">Interface preview. Real sign-in security is added with the backend.</div>
          </section>
          <section className="card p-6">
            <h2 className="text-[15px] font-bold text-ink">Active sessions</h2>
            <ul className="mt-3 space-y-3 text-[13px]">
              <li className="flex justify-between gap-3"><span className="text-ink">This browser</span><Badge tone="green">Current</Badge></li>
              <li className="flex justify-between gap-3"><span className="text-body">Mobile app · Lagos</span><span className="text-sage">2 days ago</span></li>
            </ul>
          </section>
          <Button variant="danger" className="w-full" icon={<LogOut size={15} />} onClick={() => setSignOut(true)}>Sign out</Button>
        </aside>
      </div>

      <Modal open={pw} onClose={() => setPw(false)} title="Change password" size="sm"
        footer={<><Button variant="secondary" onClick={() => setPw(false)}>Cancel</Button><Button onClick={() => { setPw(false); toast({ title: 'Password change simulated', body: 'No credentials are stored in this demo.', tone: 'info' }); }}>Update password</Button></>}>
        <p className="text-[13.5px] leading-relaxed text-body">In the finished portal you would confirm your current password and set a new one here. This demo does not ask for or store any passwords.</p>
      </Modal>
      <Modal open={signOut} onClose={() => setSignOut(false)} title="Sign out of the demo?" size="sm"
        footer={<><Button variant="secondary" onClick={() => setSignOut(false)}>Stay signed in</Button><Button variant="dark" onClick={() => { setRole(null); navigate('/portal'); }}>Sign out</Button></>}>
        <p className="text-[13.5px] leading-relaxed text-body">You will return to the demo entry screen. Your demo changes stay saved in this browser.</p>
      </Modal>
    </div>
  );
}

import { useEffect, useState, type ComponentType } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell, FileText, FolderKanban, Gauge, Inbox, LayoutDashboard, Leaf, LogOut, Menu, MessageSquare, Newspaper,
  PenSquare, RotateCcw, Settings, Sprout, Users, Wheat, X, ArrowLeftRight, Globe,
} from 'lucide-react';
import { Logo, LogoMark } from '../ui/Brand';
import { useDemo, useInvestorView, type Role } from '../../store/DemoStore';
import { cx } from '../../lib/format';
import { Modal } from '../ui/Overlay';
import { Button } from '../ui/Button';

type Item = { to: string; label: string; icon: ComponentType<{ size?: number; strokeWidth?: number }>; badge?: number; end?: boolean };

function useNav(role: Exclude<Role, null>) {
  const { state } = useDemo();
  const v = useInvestorView();
  if (role === 'investor') {
    const unreadMsgs = v.myConversations.reduce((a, c) => a + c.unreadInvestor, 0);
    const unreadNotes = v.myNotifications.filter((n) => !n.read).length;
    const pending = v.myDecisions.filter((d) => d.status === 'awaiting_instruction').length;
    return {
      main: [
        { to: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/portal/investments', label: 'My Investments', icon: Leaf },
        { to: '/portal/updates', label: 'Farm Updates', icon: Newspaper },
        { to: '/portal/milestones', label: 'Milestones', icon: Sprout },
        { to: '/portal/harvest', label: 'Harvest Decision', icon: Wheat, badge: pending },
      ] as Item[],
      secondary: [
        { to: '/portal/messages', label: 'Messages', icon: MessageSquare, badge: unreadMsgs },
        { to: '/portal/notifications', label: 'Notifications', icon: Bell, badge: unreadNotes },
        { to: '/portal/documents', label: 'Documents', icon: FileText },
        { to: '/portal/profile', label: 'Profile & Settings', icon: Settings },
      ] as Item[],
      mobile: ['/portal/dashboard', '/portal/investments', '/portal/harvest', '/portal/messages'],
    };
  }
  const newDecisions = state.decisions.filter((d) => d.status === 'submitted').length;
  const unreadTeam = state.conversations.reduce((a, c) => a + c.unreadTeam, 0);
  return {
    main: [
      { to: '/admin', label: 'Overview', icon: Gauge, end: true },
      { to: '/admin/investors', label: 'Investors', icon: Users },
      { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
      { to: '/admin/publishing', label: 'Farm Updates', icon: PenSquare },
      { to: '/admin/decisions', label: 'Harvest Decisions', icon: Wheat, badge: newDecisions },
      { to: '/admin/messages', label: 'Messages', icon: Inbox, badge: unreadTeam },
    ] as Item[],
    secondary: [] as Item[],
    mobile: ['/admin', '/admin/projects', '/admin/decisions', '/admin/messages'],
  };
}

function NavItem({ item, onClick }: { item: Item; onClick?: () => void }) {
  return (
    <NavLink to={item.to} end={item.end} onClick={onClick}
      className={({ isActive }) => cx('group relative flex h-10 items-center gap-3 rounded px-3 text-[13.5px] font-semibold transition-colors',
        isActive ? 'bg-ink text-canvas' : 'text-body hover:bg-mist hover:text-ink')}>
      {({ isActive }) => <>
        <item.icon size={17} strokeWidth={isActive ? 2.1 : 1.8} />
        <span className="flex-1 truncate">{item.label}</span>
        {!!item.badge && <span className={cx('min-w-[20px] rounded-full px-1.5 text-center text-[10.5px] font-bold leading-5 tnum', isActive ? 'bg-lime text-ink' : 'bg-agri text-white')}>{item.badge}</span>}
      </>}
    </NavLink>
  );
}

export function PortalShell({ role }: { role: Exclude<Role, null> }) {
  const { state, setRole, reset } = useDemo();
  const v = useInvestorView();
  const nav = useNav(role);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [drawer, setDrawer] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  useEffect(() => { setDrawer(false); window.scrollTo({ top: 0 }); }, [pathname]);
  useEffect(() => { if (state.role !== role) setRole(role); }, [role]); // eslint-disable-line

  const switchRole = () => { const next = role === 'investor' ? 'admin' : 'investor'; setRole(next); navigate(next === 'admin' ? '/admin' : '/portal/dashboard'); };
  const signOut = () => { setRole(null); navigate('/portal'); };
  const all = [...nav.main, ...nav.secondary];
  const user = role === 'investor' ? { name: `${v.investor.firstName} ${v.investor.lastName}`, sub: 'Investor', avatar: v.investor.avatar } : { name: 'Adaeze Nwosu', sub: 'Administrator', avatar: undefined };
  const initials = user.name.split(' ').map((x) => x[0]).join('').slice(0, 2);

  const sidebar = (onNav?: () => void) => (
    <div className="flex h-full flex-col">
      <div className="flex h-[72px] items-center justify-between px-5">
        <Link to={role === 'investor' ? '/portal/dashboard' : '/admin'} aria-label="Portal home"><Logo height={38} /></Link>
      </div>
      <div className="px-5 pb-3">
        <span className={cx('inline-flex items-center gap-1.5 rounded-[4px] px-2 py-1 text-[10.5px] font-bold uppercase tracking-label', role === 'admin' ? 'bg-ink text-lime' : 'bg-pale text-ink ring-1 ring-inset ring-[#C0D20D]/50')}>
          {role === 'admin' ? 'Administrator' : 'Investor portal'}
        </span>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2" aria-label="Portal">
        {nav.main.map((i) => <NavItem key={i.to} item={i} onClick={onNav} />)}
        {nav.secondary.length > 0 && <div className="my-4 border-t border-line" />}
        {nav.secondary.map((i) => <NavItem key={i.to} item={i} onClick={onNav} />)}
      </nav>
      <div className="space-y-2 border-t border-line p-3">
        <div className="rounded-md border border-dashed border-line bg-canvas p-3">
          <div className="text-[10.5px] font-bold uppercase tracking-label text-sage">Demo controls</div>
          <button onClick={switchRole} className="mt-2 flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[12.5px] font-semibold text-ink hover:bg-white">
            <ArrowLeftRight size={14} /> Switch to {role === 'investor' ? 'administrator' : 'investor'} view
          </button>
          <button onClick={() => setConfirmReset(true)} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[12.5px] font-semibold text-body hover:bg-white"><RotateCcw size={14} /> Reset demo data</button>
          <Link to="/" className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-[12.5px] font-semibold text-body hover:bg-white"><Globe size={14} /> Public website</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[256px] border-r border-line bg-white lg:block" style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingLeft: 'env(safe-area-inset-left, 0px)' }}>
        {sidebar()}
      </aside>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Portal menu">
          <div className="absolute inset-0 animate-fade bg-ink/50" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-[86%] max-w-[300px] animate-slideup bg-white" style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)', paddingLeft: 'env(safe-area-inset-left, 0px)' }}>
            <button onClick={() => setDrawer(false)} aria-label="Close menu" className="absolute right-3 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded hover:bg-mist" style={{ marginTop: 'env(safe-area-inset-top, 0px)' }}><X size={19} /></button>
            {sidebar(() => setDrawer(false))}
          </div>
        </div>
      )}

      <div className="lg:pl-[256px]">
        {/* Top bar */}
        <header className="sticky z-30 border-b border-line bg-canvas/95 backdrop-blur-sm" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
          <div className="flex h-[64px] items-center gap-3 gutter">
            <button onClick={() => setDrawer(true)} aria-label="Open menu" className="-ml-2 inline-flex h-10 w-10 items-center justify-center rounded hover:bg-mist lg:hidden"><Menu size={20} /></button>
            <Link to={role === 'investor' ? '/portal/dashboard' : '/admin'} className="lg:hidden" aria-label="Portal home"><LogoMark size={26} /></Link>
            <div className="hidden min-w-0 flex-1 items-center gap-2 text-[12px] text-sage sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" /> Demonstration environment · simulated data, nothing is sent or transacted
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <button onClick={switchRole} className="hidden h-9 items-center gap-2 rounded border border-line bg-white px-3 text-[12.5px] font-semibold text-ink hover:border-ink/30 md:inline-flex">
                <ArrowLeftRight size={14} /> {role === 'investor' ? 'Admin view' : 'Investor view'}
              </button>
              {role === 'investor' && (
                <Link to="/portal/notifications" aria-label="Notifications" className="relative inline-flex h-10 w-10 items-center justify-center rounded hover:bg-mist">
                  <Bell size={19} />
                  {v.myNotifications.some((n) => !n.read) && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-agri ring-2 ring-canvas" />}
                </Link>
              )}
              <div className="relative">
                <ProfileMenu name={user.name} sub={user.sub} initials={initials} avatar={user.avatar} role={role} onSignOut={signOut} onSwitch={switchRole} />
              </div>
            </div>
          </div>
        </header>

        <main className="gutter pb-28 pt-8 sm:pt-10 lg:pb-16">
          <div className="mx-auto max-w-[1240px]"><Outlet /></div>
        </main>
      </div>

      {/* Mobile tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-sm lg:hidden" aria-label="Quick navigation"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', paddingLeft: 'env(safe-area-inset-left, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' }}>
        <div className="grid grid-cols-5">
          {nav.mobile.map((to) => {
            const it = all.find((i) => i.to === to)!;
            return (
              <NavLink key={to} to={to} end={it.end} className={({ isActive }) => cx('relative flex flex-col items-center gap-1 py-2.5 text-[10.5px] font-semibold', isActive ? 'text-ink' : 'text-sage')}>
                {({ isActive }) => <>
                  {isActive && <span className="absolute inset-x-5 top-0 h-[2px] bg-lime" />}
                  <it.icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span className="max-w-full truncate px-1">{it.label.replace('My ', '').replace(' Decision', '').replace('Harvest Decisions', 'Decisions')}</span>
                  {!!it.badge && <span className="absolute right-[22%] top-1.5 h-2 w-2 rounded-full bg-agri" />}
                </>}
              </NavLink>
            );
          })}
          <button onClick={() => setDrawer(true)} className="flex flex-col items-center gap-1 py-2.5 text-[10.5px] font-semibold text-sage"><Menu size={19} /><span>More</span></button>
        </div>
      </nav>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title="Reset demo data?" size="sm"
        footer={<><Button variant="secondary" onClick={() => setConfirmReset(false)}>Cancel</Button><Button variant="dark" onClick={() => { reset(); setConfirmReset(false); }}>Reset data</Button></>}>
        <p className="text-[14px] leading-relaxed text-body">This restores every sample record, message and decision to its starting state. Use it before presenting the demo again.</p>
      </Modal>
    </div>
  );
}

function ProfileMenu({ name, sub, initials, avatar, role, onSignOut, onSwitch }: { name: string; sub: string; initials: string; avatar?: string; role: string; onSignOut: () => void; onSwitch: () => void }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  return (
    <>
      <button onClick={() => setOpen(!open)} aria-expanded={open} aria-haspopup="menu" className="flex items-center gap-2.5 rounded py-1 pl-1 pr-2 hover:bg-mist">
        <Avatar initials={initials} src={avatar} size={32} dark={role === 'admin'} />
        <span className="hidden text-left leading-tight sm:block"><span className="block text-[12.5px] font-bold text-ink">{name}</span><span className="block text-[11px] text-sage">{sub}</span></span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div role="menu" className="absolute right-0 top-12 z-50 w-56 animate-fade overflow-hidden rounded-md border border-line bg-white py-1 shadow-[0_16px_40px_-16px_rgba(8,19,8,.3)]">
            {role === 'investor' && <Link role="menuitem" to="/portal/profile" className="flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-semibold text-ink hover:bg-mist"><Settings size={15} /> Profile & settings</Link>}
            <button role="menuitem" onClick={onSwitch} className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-semibold text-ink hover:bg-mist"><ArrowLeftRight size={15} /> Switch to {role === 'investor' ? 'admin' : 'investor'} view</button>
            <button role="menuitem" onClick={onSignOut} className="flex w-full items-center gap-2.5 border-t border-line px-3.5 py-2.5 text-[13px] font-semibold text-danger hover:bg-mist"><LogOut size={15} /> Sign out of demo</button>
          </div>
        </>
      )}
    </>
  );
}

export function Avatar({ initials, src, size = 36, dark = false }: { initials: string; src?: string; size?: number; dark?: boolean }) {
  return src
    ? <img src={src} alt="" className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
    : <span className={cx('flex shrink-0 items-center justify-center rounded-full font-bold', dark ? 'bg-ink text-lime' : 'bg-pale text-ink ring-1 ring-inset ring-[#C0D20D]/60')} style={{ width: size, height: size, fontSize: size * 0.36 }}>{initials}</span>;
}

/** Guards: send visitors to the demo entry screen if they haven't chosen a role. */
export function RequireRole({ role }: { role: Exclude<Role, null> }) {
  const { state } = useDemo();
  if (state.role === null) return <Navigate to="/portal" replace />;
  return <PortalShell role={role} />;
}

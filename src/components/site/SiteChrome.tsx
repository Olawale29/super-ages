import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';
import { Logo } from '../ui/Brand';
import { Photo } from '../ui/Photo';
import { btn } from '../ui/Button';
import { cx } from '../../lib/format';

export const siteLinks = [
  { to: '/', label: 'Home' },
  { to: '/farms', label: 'Our Farms' },
  { to: '/what-we-do', label: 'What We Do' },
  { to: '/investors', label: 'Investor Relations' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

/** Scrolls to top on navigation, or to an anchor passed in location.state. */
export function ScrollManager() {
  const { pathname, state } = useLocation() as { pathname: string; state: { anchor?: string } | null };
  useEffect(() => {
    if (state?.anchor) {
      const t = window.setTimeout(() => document.getElementById(state.anchor!)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0 });
  }, [pathname, state]);
  return null;
}

export function SiteNav({ overlay }: { overlay: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);

  const solid = !overlay || scrolled;
  return (
    <>
      <header className={cx('fixed inset-x-0 z-50 transition-[background-color,box-shadow,border-color] duration-500',
        solid ? 'border-b border-line bg-canvas/95 backdrop-blur-sm' : 'border-b border-transparent bg-transparent')}
        style={{ top: 0, paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="wrap flex h-[76px] items-center justify-between gap-6">
          <Link to="/" aria-label="Super Ages home" className="shrink-0">
            <Logo height={solid ? 40 : 44} plate={!solid} className="transition-all duration-500" />
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
            {siteLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'}
                className={({ isActive }) => cx('relative rounded px-3 py-2 text-[13.5px] font-semibold transition-colors',
                  solid ? (isActive ? 'text-ink' : 'text-body hover:text-ink') : (isActive ? 'text-white' : 'text-white/80 hover:text-white'))}>
                {({ isActive }) => <>{l.label}{isActive && <span className="absolute inset-x-3 -bottom-0.5 h-[2px] bg-lime" />}</>}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/portal" className={cx('hidden rounded px-3 py-2 text-[13.5px] font-semibold transition-colors md:inline-flex', solid ? 'text-ink hover:bg-mist' : 'text-white hover:bg-white/10')}>Investor Login</Link>
            <Link to="/investors" state={{ anchor: 'enquiry' }} className={btn('primary', 'md', 'hidden sm:inline-flex')}>Become an Investor</Link>
            <button onClick={() => setOpen(true)} aria-label="Open menu" className={cx('inline-flex h-10 w-10 items-center justify-center rounded xl:hidden', solid ? 'text-ink hover:bg-mist' : 'text-white hover:bg-white/10')}>
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] flex animate-fade flex-col bg-ink text-canvas xl:hidden" role="dialog" aria-modal="true" aria-label="Menu"
          style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="wrap flex h-[76px] items-center justify-between">
            <Logo plate height={40} />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="inline-flex h-10 w-10 items-center justify-center rounded hover:bg-white/10"><X size={22} /></button>
          </div>
          <nav className="wrap flex-1 overflow-y-auto pt-6" aria-label="Mobile">
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {siteLinks.map((l, i) => (
                <li key={l.to} className="animate-rise" style={{ animationDelay: `${i * 45}ms` }}>
                  <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => cx('flex items-center justify-between py-4 display text-[34px]', isActive ? 'text-lime' : 'text-canvas')}>
                    {l.label}<ArrowUpRight size={20} className="text-canvas/40" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="wrap grid grid-cols-2 gap-2 py-6">
            <Link to="/portal" className={btn('outlineLight', 'lg')}>Investor Login</Link>
            <Link to="/investors" state={{ anchor: 'enquiry' }} className={btn('primary', 'lg')}>Become an Investor</Link>
          </div>
        </div>
      )}
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-canvas">
      <div className="wrap pt-20 pb-10" style={{ paddingBottom: 'max(40px, env(safe-area-inset-bottom, 0px))' }}>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo plate height={56} />
            <p className="display mt-8 text-[30px] leading-[1.08] text-canvas">Growing agriculture.<br /><span className="text-mlime">Building lasting value.</span></p>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-label text-canvas/50">Company</div>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {siteLinks.slice(1).map((l) => <li key={l.to}><Link to={l.to} className="link-u text-canvas/85 hover:text-canvas">{l.label}</Link></li>)}
              <li><Link to="/journal" className="link-u text-canvas/85 hover:text-canvas">Farm Journal</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-label text-canvas/50">Investors</div>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              <li><Link to="/portal" className="link-u text-canvas/85 hover:text-canvas">Investor Login</Link></li>
              <li><Link to="/investors" className="link-u text-canvas/85 hover:text-canvas">How the portal works</Link></li>
              <li><Link to="/investors" state={{ anchor: 'enquiry' }} className="link-u text-canvas/85 hover:text-canvas">Make an enquiry</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-label text-canvas/50">Contact</div>
            <ul className="mt-4 space-y-2.5 text-[14px] text-canvas/85">
              <li>hello@superages.example</li>
              <li className="tnum">+234 000 000 0000</li>
              <li className="text-canvas/60">Office address to be confirmed</li>
            </ul>
            <Link to="/contact" className="mt-5 inline-flex items-center gap-2 text-[13.5px] font-semibold text-lime">Get in touch <ArrowRight size={15} /></Link>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 text-[12px] text-canvas/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Super Ages. Demonstration website: contact details are placeholders.</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/legal/privacy" className="hover:text-canvas">Privacy notice</Link>
            <Link to="/legal/terms" className="hover:text-canvas">Terms of use</Link>
            <Link to="/legal/risk" className="hover:text-canvas">Investment risk statement</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout() {
  const { pathname } = useLocation();
  const overlay = !pathname.startsWith('/journal/') && !pathname.startsWith('/legal');
  return (
    <div className="min-h-screen bg-canvas">
      <SiteNav overlay={overlay} />
      <main className={cx(!overlay && 'pt-[76px]')}><Outlet /></main>
      <SiteFooter />
    </div>
  );
}

/** Photographic page hero used across the inner public pages. */
export function PageHero({ photo, eyebrow, title, intro, position }: { photo: string; eyebrow: string; title: React.ReactNode; intro?: React.ReactNode; position?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-canvas">
      <PhotoBg photo={photo} position={position} />
      <div className="wrap relative pb-16 pt-44 sm:pb-20 sm:pt-56">
        <div className="eyebrow mb-5 flex items-center gap-3 !text-canvas/80"><span className="h-px w-8 bg-lime" />{eyebrow}</div>
        <h1 className="display max-w-[16ch] animate-rise text-[50px] text-white sm:text-[76px] lg:text-[92px]">{title}</h1>
        {intro && <p className="mt-6 max-w-[54ch] animate-rise text-[16.5px] leading-relaxed text-canvas/85 [animation-delay:120ms]">{intro}</p>}
      </div>
    </section>
  );
}

function PhotoBg({ photo, position }: { photo: string; position?: string }) {
  return (
    <div className="absolute inset-0 -z-10">
      <Photo src={photo} className="h-full w-full" position={position} eager kenburns />
      {/* legibility scrim: darker toward the text, photograph stays natural above */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,19,8,.55)_0%,rgba(8,19,8,.12)_30%,rgba(8,19,8,.25)_55%,rgba(8,19,8,.78)_100%)]" />
    </div>
  );
}
export { PhotoBg };

import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Info, ShieldCheck, Sprout } from 'lucide-react';
import { Logo } from '../components/ui/Brand';
import { Photo } from '../components/ui/Photo';
import { useDemo, useInvestorView } from '../store/DemoStore';

export default function DemoEntry() {
  const { setRole } = useDemo();
  const v = useInvestorView();
  const navigate = useNavigate();
  const enter = (r: 'investor' | 'admin') => { setRole(r); navigate(r === 'investor' ? '/portal/dashboard' : '/admin'); };
  return (
    <div className="grid min-h-screen bg-canvas lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <Photo src="aerial" className="absolute inset-0" eager kenburns />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,19,8,.15)_0%,rgba(8,19,8,.75)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-canvas">
          <div className="text-[11px] font-semibold uppercase tracking-label text-lime">Investor portal</div>
          <p className="display mt-4 max-w-[18ch] text-[52px] leading-[1.02] text-white">A clearer view of every milestone.</p>
        </div>
      </div>
      <div className="flex flex-col gutter py-8" style={{ paddingTop: 'max(32px, env(safe-area-inset-top, 0px))', paddingBottom: 'max(32px, env(safe-area-inset-bottom, 0px))' }}>
        <Link to="/" className="inline-flex items-center gap-2 self-start text-[13px] font-semibold text-sage hover:text-ink"><ArrowLeft size={15} /> Back to website</Link>
        <div className="mx-auto flex w-full max-w-[460px] flex-1 flex-col justify-center py-12">
          <Logo height={72} />
          <h1 className="display mt-10 text-[44px] leading-[1.02] text-ink sm:text-[52px]">Welcome to the Super Ages portal.</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-body">Choose how you would like to explore the demonstration. You can switch between views at any time.</p>

          <div className="mt-9 space-y-3">
            <button onClick={() => enter('investor')} className="group flex w-full items-center gap-4 rounded-md border border-agri bg-agri p-5 text-left text-white transition hover:bg-agri-dark">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-white/15"><Sprout size={21} /></span>
              <span className="min-w-0 flex-1"><span className="block text-[15.5px] font-bold">Enter investor demo</span><span className="block text-[13px] text-white/80">Signed in as {v.investor.firstName} {v.investor.lastName}, a fictional investor</span></span>
              <ArrowRight size={18} className="shrink-0 transition group-hover:translate-x-1" />
            </button>
            <button onClick={() => enter('admin')} className="group flex w-full items-center gap-4 rounded-md border border-line bg-white p-5 text-left transition hover:border-ink/30">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded bg-ink text-lime"><ShieldCheck size={21} /></span>
              <span className="min-w-0 flex-1"><span className="block text-[15.5px] font-bold text-ink">Enter administrator demo</span><span className="block text-[13px] text-sage">Publish updates, review harvest decisions, reply to investors</span></span>
              <ArrowRight size={18} className="shrink-0 text-ink transition group-hover:translate-x-1" />
            </button>
          </div>

          <div className="mt-8 flex gap-3 rounded-md bg-pale p-4 text-[12.5px] leading-relaxed text-body ring-1 ring-inset ring-[#C0D20D]/40">
            <Info size={16} className="mt-0.5 shrink-0 text-agri" />
            <p><strong className="text-ink">This is a demonstration.</strong> No account is needed and no real sign-in takes place. People, projects and figures are fictional, and actions are simulated in this browser.</p>
          </div>
        </div>
        <p className="text-center text-[11.5px] text-sage">© 2026 Super Ages · Demonstration build</p>
      </div>
    </div>
  );
}

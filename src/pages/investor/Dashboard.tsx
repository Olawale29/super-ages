import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, FileText, MessageSquare, Wheat } from 'lucide-react';
import { useInvestorView } from '../../store/DemoStore';
import { Allocation } from '../../components/ui/Allocation';
import { Badge, decisionMeta, milestoneMeta } from '../../components/ui/Bits';
import { ButtonLink } from '../../components/ui/Button';
import { DemoTag } from '../../components/ui/Brand';
import { Photo } from '../../components/ui/Photo';
import { cx, daysUntil, fmtDate, naira, relative, today } from '../../lib/format';

export function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

export function useUpcoming(limit = 5) {
  const v = useInvestorView();
  return v.myProjects
    .flatMap((p) => p.milestones.filter((m) => m.state !== 'completed').map((m) => ({ ...m, project: p })))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

export default function Dashboard() {
  const v = useInvestorView();
  const upcoming = useUpcoming(5);
  const total = v.myInvestments.reduce((a, b) => a + b.amount, 0);
  const allUpcoming = v.myProjects.flatMap((p) => p.milestones.filter((m) => m.state !== 'completed')).length;
  const decision = v.myDecisions.find((d) => d.status === 'awaiting_instruction') ?? v.myDecisions[0];
  const decisionProject = decision && v.projectById(decision.projectId);
  const unreadConv = v.myConversations.find((c) => c.unreadInvestor > 0);
  const latestReport = v.myUpdates[0];
  const d = today();
  const dateLabel = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="eyebrow">{dateLabel}</div>
          <h1 className="display mt-2 text-[42px] text-ink sm:text-[56px]">{greeting()}, {v.investor.firstName}.</h1>
          <p className="mt-2 text-[15px] text-body">Here is the latest progress across your agricultural investments.</p>
        </div>
        <DemoTag>Demo data · illustrative figures</DemoTag>
      </header>

      {/* Portfolio summary */}
      <section aria-label="Portfolio summary" className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-4">
        {[
          { l: 'Total contributed', v: naira(total), s: `Across ${v.myInvestments.length} investment records` },
          { l: 'Active investments', v: String(v.myInvestments.filter((i) => i.status !== 'Completed').length), s: `${v.myInvestments.filter((i) => i.status === 'Awaiting decision').length} awaiting your decision` },
          { l: 'Projects monitored', v: String(v.myProjects.length), s: `${v.myProjects.filter((p) => p.category === 'Crops').length} crop · ${v.myProjects.filter((p) => p.category === 'Livestock').length} livestock` },
          { l: 'Upcoming milestones', v: String(allUpcoming), s: upcoming[0] ? `Next: ${fmtDate(upcoming[0].date)}` : 'None scheduled' },
        ].map((x) => (
          <div key={x.l} className="min-w-0 bg-white p-5 sm:p-6">
            <div className="eyebrow">{x.l}</div>
            <div className="display mt-3 truncate text-[30px] leading-none text-ink tnum sm:text-[38px]">{x.v}</div>
            <div className="mt-2.5 text-[12.5px] text-sage">{x.s}</div>
          </div>
        ))}
      </section>

      {/* Harvest decision: signature callout */}
      {decision && decisionProject && (
        <section className="overflow-hidden rounded-md border border-[#C0D20D]/50 bg-pale">
          <div className="grid lg:grid-cols-[1fr_340px]">
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-label text-ink"><span className="h-2 w-2 rounded-full bg-lime ring-4 ring-lime/25" />Pending action</span>
                <Badge tone={decisionMeta[decision.status].tone}>{decisionMeta[decision.status].label}</Badge>
              </div>
              <h2 className="display mt-4 text-[32px] text-ink sm:text-[40px]">
                {decision.status === 'awaiting_instruction' ? 'Your crop is approaching harvest.' : 'Your harvest instruction is with the farm team.'}
              </h2>
              <p className="mt-2 max-w-[58ch] text-[14.5px] leading-relaxed text-body">
                {decisionProject.name} · expected harvest window {decisionProject.harvestWindow}.
                {decision.status === 'awaiting_instruction' ? ` Please record your instruction by ${fmtDate(decision.respondBy, true)} (${daysUntil(decision.respondBy)} days).` : ' You will be notified when the team confirms the next step.'}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink to="/portal/harvest" size="lg" icon={<ArrowRight size={17} />}>{decision.status === 'awaiting_instruction' ? 'Review harvest options' : 'View instruction'}</ButtonLink>
                <ButtonLink to={`/portal/investments/${v.myInvestments.find((i) => i.projectId === decision.projectId)?.id}`} size="lg" variant="secondary">Project details</ButtonLink>
              </div>
            </div>
            <Photo src="maizeCob" className="hidden min-h-[240px] lg:block" />
          </div>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-12">
        <section className="card p-6 sm:p-7 xl:col-span-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div><h2 className="text-[15px] font-bold text-ink">Portfolio allocation</h2><p className="text-[12.5px] text-sage">Share of total contributions by project</p></div>
            <Link to="/portal/investments" className="text-[12.5px] font-semibold text-agri hover:underline">All investments</Link>
          </div>
          <Allocation data={v.myInvestments.map((i) => { const p = v.projectById(i.projectId)!; return { label: p.name, sub: `${p.category} · ${p.enterprise}`, value: i.amount }; })} />
        </section>

        <section className="card p-6 sm:p-7 xl:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <div><h2 className="text-[15px] font-bold text-ink">Upcoming milestones</h2><p className="text-[12.5px] text-sage">Expected dates may move with field conditions</p></div>
            <Link to="/portal/milestones" className="text-[12.5px] font-semibold text-agri hover:underline">Timeline</Link>
          </div>
          <ul className="divide-y divide-line">
            {upcoming.map((m) => {
              const dt = new Date(m.date + 'T12:00:00');
              return (
                <li key={m.id} className="grid grid-cols-[48px_1fr] gap-4 py-3.5">
                  <div className={cx('flex h-12 w-12 flex-col items-center justify-center rounded', m.state === 'attention' ? 'bg-[#FBF1E4] text-attn' : m.state === 'in_progress' ? 'bg-pale text-ink ring-1 ring-inset ring-[#C0D20D]/60' : 'bg-mist text-ink')}>
                    <span className="text-[17px] font-bold leading-none tnum">{dt.getDate()}</span>
                    <span className="mt-0.5 text-[9.5px] font-bold uppercase tracking-wider">{dt.toLocaleDateString('en-GB', { month: 'short' })}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[13.5px] font-bold text-ink">{m.title}</div>
                    <div className="truncate text-[12px] text-sage">{m.project.name}</div>
                    <div className="mt-1.5 flex items-center gap-2"><Badge tone={milestoneMeta[m.state].tone}>{milestoneMeta[m.state].label}</Badge>{!m.confirmed && <span className="text-[10.5px] font-semibold uppercase tracking-label text-sage">Expected</span>}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <section className="xl:col-span-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-ink">Latest farm updates</h2>
            <Link to="/portal/updates" className="text-[12.5px] font-semibold text-agri hover:underline">View all updates</Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {v.myUpdates.slice(0, 3).map((u) => (
              <Link key={u.id} to={`/portal/updates/${u.id}`} className="group card overflow-hidden">
                <Photo src={u.cover} className="zoom-img aspect-[4/3]" />
                <div className="p-4">
                  <div className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-label"><span className="text-agri">{u.category}</span><span className="text-sage tnum">{fmtDate(u.date)}</span></div>
                  <h3 className="mt-1.5 line-clamp-2 text-[14px] font-bold leading-snug text-ink group-hover:text-agri">{u.title}</h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-ink">View details <ArrowUpRight size={13} /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="xl:col-span-4">
          <h2 className="mb-4 text-[15px] font-bold text-ink">Pending actions</h2>
          <ul className="card divide-y divide-line">
            {decision?.status === 'awaiting_instruction' && (
              <ActionRow to="/portal/harvest" icon={<Wheat size={16} />} tone="lime" title="Harvest decision requested" body={`${decisionProject?.name} · respond by ${fmtDate(decision.respondBy)}`} />
            )}
            {unreadConv && <ActionRow to={`/portal/messages/${unreadConv.id}`} icon={<MessageSquare size={16} />} title={`Unread message from ${unreadConv.teamMember}`} body={`${unreadConv.subject} · ${relative(unreadConv.messages[unreadConv.messages.length - 1].at)}`} />}
            {latestReport && <ActionRow to={`/portal/updates/${latestReport.id}`} icon={<FileText size={16} />} title="Recently published farm report" body={latestReport.title} />}
            {!decision && !unreadConv && !latestReport && <li className="p-5 text-[13.5px] text-sage">You are all caught up.</li>}
          </ul>
        </section>
      </div>
    </div>
  );
}

function ActionRow({ to, icon, title, body, tone }: { to: string; icon: React.ReactNode; title: string; body: string; tone?: 'lime' }) {
  return (
    <li>
      <Link to={to} className="group flex items-start gap-3.5 p-4 hover:bg-canvas">
        <span className={cx('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded', tone === 'lime' ? 'bg-lime text-ink' : 'bg-mist text-ink')}>{icon}</span>
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-bold text-ink">{title}</div>
          <div className="mt-0.5 line-clamp-2 text-[12.5px] text-sage">{body}</div>
        </div>
        <ArrowRight size={15} className="mt-1 shrink-0 text-sage transition group-hover:translate-x-0.5 group-hover:text-ink" />
      </Link>
    </li>
  );
}

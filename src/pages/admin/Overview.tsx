import { Link } from 'react-router-dom';
import { ArrowRight, FolderPlus, Inbox, PenSquare, Wheat } from 'lucide-react';
import { useDemo } from '../../store/DemoStore';
import { Badge, PageTitle, decisionAdminLabel, projectTone } from '../../components/ui/Bits';
import { DemoTag } from '../../components/ui/Brand';
import { Photo } from '../../components/ui/Photo';
import { cx, fmtDate, naira, relative } from '../../lib/format';
import { OPTIONS } from '../investor/Harvest';

export default function AdminOverview() {
  const { state } = useDemo();
  const pendingDecisions = state.decisions.filter((d) => d.status === 'submitted' || d.status === 'under_review' || d.status === 'awaiting_instruction');
  const unread = state.conversations.reduce((a, c) => a + c.unreadTeam, 0);
  const published = state.updates.filter((u) => u.status === 'Published').length;
  const drafts = state.updates.filter((u) => u.status === 'Draft').length;
  const total = state.investments.reduce((a, b) => a + b.amount, 0);

  const stats = [
    { l: 'Investors', v: state.investors.length, s: 'All active', to: '/admin/investors' },
    { l: 'Investment records', v: state.investments.filter((i) => i.status !== 'Completed').length, s: `${naira(total, true)} recorded`, to: '/admin/investors' },
    { l: 'Projects', v: state.projects.length, s: `${state.projects.filter((p) => p.status === 'Approaching harvest').length} approaching harvest`, to: '/admin/projects' },
    { l: 'Published updates', v: published, s: drafts ? `${drafts} draft${drafts > 1 ? 's' : ''}` : 'No drafts', to: '/admin/publishing' },
    { l: 'Harvest decisions open', v: pendingDecisions.length, s: `${state.decisions.filter((d) => d.status === 'submitted').length} new to review`, to: '/admin/decisions', hl: state.decisions.some((d) => d.status === 'submitted') },
    { l: 'Unread messages', v: unread, s: 'From investors', to: '/admin/messages', hl: unread > 0 },
  ];

  return (
    <div className="space-y-8">
      <PageTitle eyebrow="Administration" title="Farm operations overview" intro="Investor activity, projects and open items across the Super Ages portal." actions={<DemoTag>Mock data</DemoTag>} />

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-3 xl:grid-cols-6">
        {stats.map((s) => (
          <Link key={s.l} to={s.to} className={cx('group relative min-w-0 p-5 transition', s.hl ? 'bg-pale hover:bg-[#ebf8c9]' : 'bg-white hover:bg-canvas')}>
            {s.hl && <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-lime ring-4 ring-lime/25" />}
            <div className="eyebrow pr-4">{s.l}</div>
            <div className="display mt-3 text-[38px] leading-none text-ink tnum">{s.v}</div>
            <div className="mt-2 truncate text-[12px] text-sage">{s.s}</div>
          </Link>
        ))}
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { to: '/admin/publishing/new', icon: PenSquare, t: 'Publish a farm update' },
          { to: '/admin/decisions', icon: Wheat, t: 'Review harvest decisions' },
          { to: '/admin/projects', icon: FolderPlus, t: 'Manage projects' },
          { to: '/admin/messages', icon: Inbox, t: 'Reply to investors' },
        ].map((a) => (
          <Link key={a.to} to={a.to} className="group flex items-center gap-3 rounded-md border border-line bg-white p-4 transition hover:border-ink/30">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-ink text-lime"><a.icon size={16} /></span>
            <span className="min-w-0 flex-1 text-[13px] font-bold leading-snug text-ink">{a.t}</span>
            <ArrowRight size={15} className="hidden shrink-0 text-sage transition group-hover:translate-x-0.5 group-hover:text-ink sm:block" />
          </Link>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-12">
        <section className="card xl:col-span-7">
          <div className="flex items-center justify-between border-b border-line px-6 py-4"><h2 className="text-[15px] font-bold text-ink">Harvest decision queue</h2><Link to="/admin/decisions" className="text-[12.5px] font-semibold text-agri hover:underline">Open queue</Link></div>
          <ul className="divide-y divide-line">
            {state.decisions.map((d) => {
              const inv = state.investors.find((i) => i.id === d.investorId)!;
              const p = state.projects.find((x) => x.id === d.projectId)!;
              return (
                <li key={d.id}>
                  <Link to={`/admin/decisions?open=${d.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-canvas">
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-bold text-ink">{inv.firstName} {inv.lastName}</div>
                      <div className="truncate text-[12px] text-sage">{p.name} · {d.option ? OPTIONS.find((o) => o.id === d.option)?.short : 'No instruction yet'}</div>
                    </div>
                    <Badge tone={d.status === 'submitted' ? 'lime' : d.status === 'awaiting_instruction' ? 'neutral' : d.status === 'completed' ? 'ink' : 'green'}>{decisionAdminLabel[d.status]}</Badge>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="card xl:col-span-5">
          <div className="border-b border-line px-6 py-4"><h2 className="text-[15px] font-bold text-ink">Recent activity</h2></div>
          <ol className="max-h-[360px] divide-y divide-line overflow-y-auto">
            {state.activity.slice(0, 10).map((a) => (
              <li key={a.id}>
                <Link to={a.to ?? '/admin'} className="flex gap-3 px-6 py-3.5 hover:bg-canvas">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-agri" />
                  <div className="min-w-0 text-[13px] leading-snug"><span className="font-bold text-ink">{a.who}</span> <span className="text-body">{a.text}</span><div className="mt-0.5 text-[11.5px] text-sage">{relative(a.at)}</div></div>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between"><h2 className="text-[15px] font-bold text-ink">Projects</h2><Link to="/admin/projects" className="text-[12.5px] font-semibold text-agri hover:underline">All projects</Link></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {state.projects.map((p) => {
            const next = p.milestones.find((m) => m.state !== 'completed');
            const n = state.investments.filter((i) => i.projectId === p.id).length;
            return (
              <Link key={p.id} to={`/admin/projects/${p.id}`} className="card group overflow-hidden">
                <Photo src={p.cover} className="zoom-img aspect-[16/9]" />
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2"><span className="text-[11px] font-bold uppercase tracking-label text-sage">{p.code}</span><Badge tone={projectTone(p.status)}>{p.status}</Badge></div>
                  <div className="mt-2 truncate text-[14px] font-bold text-ink group-hover:text-agri">{p.name}</div>
                  <div className="mt-0.5 text-[12px] text-sage">{n} investor records · {p.area}</div>
                  {next && <div className="mt-3 border-t border-line pt-3 text-[12px] text-body">Next: <span className="font-semibold text-ink">{next.title}</span> · {fmtDate(next.date)}</div>}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

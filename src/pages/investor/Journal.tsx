import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useDemo, useInvestorView } from '../../store/DemoStore';
import { Empty, PageTitle, Select, Tabs, Badge } from '../../components/ui/Bits';
import { ButtonLink } from '../../components/ui/Button';
import { UpdateArticle, UpdateCard } from '../../components/ui/UpdateViews';
import { Timeline } from '../../components/ui/Timeline';
import { Photo } from '../../components/ui/Photo';
import type { MilestoneState, UpdateCategory } from '../../data/types';
import { cx, fmtDate } from '../../lib/format';

/* ================= Farm updates feed ================= */
export function Updates() {
  const v = useInvestorView();
  const [cat, setCat] = useState<'All' | UpdateCategory>('All');
  const [proj, setProj] = useState('All');
  const cats: ('All' | UpdateCategory)[] = ['All', 'Crop development', 'Livestock', 'Harvest', 'Farm operations'];
  const list = v.myUpdates.filter((u) => (cat === 'All' || u.category === cat) && (proj === 'All' || u.projectId === proj));
  // group chronologically by month
  const groups = list.reduce<Record<string, typeof list>>((acc, u) => {
    const k = new Date(u.date + 'T12:00:00').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    (acc[k] ||= []).push(u); return acc;
  }, {});
  const [lead, ...rest] = list;
  return (
    <div>
      <PageTitle eyebrow="Farm journal" title="Farm Updates" intro="Field reports from the farm team on the projects you support." />
      <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={cat} onChange={setCat} options={cats.map((c) => ({ value: c, label: c }))} />
        <Select id="upd-proj" aria-label="Project" value={proj} onChange={(e) => setProj(e.target.value)} className="lg:w-64">
          <option value="All">All my projects</option>
          {v.myProjects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </Select>
      </div>
      {!lead ? <Empty title="No updates match these filters" body="Try another category or project." /> : (
        <>
          <Link to={`/portal/updates/${lead.id}`} className="group mb-12 grid overflow-hidden rounded-md border border-line bg-white lg:grid-cols-12">
            <Photo src={lead.cover} className="zoom-img aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[380px]" />
            <div className="flex flex-col justify-center p-6 sm:p-9 lg:col-span-5">
              <div className="flex flex-wrap items-center gap-2"><Badge tone="lime">Latest</Badge><span className="text-[11px] font-bold uppercase tracking-label text-agri">{lead.category}</span></div>
              <h2 className="display mt-4 text-[32px] leading-[1.05] text-ink group-hover:text-agri sm:text-[40px]">{lead.title}</h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-body">{lead.excerpt}</p>
              <div className="mt-6 text-[12.5px] text-sage"><span className="font-semibold text-ink">{lead.author}</span> · {fmtDate(lead.date, true)} · {v.projectById(lead.projectId)?.name}</div>
            </div>
          </Link>
          {Object.entries(groups).map(([month, items]) => {
            const shown = items.filter((u) => u.id !== lead.id);
            if (!shown.length) return null;
            return (
              <section key={month} className="mb-12">
                <h3 className="mb-6 flex items-center gap-4 text-[12px] font-bold uppercase tracking-label text-sage">{month}<span className="h-px flex-1 bg-line" /></h3>
                <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                  {shown.map((u) => <UpdateCard key={u.id} u={u} project={v.projectById(u.projectId)} to={`/portal/updates/${u.id}`} />)}
                </div>
              </section>
            );
          })}
          {rest.length === 0 && <p className="text-[13px] text-sage">No earlier updates for this selection.</p>}
        </>
      )}
    </div>
  );
}

export function UpdateDetail() {
  const { id } = useParams();
  const v = useInvestorView();
  const { addComment, toast, state } = useDemo();
  const u = v.myUpdates.find((x) => x.id === id) ?? state.updates.find((x) => x.id === id && x.status === 'Published');
  if (!u) return <Empty title="Update not found" body="It may have been removed or is not part of your projects." action={<ButtonLink to="/portal/updates" variant="secondary">Back to updates</ButtonLink>} />;
  const p = v.projectById(u.projectId);
  return (
    <div className="mx-auto max-w-5xl">
      <UpdateArticle u={u} project={p} milestoneTitle={p?.milestones.find((m) => m.id === u.milestoneId)?.title}
        onComment={(t) => { addComment(u.id, t, 'investor'); toast({ title: 'Comment posted', body: 'The farm team will see it in the admin view.' }); }}
        backLink={<Link to="/portal/updates" className="mb-8 inline-flex items-center gap-2 text-[13px] font-semibold text-sage hover:text-ink"><ArrowLeft size={15} /> Farm Updates</Link>} />
    </div>
  );
}

/* ================= Milestones ================= */
export function Milestones() {
  const v = useInvestorView();
  const [sel, setSel] = useState(v.myProjects[0]?.id);
  const [filter, setFilter] = useState<'all' | MilestoneState>('all');
  const p = v.projectById(sel ?? '') ?? v.myProjects[0];
  if (!p) return <Empty title="No projects yet" />;
  const ms = p.milestones.filter((m) => filter === 'all' || m.state === filter);
  const done = p.milestones.filter((m) => m.state === 'completed').length;
  const pct = Math.round((done / p.milestones.length) * 100);
  const counts = (s: MilestoneState) => p.milestones.filter((m) => m.state === s).length;
  return (
    <div>
      <PageTitle eyebrow="Season tracking" title="Agricultural Milestones" intro="Solid markers show confirmed events. Open markers are expected milestones whose dates may move with weather and field conditions." />
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-2 xl:col-span-4">
          {v.myProjects.map((x) => {
            const d = x.milestones.filter((m) => m.state === 'completed').length;
            const attn = x.milestones.some((m) => m.state === 'attention');
            return (
              <button key={x.id} onClick={() => { setSel(x.id); setFilter('all'); }} aria-pressed={x.id === p.id}
                className={cx('flex w-full items-center gap-4 rounded-md border p-3.5 text-left transition', x.id === p.id ? 'border-[#C0D20D]/60 bg-pale' : 'border-line bg-white hover:border-ink/25')}>
                <Photo src={x.cover} className="h-14 w-14 shrink-0 rounded-sm" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-bold text-ink">{x.name}</div>
                  <div className="text-[11.5px] text-sage">{x.category} · {d}/{x.milestones.length} complete</div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-mist"><div className="h-full bg-agri" style={{ width: `${(d / x.milestones.length) * 100}%` }} /></div>
                </div>
                {attn && <span className="h-2 w-2 shrink-0 rounded-full bg-attn" title="Attention required" />}
              </button>
            );
          })}
        </div>
        <section className="card overflow-hidden xl:col-span-8">
          <div className="grid border-b border-line sm:grid-cols-[1fr_auto]">
            <div className="p-6 sm:p-7">
              <div className="eyebrow">{p.category} · {p.enterprise}</div>
              <h2 className="display mt-1.5 text-[30px] text-ink sm:text-[36px]">{p.name}</h2>
              <div className="mt-1 text-[13px] text-sage">{p.cycle}{p.harvestWindow ? ` · Harvest ${p.harvestWindow}` : ''}</div>
            </div>
            <div className="flex items-center gap-4 border-t border-line p-6 sm:border-l sm:border-t-0 sm:p-7">
              <svg width="68" height="68" viewBox="0 0 68 68" aria-hidden>
                <circle cx="34" cy="34" r="28" fill="none" stroke="#EDF2EC" strokeWidth="7" />
                <circle cx="34" cy="34" r="28" fill="none" stroke="#1A9959" strokeWidth="7" strokeDasharray={`${(pct / 100) * 175.9} 175.9`} transform="rotate(-90 34 34)" strokeLinecap="round" />
              </svg>
              <div><div className="display text-[32px] leading-none text-ink tnum">{pct}%</div><div className="mt-1 text-[12px] text-sage">of milestones completed</div></div>
            </div>
          </div>
          <div className="border-b border-line px-6 py-3 sm:px-7">
            <Tabs value={filter} onChange={setFilter} options={[
              { value: 'all', label: 'All', count: p.milestones.length },
              { value: 'completed', label: 'Completed', count: counts('completed') },
              { value: 'in_progress', label: 'In progress', count: counts('in_progress') },
              { value: 'upcoming', label: 'Upcoming', count: counts('upcoming') },
              { value: 'attention', label: 'Attention', count: counts('attention') },
            ]} />
          </div>
          <div className="p-6 sm:p-7">
            {ms.length ? <Timeline milestones={ms} /> : <p className="py-8 text-center text-[13.5px] text-sage">No milestones in this state.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

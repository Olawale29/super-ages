import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, FileText, Search, Wheat } from 'lucide-react';
import { useInvestorView } from '../../store/DemoStore';
import { Badge, Empty, Input, PageTitle, Select, decisionMeta, projectTone } from '../../components/ui/Bits';
import { ButtonLink } from '../../components/ui/Button';
import { DemoTag } from '../../components/ui/Brand';
import { Photo } from '../../components/ui/Photo';
import { Timeline } from '../../components/ui/Timeline';
import { UpdateCard } from '../../components/ui/UpdateViews';
import { DocPreview, DocRow } from './Documents';
import { fmtDate, naira } from '../../lib/format';
import type { DocumentItem } from '../../data/types';

export default function Investments() {
  const v = useInvestorView();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [status, setStatus] = useState('All');
  const rows = useMemo(() => v.myInvestments.map((i) => {
    const p = v.projectById(i.projectId)!;
    const next = p.milestones.find((m) => m.state !== 'completed');
    return { i, p, next };
  }).filter(({ i, p }) =>
    (cat === 'All' || p.category === cat) && (status === 'All' || i.status === status) &&
    (!q.trim() || `${p.name} ${p.enterprise} ${i.reference}`.toLowerCase().includes(q.toLowerCase()))
  ).sort((a, b) => b.i.date.localeCompare(a.i.date)), [v, q, cat, status]);
  const total = rows.reduce((a, r) => a + r.i.amount, 0);

  return (
    <div>
      <PageTitle eyebrow="Portfolio" title="My Investments" intro="Every contribution record, with its project status and next expected milestone." actions={<DemoTag>Illustrative figures</DemoTag>} />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sage" />
          <Input id="inv-search" aria-label="Search investments" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by project or reference" className="pl-9" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex">
          <Select id="inv-cat" aria-label="Category" value={cat} onChange={(e) => setCat(e.target.value)} className="sm:w-40"><option>All</option><option>Crops</option><option>Livestock</option></Select>
          <Select id="inv-status" aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-48"><option>All</option><option>Active</option><option>Awaiting decision</option><option>Completed</option></Select>
        </div>
      </div>

      {rows.length === 0 ? <Empty title="No investments match" body="Try clearing the search or changing the filters." icon={<Search size={18} />} /> : <>
        {/* Desktop table */}
        <div className="card hidden overflow-hidden md:block">
          <div className="scroll-x">
            <table className="w-full min-w-[820px] text-left text-[13.5px]">
              <thead className="border-b border-line bg-canvas text-[11px] font-bold uppercase tracking-label text-sage">
                <tr><th className="px-5 py-3.5 font-bold">Project</th><th className="px-4 py-3.5 font-bold">Category</th><th className="px-4 py-3.5 text-right font-bold">Contributed</th><th className="px-4 py-3.5 font-bold">Date</th><th className="px-4 py-3.5 font-bold">Status</th><th className="px-4 py-3.5 font-bold">Next milestone</th><th className="px-4 py-3.5" /></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map(({ i, p, next }) => (
                  <tr key={i.id} onClick={() => navigate(`/portal/investments/${i.id}`)} className="group cursor-pointer transition hover:bg-canvas">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Photo src={p.cover} className="h-11 w-14 shrink-0 rounded-sm" />
                        <div className="min-w-0"><Link to={`/portal/investments/${i.id}`} className="font-bold text-ink group-hover:text-agri" onClick={(e) => e.stopPropagation()}>{p.name}</Link><div className="text-[12px] text-sage">{i.reference}</div></div>
                      </div>
                    </td>
                    <td className="px-4 py-4"><div className="font-semibold text-ink">{p.category}</div><div className="text-[12px] text-sage">{p.enterprise}</div></td>
                    <td className="px-4 py-4 text-right font-bold text-ink tnum">{naira(i.amount)}</td>
                    <td className="px-4 py-4 text-body tnum">{fmtDate(i.date)}</td>
                    <td className="px-4 py-4"><Badge tone={projectTone(i.status)}>{i.status}</Badge></td>
                    <td className="px-4 py-4">{next ? <><div className="font-semibold text-ink">{next.title}</div><div className="text-[12px] text-sage tnum">{next.confirmed ? '' : 'Expected '}{fmtDate(next.date)}</div></> : <span className="text-sage">None</span>}</td>
                    <td className="px-4 py-4 text-right"><ArrowRight size={16} className="inline text-sage transition group-hover:translate-x-0.5 group-hover:text-ink" /></td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-line bg-canvas"><tr><td className="px-5 py-3.5 text-[12px] font-bold uppercase tracking-label text-sage" colSpan={2}>{rows.length} records</td><td className="px-4 py-3.5 text-right font-bold text-ink tnum">{naira(total)}</td><td colSpan={4} /></tr></tfoot>
            </table>
          </div>
        </div>
        {/* Mobile cards */}
        <ul className="space-y-3 md:hidden">
          {rows.map(({ i, p, next }) => (
            <li key={i.id}>
              <Link to={`/portal/investments/${i.id}`} className="card block overflow-hidden">
                <div className="flex gap-3 p-4">
                  <Photo src={p.cover} className="h-16 w-16 shrink-0 rounded-sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2"><div className="font-bold leading-snug text-ink">{p.name}</div></div>
                    <div className="text-[12px] text-sage">{p.category} · {i.reference}</div>
                    <div className="mt-2"><Badge tone={projectTone(i.status)}>{i.status}</Badge></div>
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-3 border-t border-line bg-canvas px-4 py-3 text-[12.5px]">
                  <div><dt className="text-sage">Contributed</dt><dd className="font-bold text-ink tnum">{naira(i.amount)}</dd></div>
                  <div><dt className="text-sage">Next milestone</dt><dd className="truncate font-semibold text-ink">{next?.title ?? 'None'}</dd></div>
                </dl>
              </Link>
            </li>
          ))}
        </ul>
      </>}
    </div>
  );
}

export function InvestmentDetail() {
  const { id } = useParams();
  const v = useInvestorView();
  const [doc, setDoc] = useState<DocumentItem | null>(null);
  const inv = v.myInvestments.find((i) => i.id === id);
  if (!inv) return <Empty title="Investment not found" body="This record is not in your portfolio." action={<ButtonLink to="/portal/investments" variant="secondary">Back to investments</ButtonLink>} />;
  const p = v.projectById(inv.projectId)!;
  const ups = v.myUpdates.filter((u) => u.projectId === p.id);
  const docs = v.myDocuments.filter((d) => d.projectId === p.id);
  const decision = v.myDecisions.find((d) => d.projectId === p.id);
  const done = p.milestones.filter((m) => m.state === 'completed').length;

  return (
    <div>
      <Link to="/portal/investments" className="mb-6 inline-flex items-center gap-2 text-[13px] font-semibold text-sage hover:text-ink"><ArrowLeft size={15} /> My Investments</Link>
      <div className="relative overflow-hidden rounded-md">
        <Photo src={p.cover} className="h-[260px] w-full sm:h-[320px]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,19,8,0)_30%,rgba(8,19,8,.8)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
          <div className="flex flex-wrap items-center gap-2"><span className="text-[11px] font-bold uppercase tracking-label text-mlime">{p.category} · {p.code}</span><Badge tone={projectTone(p.status)}>{p.status}</Badge></div>
          <h1 className="display mt-2 text-[36px] sm:text-[50px]">{p.name}</h1>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <section className="card p-6 sm:p-7">
            <h2 className="text-[15px] font-bold text-ink">Project overview</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-body">{p.summary}</p>
            <dl className="mt-6 grid grid-cols-2 gap-5 border-t border-line pt-5 sm:grid-cols-4">
              {[['Enterprise', p.enterprise], ['Scale', p.area], ['Cycle', p.cycle], ['Farm manager', p.manager]].map(([k, val]) => <div key={k}><dt className="eyebrow">{k}</dt><dd className="mt-1 text-[13.5px] font-semibold text-ink">{val}</dd></div>)}
            </dl>
          </section>

          <section className="card p-6 sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div><h2 className="text-[15px] font-bold text-ink">Project timeline</h2><p className="text-[12.5px] text-sage">{done} of {p.milestones.length} milestones completed</p></div>
              <div className="hidden h-1.5 w-40 overflow-hidden rounded-full bg-mist sm:block"><div className="h-full bg-agri" style={{ width: `${(done / p.milestones.length) * 100}%` }} /></div>
            </div>
            <Timeline milestones={p.milestones} />
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between"><h2 className="text-[15px] font-bold text-ink">Associated farm updates</h2><Link to="/portal/updates" className="text-[12.5px] font-semibold text-agri hover:underline">All updates</Link></div>
            {ups.length ? <div className="grid gap-6 sm:grid-cols-2">{ups.slice(0, 4).map((u) => <UpdateCard key={u.id} u={u} to={`/portal/updates/${u.id}`} />)}</div> : <Empty title="No updates yet" body="Updates for this project will appear here." />}
          </section>
        </div>

        <aside className="space-y-6 xl:col-span-4">
          <section className="card p-6">
            <h2 className="text-[15px] font-bold text-ink">Contribution record</h2>
            <div className="display mt-3 text-[38px] leading-none text-ink tnum">{naira(inv.amount)}</div>
            <dl className="mt-5 space-y-2.5 text-[13px]">
              {[['Reference', inv.reference], ['Date recorded', fmtDate(inv.date, true)], ['Category', `${p.category} · ${p.enterprise}`], ['Status', inv.status]].map(([k, val]) => <div key={k} className="flex justify-between gap-4 border-b border-line pb-2.5"><dt className="text-sage">{k}</dt><dd className="text-right font-semibold text-ink">{val}</dd></div>)}
            </dl>
            <p className="mt-4 text-[11.5px] text-sage">Demo record. Figures are illustrative and do not represent returns.</p>
          </section>

          {decision && (
            <section className="rounded-md border border-[#C0D20D]/50 bg-pale p-6">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-label text-ink"><Wheat size={14} />Harvest decision</div>
              <div className="mt-3"><Badge tone={decisionMeta[decision.status].tone}>{decisionMeta[decision.status].label}</Badge></div>
              <p className="mt-3 text-[13.5px] text-body">Expected harvest window: <strong className="text-ink">{p.harvestWindow}</strong></p>
              <ButtonLink to="/portal/harvest" className="mt-5 w-full" icon={<ArrowRight size={15} />}>{decision.status === 'awaiting_instruction' ? 'Record your instruction' : 'View instruction'}</ButtonLink>
            </section>
          )}

          <section className="card p-6">
            <h2 className="mb-2 text-[15px] font-bold text-ink">Relevant documents</h2>
            {docs.length ? <ul className="divide-y divide-line">{docs.map((d) => <DocRow key={d.id} d={d} onPreview={() => setDoc(d)} compact />)}</ul> : <p className="text-[13px] text-sage">No documents for this project yet.</p>}
            <Link to="/portal/documents" className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-agri"><FileText size={14} /> Document library</Link>
          </section>
        </aside>
      </div>
      <DocPreview doc={doc} onClose={() => setDoc(null)} />
    </div>
  );
}

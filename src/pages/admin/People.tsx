import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Mail, MapPin, Phone, Search } from 'lucide-react';
import { useDemo } from '../../store/DemoStore';
import { Badge, Empty, Input, PageTitle, Select, decisionAdminLabel, projectTone } from '../../components/ui/Bits';
import { ButtonLink } from '../../components/ui/Button';
import { Avatar } from '../../components/portal/Shell';
import { fmtDate, naira, relative } from '../../lib/format';

export function Investors() {
  const { state } = useDemo();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [proj, setProj] = useState('All');
  const rows = useMemo(() => state.investors.map((i) => {
    const invs = state.investments.filter((x) => x.investorId === i.id);
    return { i, invs, total: invs.reduce((a, b) => a + b.amount, 0), pending: state.decisions.some((d) => d.investorId === i.id && d.status !== 'completed' && d.status !== 'acknowledged') };
  }).filter(({ i, invs }) => (proj === 'All' || invs.some((x) => x.projectId === proj)) && (!q.trim() || `${i.firstName} ${i.lastName} ${i.email} ${i.city}`.toLowerCase().includes(q.toLowerCase()))), [state, q, proj]);

  return (
    <div>
      <PageTitle eyebrow="Directory" title="Investors" intro="Fictional investor records for the demonstration." />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1 sm:max-w-sm"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sage" /><Input id="ad-inv-q" aria-label="Search investors" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email or city" className="pl-9" /></div>
        <Select id="ad-inv-proj" aria-label="Filter by project" value={proj} onChange={(e) => setProj(e.target.value)} className="sm:w-64"><option value="All">All projects</option>{state.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select>
      </div>
      {rows.length === 0 ? <Empty title="No investors match" body="Clear the search or choose another project." /> : (
        <div className="card overflow-hidden">
          <div className="scroll-x">
            <table className="w-full min-w-[760px] text-left text-[13.5px]">
              <thead className="border-b border-line bg-canvas text-[11px] uppercase tracking-label text-sage"><tr><th className="px-5 py-3.5 font-bold">Investor</th><th className="px-4 py-3.5 font-bold">Location</th><th className="px-4 py-3.5 font-bold">Projects</th><th className="px-4 py-3.5 text-right font-bold">Contributed</th><th className="px-4 py-3.5 font-bold">Joined</th><th className="px-4 py-3.5 font-bold">Status</th><th /></tr></thead>
              <tbody className="divide-y divide-line">
                {rows.map(({ i, invs, total, pending }) => (
                  <tr key={i.id} className="group cursor-pointer hover:bg-canvas" onClick={() => navigate(`/admin/investors/${i.id}`)}>
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><Avatar initials={`${i.firstName[0]}${i.lastName[0]}`} src={i.avatar} size={34} /><div><Link to={`/admin/investors/${i.id}`} onClick={(e) => e.stopPropagation()} className="font-bold text-ink group-hover:text-agri">{i.firstName} {i.lastName}</Link><div className="text-[12px] text-sage">{i.email}</div></div></div></td>
                    <td className="px-4 py-4 text-body">{i.city}</td>
                    <td className="px-4 py-4 text-body tnum">{invs.length}</td>
                    <td className="px-4 py-4 text-right font-bold text-ink tnum">{naira(total)}</td>
                    <td className="px-4 py-4 text-body tnum">{fmtDate(i.joined)}</td>
                    <td className="px-4 py-4"><div className="flex flex-wrap gap-1.5"><Badge tone="green">{i.status}</Badge>{pending && <Badge tone="lime">Decision open</Badge>}</div></td>
                    <td className="px-4 py-4 text-right"><ArrowRight size={16} className="inline text-sage group-hover:text-ink" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function InvestorProfile() {
  const { id } = useParams();
  const { state } = useDemo();
  const i = state.investors.find((x) => x.id === id);
  if (!i) return <Empty title="Investor not found" action={<ButtonLink to="/admin/investors" variant="secondary">Back to investors</ButtonLink>} />;
  const invs = state.investments.filter((x) => x.investorId === i.id);
  const convs = state.conversations.filter((c) => c.investorId === i.id);
  const decs = state.decisions.filter((d) => d.investorId === i.id);
  const name = `${i.firstName} ${i.lastName}`;
  const acts = state.activity.filter((a) => a.who === name).slice(0, 6);
  return (
    <div>
      <Link to="/admin/investors" className="mb-6 inline-flex items-center gap-2 text-[13px] font-semibold text-sage hover:text-ink"><ArrowLeft size={15} /> Investors</Link>
      <div className="card flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
        <Avatar initials={`${i.firstName[0]}${i.lastName[0]}`} src={i.avatar} size={72} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h1 className="display text-[38px] leading-none text-ink">{name}</h1><Badge tone="green">{i.status}</Badge></div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-body">
            <span className="inline-flex items-center gap-1.5"><Mail size={14} className="text-sage" />{i.email}</span>
            <span className="inline-flex items-center gap-1.5"><Phone size={14} className="text-sage" />{i.phone}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-sage" />{i.city}</span>
          </div>
        </div>
        <div className="sm:text-right"><div className="eyebrow">Total contributed</div><div className="display mt-1 text-[34px] leading-none text-ink tnum">{naira(invs.reduce((a, b) => a + b.amount, 0))}</div><div className="mt-1 text-[12px] text-sage">Investor since {fmtDate(i.joined)}</div></div>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <section className="card overflow-hidden">
            <h2 className="border-b border-line px-6 py-4 text-[15px] font-bold text-ink">Associated investments</h2>
            <ul className="divide-y divide-line">
              {invs.map((x) => { const p = state.projects.find((y) => y.id === x.projectId)!; return (
                <li key={x.id}><Link to={`/admin/projects/${p.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4 hover:bg-canvas">
                  <div className="min-w-0 flex-1"><div className="font-bold text-ink">{p.name}</div><div className="text-[12px] text-sage">{x.reference} · {fmtDate(x.date)}</div></div>
                  <Badge tone={projectTone(x.status)}>{x.status}</Badge>
                  <div className="w-32 text-right font-bold text-ink tnum">{naira(x.amount)}</div>
                </Link></li>); })}
            </ul>
          </section>
          <section className="card overflow-hidden">
            <h2 className="border-b border-line px-6 py-4 text-[15px] font-bold text-ink">Messages</h2>
            {convs.length ? <ul className="divide-y divide-line">{convs.map((c) => { const last = c.messages[c.messages.length - 1]; return (
              <li key={c.id}><Link to={`/admin/messages/${c.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-canvas">
                <div className="min-w-0 flex-1"><div className="flex items-center gap-2 font-bold text-ink">{c.subject}{c.unreadTeam > 0 && <span className="h-2 w-2 rounded-full bg-agri" />}</div><div className="truncate text-[12.5px] text-sage">{last.text}</div></div>
                <span className="shrink-0 text-[12px] text-sage">{relative(last.at)}</span>
              </Link></li>); })}</ul> : <p className="px-6 py-5 text-[13px] text-sage">No conversations yet.</p>}
          </section>
        </div>
        <aside className="space-y-6 xl:col-span-4">
          <section className="card p-6">
            <h2 className="text-[15px] font-bold text-ink">Harvest decisions</h2>
            {decs.length ? <ul className="mt-3 space-y-3">{decs.map((d) => <li key={d.id}><Link to={`/admin/decisions?open=${d.id}`} className="flex items-center justify-between gap-3 rounded border border-line p-3 hover:border-ink/30"><span className="text-[13px] font-semibold text-ink">{d.reference}</span><Badge tone={d.status === 'submitted' ? 'lime' : 'neutral'}>{decisionAdminLabel[d.status]}</Badge></Link></li>)}</ul> : <p className="mt-2 text-[13px] text-sage">None.</p>}
          </section>
          <section className="card p-6">
            <h2 className="text-[15px] font-bold text-ink">Recent activity</h2>
            {acts.length ? <ol className="mt-3 space-y-3">{acts.map((a) => <li key={a.id} className="text-[13px] leading-snug text-body">{a.text}<div className="text-[11.5px] text-sage">{relative(a.at)}</div></li>)}</ol> : <p className="mt-2 text-[13px] text-sage">No recent activity recorded.</p>}
          </section>
        </aside>
      </div>
    </div>
  );
}

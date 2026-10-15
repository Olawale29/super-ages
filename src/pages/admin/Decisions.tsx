import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Eye } from 'lucide-react';
import { useDemo } from '../../store/DemoStore';
import { Badge, Empty, PageTitle, Tabs, Textarea, decisionAdminLabel } from '../../components/ui/Bits';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Overlay';
import { OPTIONS } from '../investor/Harvest';
import type { DecisionStatus } from '../../data/types';
import { cx, fmtDate, fmtTime } from '../../lib/format';

const tone = (s: DecisionStatus) => (s === 'submitted' ? 'lime' : s === 'under_review' ? 'neutral' : s === 'acknowledged' ? 'green' : s === 'completed' ? 'ink' : 'attn') as any;

export default function Decisions() {
  const { state, adminUpdateDecision, toast } = useDemo();
  const [params, setParams] = useSearchParams();
  const openId = params.get('open');
  const [tab, setTab] = useState<'open' | DecisionStatus | 'all'>('open');
  const [response, setResponse] = useState('');
  const [next, setNext] = useState<DecisionStatus>('acknowledged');
  const [lastOpen, setLastOpen] = useState<string | null>(null);
  const d = state.decisions.find((x) => x.id === openId);
  if (openId !== lastOpen) { setLastOpen(openId); setResponse(d?.teamResponse ?? ''); setNext(d?.status === 'acknowledged' ? 'completed' : 'acknowledged'); }

  const isOpen = (s: DecisionStatus) => s === 'submitted' || s === 'under_review';
  const list = state.decisions.filter((x) => tab === 'all' || (tab === 'open' ? isOpen(x.status) : x.status === tab))
    .sort((a, b) => (b.submittedAt ?? b.requestedOn).localeCompare(a.submittedAt ?? a.requestedOn));
  const count = (s: DecisionStatus) => state.decisions.filter((x) => x.status === s).length;
  const close = () => { params.delete('open'); setParams(params, { replace: true }); };

  const inv = d && state.investors.find((i) => i.id === d.investorId);
  const p = d && state.projects.find((x) => x.id === d.projectId);
  const opt = d?.option && OPTIONS.find((o) => o.id === d.option);

  return (
    <div>
      <PageTitle eyebrow="Harvest" title="Harvest decision queue" intro="Investor instructions recorded in the portal. Updates here are reflected in the investor view straight away." />
      <Tabs className="mb-4" value={tab} onChange={setTab} options={[
        { value: 'open', label: 'Needs action', count: state.decisions.filter((x) => isOpen(x.status)).length },
        { value: 'submitted', label: 'New', count: count('submitted') },
        { value: 'under_review', label: 'Under review', count: count('under_review') },
        { value: 'acknowledged', label: 'Acknowledged', count: count('acknowledged') },
        { value: 'completed', label: 'Completed', count: count('completed') },
        { value: 'awaiting_instruction', label: 'Awaiting investor', count: count('awaiting_instruction') },
        { value: 'all', label: 'All', count: state.decisions.length },
      ]} />
      {list.length === 0 ? <Empty title="Nothing in this queue" body={tab === 'open' ? 'All recorded instructions have been handled. Try submitting one from the investor view.' : 'No decisions in this state.'} /> : (
        <div className="card overflow-hidden">
          <div className="scroll-x">
            <table className="w-full min-w-[860px] text-left text-[13.5px]">
              <thead className="border-b border-line bg-canvas text-[11px] uppercase tracking-label text-sage"><tr><th className="px-5 py-3.5 font-bold">Investor</th><th className="px-4 py-3.5 font-bold">Project</th><th className="px-4 py-3.5 font-bold">Requested action</th><th className="px-4 py-3.5 font-bold">Submitted</th><th className="px-4 py-3.5 font-bold">Status</th><th className="px-4 py-3.5 font-bold">Investor note</th><th /></tr></thead>
              <tbody className="divide-y divide-line">
                {list.map((x) => {
                  const i = state.investors.find((y) => y.id === x.investorId)!;
                  const pr = state.projects.find((y) => y.id === x.projectId)!;
                  return (
                    <tr key={x.id} className={cx('cursor-pointer hover:bg-canvas', x.status === 'submitted' && 'bg-pale/50')} onClick={() => setParams({ open: x.id })}>
                      <td className="px-5 py-4"><div className="font-bold text-ink">{i.firstName} {i.lastName}</div><div className="text-[12px] text-sage">{x.reference}</div></td>
                      <td className="px-4 py-4 text-body">{pr.name}</td>
                      <td className="px-4 py-4 font-semibold text-ink">{x.option ? OPTIONS.find((o) => o.id === x.option)?.short : <span className="font-normal text-sage">Not yet recorded</span>}</td>
                      <td className="px-4 py-4 text-body tnum">{x.submittedAt ? fmtDate(x.submittedAt) : '—'}</td>
                      <td className="px-4 py-4"><Badge tone={tone(x.status)}>{decisionAdminLabel[x.status]}</Badge></td>
                      <td className="max-w-[240px] px-4 py-4"><span className="line-clamp-2 text-[12.5px] text-body">{x.note || <span className="text-sage">—</span>}</span></td>
                      <td className="px-4 py-4 text-right"><Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setParams({ open: x.id }); }} icon={<Eye size={14} />}>Open</Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={!!d} onClose={close} size="lg" eyebrow={`Harvest decision · ${d?.reference}`} title={inv ? `${inv.firstName} ${inv.lastName}` : ''}
        footer={d && (d.status === 'awaiting_instruction' ? <Button variant="secondary" onClick={close}>Close</Button> : <>
          {d.status === 'submitted' && <Button variant="secondary" className="sm:mr-auto" onClick={() => { adminUpdateDecision(d.id, 'under_review'); toast({ title: 'Marked as under review', body: 'The investor can see the new status.' }); }}>Mark as under review</Button>}
          <Button variant="secondary" onClick={close}>Cancel</Button>
          <Button onClick={() => { adminUpdateDecision(d.id, next, response); toast({ title: `Decision ${decisionAdminLabel[next].toLowerCase()}`, body: response.trim() ? 'Your response is visible to the investor.' : 'Status updated in the investor view.' }); close(); }}>Save and notify investor</Button>
        </>)}>
        {d && p && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2"><Badge tone={tone(d.status)}>{decisionAdminLabel[d.status]}</Badge><span className="text-[12.5px] text-sage">Requested {fmtDate(d.requestedOn)} · respond by {fmtDate(d.respondBy)}</span></div>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded border border-line bg-line text-[13px] sm:grid-cols-3">
              <div className="bg-canvas p-3.5"><div className="eyebrow">Project</div><Link to={`/admin/projects/${p.id}`} className="mt-1 block font-bold text-ink hover:text-agri">{p.name}</Link></div>
              <div className="bg-canvas p-3.5"><div className="eyebrow">Harvest window</div><div className="mt-1 font-bold text-ink">{p.harvestWindow}</div></div>
              <div className="col-span-2 bg-canvas p-3.5 sm:col-span-1"><div className="eyebrow">Submitted</div><div className="mt-1 font-bold text-ink tnum">{d.submittedAt ? `${fmtDate(d.submittedAt)}, ${fmtTime(d.submittedAt)}` : 'Not yet'}</div></div>
            </div>
            {opt ? (
              <div className="rounded-md border border-[#C0D20D]/50 bg-pale p-5">
                <div className="eyebrow">Requested action</div>
                <div className="mt-2 flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded bg-white text-agri"><opt.icon size={18} /></span><span className="text-[16px] font-bold text-ink">{opt.title}</span></div>
                {d.note ? <blockquote className="mt-4 border-l-2 border-lime pl-4 text-[14px] italic text-body">“{d.note}”</blockquote> : <p className="mt-3 text-[13px] text-sage">No note added.</p>}
              </div>
            ) : <p className="rounded border border-dashed border-line p-5 text-[13.5px] text-sage">The investor has not recorded an instruction yet. Switch to the investor view to submit one.</p>}
            {d.status !== 'awaiting_instruction' && (
              <>
                <div>
                  <div className="field-label">Set status</div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {(['under_review', 'acknowledged', 'completed'] as DecisionStatus[]).map((s) => (
                      <button key={s} onClick={() => setNext(s)} aria-pressed={next === s} className={cx('rounded border px-3 py-2.5 text-left text-[13px] font-semibold', next === s ? 'border-agri bg-agri/5 text-ink' : 'border-line text-body hover:border-ink/30')}>{decisionAdminLabel[s]}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="dec-response" className="field-label">Response to the investor</label>
                  <Textarea id="dec-response" value={response} onChange={(e) => setResponse(e.target.value)} placeholder="e.g. Thank you. We have noted your sale instruction and will share offtake terms before harvest." />
                  <p className="mt-1.5 text-[11.5px] text-sage">The investor sees this on their Harvest Decision page and receives a notification.</p>
                </div>
              </>
            )}
            {inv && <Link to={`/admin/investors/${inv.id}`} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-agri">View investor profile <ArrowRight size={13} /></Link>}
          </div>
        )}
      </Modal>
    </div>
  );
}

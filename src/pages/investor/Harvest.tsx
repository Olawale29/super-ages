import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, CheckCircle2, Coins, Info, MessagesSquare, PenLine, Warehouse } from 'lucide-react';
import { useDemo, useInvestorView } from '../../store/DemoStore';
import { Badge, Empty, Textarea, decisionMeta } from '../../components/ui/Bits';
import { Button, ButtonLink } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Overlay';
import { Photo } from '../../components/ui/Photo';
import type { DecisionOption, DecisionStatus, HarvestDecision } from '../../data/types';
import { cx, daysUntil, fmtDate, fmtTime } from '../../lib/format';

export const OPTIONS: { id: DecisionOption; title: string; short: string; body: string; icon: typeof Coins; caveat?: string }[] = [
  { id: 'sell', title: 'Sell the harvested produce', short: 'Sell', icon: Coins, body: 'Ask the farm team to sell your share of the produce through Super Ages offtake arrangements after harvest.', caveat: 'Sale terms are confirmed by the farm team before any sale takes place.' },
  { id: 'store', title: 'Store the produce', short: 'Store', icon: Warehouse, body: 'Ask for your share to be dried, bagged and held in storage for a later decision.', caveat: 'Subject to storage availability. Space is allocated in the order instructions are confirmed.' },
  { id: 'discuss', title: 'Discuss the options with the farm team', short: 'Discuss', icon: MessagesSquare, body: 'Not ready to decide? Ask the farm team to call or message you to talk through the options.' },
  { id: 'other', title: 'Provide another instruction', short: 'Other instruction', icon: PenLine, body: 'Describe a different arrangement in your own words. The team will review whether it can be accommodated.' },
];

const STEPS: { key: DecisionStatus; label: string }[] = [
  { key: 'awaiting_instruction', label: 'Request received' },
  { key: 'submitted', label: 'Instruction recorded' },
  { key: 'under_review', label: 'Under review' },
  { key: 'acknowledged', label: 'Acknowledged' },
  { key: 'completed', label: 'Completed' },
];

export default function Harvest() {
  const v = useInvestorView();
  const decisions = v.myDecisions;
  const [activeId, setActiveId] = useState(decisions.find((d) => d.status === 'awaiting_instruction')?.id ?? decisions[0]?.id);
  const d = decisions.find((x) => x.id === activeId);
  if (!d) return <Empty title="No harvest decisions right now" body="When one of your crops approaches harvest, a decision request will appear here." icon={<Coins size={18} />} />;
  return (
    <div>
      {decisions.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">{decisions.map((x) => <button key={x.id} onClick={() => setActiveId(x.id)} className={cx('rounded border px-3 py-1.5 text-[12.5px] font-semibold', x.id === d.id ? 'border-ink bg-ink text-canvas' : 'border-line bg-white')}>{v.projectById(x.projectId)?.name}</button>)}</div>
      )}
      <DecisionView d={d} />
    </div>
  );
}

function DecisionView({ d }: { d: HarvestDecision }) {
  const v = useInvestorView();
  const { submitDecision, toast } = useDemo();
  const p = v.projectById(d.projectId)!;
  const inv = v.myInvestments.find((i) => i.projectId === p.id);
  const [choice, setChoice] = useState<DecisionOption | null>(null);
  const [step, setStep] = useState<'details' | 'review' | 'success'>('details');
  const [note, setNote] = useState('');
  const [ack, setAck] = useState(false);
  const [err, setErr] = useState('');
  const [editing, setEditing] = useState(false);
  const days = daysUntil(d.respondBy);
  const stepIndex = STEPS.findIndex((s) => s.key === d.status);
  const open = (o: DecisionOption) => { setChoice(o); setStep('details'); setNote(d.status !== 'awaiting_instruction' && d.option === o ? d.note ?? '' : ''); setAck(false); setErr(''); };
  const close = () => { setChoice(null); if (step === 'success') setEditing(false); };
  const opt = OPTIONS.find((o) => o.id === choice);
  const canChange = d.status === 'submitted';
  const showOptions = d.status === 'awaiting_instruction' || editing;
  const moisture = p.milestones.find((m) => m.state === 'in_progress')?.metric;

  const toReview = () => {
    if (choice === 'other' && note.trim().length < 10) { setErr('Describe your instruction in at least 10 characters so the team can act on it.'); return; }
    setErr(''); setStep('review');
  };
  const confirm = () => {
    if (!ack) { setErr('Please confirm you understand what this instruction does.'); return; }
    submitDecision(d.id, choice!, note.trim());
    setStep('success');
    toast({ title: 'Harvest instruction recorded', body: `${opt?.short} · ${p.name}` });
  };

  return (
    <div className="space-y-8">
      {/* Signature panel */}
      <section className="relative overflow-hidden rounded-md border border-[#C0D20D]/50 bg-pale">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-lime" aria-hidden />
        <div className="grid lg:grid-cols-12">
          <div className="p-6 sm:p-10 lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-label text-ink">Harvest decision · {d.reference}</span>
              <Badge tone={decisionMeta[d.status].tone}>{decisionMeta[d.status].label}</Badge>
            </div>
            <h1 className="display mt-5 text-[42px] leading-[0.98] text-ink sm:text-[60px]">
              {d.status === 'awaiting_instruction' ? 'Your crop is approaching harvest.' : d.status === 'completed' ? 'This harvest decision is complete.' : 'Your instruction has been recorded.'}
            </h1>
            <p className="mt-5 max-w-[54ch] text-[15.5px] leading-relaxed text-body">
              {d.status === 'awaiting_instruction'
                ? 'The project has reached an important milestone. Review the available next steps and let the farm team know how you would like to proceed.'
                : 'The farm team will review your instruction and confirm the next step with you. You will be notified when the status changes.'}
            </p>
            <dl className="mt-8 grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded border border-ink/10 bg-ink/10 sm:grid-cols-3">
              <div className="bg-white/70 p-4"><dt className="eyebrow">Project</dt><dd className="mt-1 text-[13.5px] font-bold text-ink">{p.name}</dd></div>
              <div className="bg-white/70 p-4"><dt className="eyebrow">Expected harvest</dt><dd className="mt-1 text-[13.5px] font-bold text-ink">{p.harvestWindow}</dd></div>
              <div className="col-span-2 bg-white/70 p-4 sm:col-span-1"><dt className="eyebrow">Respond by</dt><dd className="mt-1 text-[13.5px] font-bold text-ink tnum">{fmtDate(d.respondBy)}{d.status === 'awaiting_instruction' && days >= 0 && <span className="ml-1.5 font-semibold text-attn">· {days} days left</span>}</dd></div>
            </dl>
          </div>
          <div className="relative lg:col-span-5">
            <Photo src="maizeCob" className="h-64 w-full lg:h-full" />
            {moisture && (
              <div className="absolute bottom-4 left-4 right-4 rounded-sm bg-white/95 p-4 backdrop-blur-sm sm:left-auto sm:w-64">
                <div className="eyebrow">Latest field reading</div>
                <div className="mt-1 text-[14px] font-bold text-ink tnum">{moisture}</div>
                <div className="mt-1 text-[11.5px] text-sage">Recorded 13 Oct by {p.manager}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Progress */}
      <section aria-label="Decision progress" className="card p-5 sm:p-6">
        <ol className="grid grid-cols-5 gap-2">
          {STEPS.map((s, i) => (
            <li key={s.key} className="min-w-0">
              <div className={cx('h-1 rounded-full', i <= stepIndex ? 'bg-agri' : 'bg-mist')} />
              <div className={cx('mt-2.5 flex items-center gap-1.5 text-[11.5px] font-semibold sm:text-[12.5px]', i <= stepIndex ? 'text-ink' : 'text-sage')}>
                {i < stepIndex && <Check size={13} className="hidden shrink-0 text-agri sm:block" strokeWidth={3} />}
                <span className="truncate">{s.label}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Recorded instruction */}
      {d.status !== 'awaiting_instruction' && d.option && !editing && (
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6 sm:p-7">
            <div className="eyebrow">Your recorded instruction</div>
            <div className="mt-3 flex items-center gap-3">
              {(() => { const O = OPTIONS.find((o) => o.id === d.option)!; return <><span className="flex h-10 w-10 items-center justify-center rounded bg-pale text-agri ring-1 ring-inset ring-[#C0D20D]/60"><O.icon size={19} /></span><div className="text-[17px] font-bold text-ink">{O.title}</div></>; })()}
            </div>
            {d.note && <blockquote className="mt-4 border-l-2 border-lime pl-4 text-[14px] italic leading-relaxed text-body">“{d.note}”</blockquote>}
            <div className="mt-4 text-[12.5px] text-sage tnum">Recorded {d.submittedAt && `${fmtDate(d.submittedAt)} at ${fmtTime(d.submittedAt)}`} · Reference {d.reference}</div>
            {canChange && <Button variant="secondary" className="mt-5" onClick={() => setEditing(true)}>Change instruction</Button>}
          </div>
          <div className={cx('rounded-md border p-6 sm:p-7', d.teamResponse ? 'border-agri/30 bg-white' : 'border-dashed border-line bg-white/60')}>
            <div className="eyebrow">Response from the farm team</div>
            {d.teamResponse ? (
              <>
                <p className="mt-3 text-[14.5px] leading-relaxed text-ink">{d.teamResponse}</p>
                <div className="mt-4 text-[12.5px] text-sage">{p.manager}, Farm Manager · {d.respondedAt && fmtDate(d.respondedAt)}</div>
              </>
            ) : (
              <p className="mt-3 text-[14px] leading-relaxed text-sage">No response yet. The team reviews new instructions within two working days. Try switching to the administrator view to respond as the farm team.</p>
            )}
            <ButtonLink to="/portal/messages" variant="ghost" size="sm" className="-ml-3 mt-4">Message the farm team <ArrowRight size={14} /></ButtonLink>
          </div>
        </section>
      )}

      {/* Options */}
      {showOptions && (
        <section>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div><h2 className="display text-[30px] text-ink">{editing ? 'Choose a new instruction' : 'Choose how to proceed'}</h2><p className="text-[13.5px] text-sage">Select an option to review it before confirming.</p></div>
            {editing && <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Keep current instruction</Button>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {OPTIONS.map((o) => (
              <button key={o.id} onClick={() => open(o.id)} className="group flex flex-col rounded-md border border-line bg-white p-6 text-left transition hover:border-agri hover:shadow-[0_0_0_3px_rgba(26,153,89,.08)]">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded bg-pale text-agri ring-1 ring-inset ring-[#C0D20D]/50 transition group-hover:bg-agri group-hover:text-white group-hover:ring-agri"><o.icon size={20} /></span>
                  <span className="h-5 w-5 rounded-full border-[1.5px] border-line transition group-hover:border-agri" />
                </div>
                <h3 className="mt-5 text-[16px] font-bold text-ink">{o.title}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-body">{o.body}</p>
                {o.caveat && <p className="mt-3 text-[12px] font-medium text-sage">{o.caveat}</p>}
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[13px] font-semibold text-agri">Select this option <ArrowRight size={14} className="transition group-hover:translate-x-0.5" /></span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="flex gap-3 rounded-md border border-line bg-white p-5 text-[13px] leading-relaxed text-body">
        <Info size={17} className="mt-0.5 shrink-0 text-agri" />
        <p><strong className="text-ink">What your selection does.</strong> Choosing an option records an instruction for the farm team. It does not execute a sale, reserve storage or move any money. Storage is subject to availability, and the team will confirm every next step with you. In this demo, nothing is sent or transacted.</p>
      </div>

      {inv && <p className="text-[12.5px] text-sage">Related contribution: <Link to={`/portal/investments/${inv.id}`} className="font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink">{inv.reference}</Link></p>}

      {/* Confirmation workflow */}
      <Modal open={!!choice} onClose={close} size="md"
        eyebrow={step === 'success' ? 'Instruction recorded' : `Step ${step === 'details' ? 1 : 2} of 2 · ${step === 'details' ? 'Add details' : 'Review and confirm'}`}
        title={step === 'success' ? 'Thank you. Your instruction is with the farm team.' : opt?.title ?? ''}
        footer={step === 'details' ? <><Button variant="secondary" onClick={close}>Cancel</Button><Button onClick={toReview} icon={undefined}>Review instruction <ArrowRight size={15} /></Button></>
          : step === 'review' ? <><Button variant="secondary" onClick={() => { setStep('details'); setErr(''); }}>Back</Button><Button onClick={confirm}>Confirm instruction</Button></>
          : <><ButtonLink to="/portal/messages" variant="secondary" onClick={close}>Message the team</ButtonLink><Button onClick={close}>Done</Button></>}>
        {step === 'details' && opt && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded border border-line bg-line text-[13px]">
              <div className="bg-canvas p-3.5"><div className="eyebrow">Project</div><div className="mt-1 font-bold text-ink">{p.name}</div></div>
              <div className="bg-canvas p-3.5"><div className="eyebrow">Expected harvest window</div><div className="mt-1 font-bold text-ink">{p.harvestWindow}</div></div>
            </div>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Instruction">
              {OPTIONS.map((o) => (
                <button key={o.id} role="radio" aria-checked={o.id === choice} onClick={() => { setChoice(o.id); setErr(''); }}
                  className={cx('inline-flex items-center gap-2 rounded border px-3 py-2 text-[12.5px] font-semibold transition', o.id === choice ? 'border-agri bg-agri/5 text-ink' : 'border-line text-body hover:border-ink/30')}>
                  <o.icon size={14} className={o.id === choice ? 'text-agri' : ''} />{o.short}
                </button>
              ))}
            </div>
            <p className="text-[14px] leading-relaxed text-body">{opt.body}</p>
            {opt.caveat && <p className="flex gap-2 rounded bg-pale px-3.5 py-2.5 text-[12.5px] text-ink"><Info size={15} className="mt-0.5 shrink-0 text-agri" />{opt.caveat}</p>}
            <div>
              <label htmlFor="decision-note" className="field-label">{choice === 'other' ? 'Your instruction' : 'Note for the farm team (optional)'}</label>
              <Textarea id="decision-note" data-autofocus value={note} onChange={(e) => { setNote(e.target.value); setErr(''); }} invalid={!!err}
                placeholder={choice === 'sell' ? 'For example: proceed if terms are in line with the last report.' : choice === 'store' ? 'For example: preferred storage period.' : choice === 'discuss' ? 'For example: best time to call you.' : 'Describe how you would like the produce handled.'} />
              {err && <p id="decision-note-err" className="mt-1.5 text-[12px] font-medium text-danger">{err}</p>}
            </div>
          </div>
        )}
        {step === 'review' && opt && (
          <div className="space-y-5">
            <div className="overflow-hidden rounded border border-line">
              {[['Project', p.name], ['Expected harvest window', p.harvestWindow ?? '—'], ['Instruction', opt.title], ['Note', note.trim() || 'No note added'], ['Reference', d.reference]].map(([k, val]) => (
                <div key={k} className="grid grid-cols-[130px_1fr] gap-4 border-b border-line px-4 py-3 text-[13.5px] last:border-0 sm:grid-cols-[180px_1fr]"><span className="text-sage">{k}</span><span className={cx('font-semibold text-ink', k === 'Note' && !note.trim() && 'font-normal italic text-sage')}>{val}</span></div>
              ))}
            </div>
            <label className={cx('flex cursor-pointer gap-3 rounded border p-4 text-[13px] leading-relaxed text-body', err ? 'border-danger/50 bg-danger/[0.03]' : 'border-[#C0D20D]/60 bg-pale')}>
              <input type="checkbox" id="decision-ack" checked={ack} onChange={(e) => { setAck(e.target.checked); setErr(''); }} className="mt-0.5 h-4 w-4 shrink-0 accent-[#1A9959]" />
              <span>I understand this records an instruction for the farm team. It does not itself execute a sale or guarantee storage availability, and the team will confirm the next step with me.</span>
            </label>
            {err && <p className="text-[12px] font-medium text-danger">{err}</p>}
          </div>
        )}
        {step === 'success' && opt && (
          <div className="py-2">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-agri text-white"><CheckCircle2 size={28} strokeWidth={1.8} /></span>
              <div><div className="text-[15px] font-bold text-ink">{opt.title}</div><div className="text-[13px] text-sage">{p.name} · {d.reference}</div></div>
            </div>
            <ol className="mt-7 space-y-3 border-t border-line pt-6 text-[13.5px] text-body">
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-agri text-[11px] font-bold text-white">✓</span>Your instruction is recorded and visible to the farm team.</li>
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mist text-[11px] font-bold text-ink">2</span>The team reviews it and may message you with questions.</li>
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mist text-[11px] font-bold text-ink">3</span>You are notified when it is acknowledged and when harvest handling is complete.</li>
            </ol>
            <p className="mt-6 text-[12px] text-sage">Simulated in this demo. No sale, storage booking or payment has been made.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

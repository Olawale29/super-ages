import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Paperclip, Plus, Search, Send, X, FileText, Leaf } from 'lucide-react';
import { useDemo } from '../../store/DemoStore';
import { Badge, Empty, Field, Input, PageTitle, Select, Textarea } from '../../components/ui/Bits';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Overlay';
import { Avatar } from '../../components/portal/Shell';
import { cx, fmtDate, fmtTime, relative } from '../../lib/format';
import type { Conversation } from '../../data/types';

/**
 * Messaging used by both experiences. side="investor" shows the signed-in investor's
 * conversations; side="team" shows every conversation for the farm team.
 */
export default function Messages({ side }: { side: 'investor' | 'team' }) {
  const { state, sendMessage, markConversationRead, toast, startConversation } = useDemo();
  const { id } = useParams();
  const navigate = useNavigate();
  const base = side === 'investor' ? '/portal/messages' : '/admin/messages';
  const [q, setQ] = useState('');
  const [newOpen, setNewOpen] = useState(false);

  const convs = state.conversations
    .filter((c) => side === 'team' || c.investorId === state.investorId)
    .filter((c) => {
      if (!q.trim()) return true;
      const inv = state.investors.find((i) => i.id === c.investorId);
      return `${c.subject} ${c.teamMember} ${inv?.firstName} ${inv?.lastName}`.toLowerCase().includes(q.toLowerCase());
    })
    .sort((a, b) => b.messages[b.messages.length - 1].at.localeCompare(a.messages[a.messages.length - 1].at));
  const active = state.conversations.find((c) => c.id === id);

  useEffect(() => { if (active) markConversationRead(active.id, side); }, [active?.id, active?.messages.length]); // eslint-disable-line

  const unreadOf = (c: Conversation) => (side === 'investor' ? c.unreadInvestor : c.unreadTeam);
  const counterpart = (c: Conversation) => {
    if (side === 'investor') return { name: c.teamMember, sub: c.teamRole, initials: c.teamMember.split(' ').map((x) => x[0]).join('') };
    const inv = state.investors.find((i) => i.id === c.investorId)!;
    return { name: `${inv.firstName} ${inv.lastName}`, sub: 'Investor', initials: `${inv.firstName[0]}${inv.lastName[0]}`, avatar: inv.avatar };
  };

  return (
    <div>
      <PageTitle eyebrow={side === 'investor' ? 'Farm team' : 'Investor communication'} title="Messages"
        intro={side === 'investor' ? 'Conversations with the farm team and investor relations.' : 'Reply to investors. Replies appear in the investor view immediately.'}
        actions={<>
          <Badge tone="neutral" dot={false}>Simulated messaging</Badge>
          {side === 'investor' && <Button size="sm" icon={<Plus size={15} />} onClick={() => setNewOpen(true)}>New message</Button>}
        </>} />

      <div className="card grid h-[calc(100svh-260px)] min-h-[520px] overflow-hidden md:grid-cols-[320px_1fr] lg:h-[calc(100svh-230px)]">
        {/* Conversation list */}
        <div className={cx('flex min-h-0 flex-col border-r border-line', active && 'hidden md:flex')}>
          <div className="border-b border-line p-3">
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sage" />
              <Input id={`msg-search-${side}`} aria-label="Search conversations" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search conversations" className="h-9 py-0 pl-9 text-[13px]" />
            </div>
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto">
            {convs.length === 0 && <li className="p-6 text-center text-[13px] text-sage">No conversations found.</li>}
            {convs.map((c) => {
              const last = c.messages[c.messages.length - 1];
              const who = counterpart(c);
              const unread = unreadOf(c);
              return (
                <li key={c.id}>
                  <Link to={`${base}/${c.id}`} className={cx('flex gap-3 border-b border-line px-4 py-3.5 transition', c.id === id ? 'bg-pale' : 'hover:bg-canvas')}>
                    <Avatar initials={who.initials} src={(who as any).avatar} size={36} dark={side === 'investor'} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className={cx('truncate text-[13.5px]', unread ? 'font-extrabold text-ink' : 'font-semibold text-ink')}>{who.name}</span>
                        <span className="shrink-0 text-[11px] text-sage">{relative(last.at)}</span>
                      </div>
                      <div className={cx('truncate text-[12.5px]', unread ? 'font-semibold text-ink' : 'text-body')}>{c.subject}</div>
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[12px] text-sage">{last.from === (side === 'investor' ? 'investor' : 'team') ? 'You: ' : ''}{last.text}</span>
                        {unread > 0 && <span className="ml-auto flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-agri px-1 text-[10px] font-bold text-white tnum">{unread}</span>}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Thread */}
        <div className={cx('min-h-0 flex-col', active ? 'flex' : 'hidden md:flex')}>
          {active ? <Thread c={active} side={side} base={base} who={counterpart(active)}
            onSend={(t, a) => { sendMessage(active.id, side, t, a); if (side === 'team') toast({ title: 'Reply sent', body: 'Visible now in the investor view.' }); }} />
            : <div className="flex flex-1 items-center justify-center p-8"><Empty title="Select a conversation" body="Choose a conversation from the list to read and reply." /></div>}
        </div>
      </div>

      {side === 'investor' && (
        <NewConversation open={newOpen} onClose={() => setNewOpen(false)} onCreate={(s, p, t) => {
          const cid = startConversation(s, p || undefined, t);
          setNewOpen(false); toast({ title: 'Message sent', body: 'Investor relations will reply here.' }); navigate(`${base}/${cid}`);
        }} />
      )}
    </div>
  );
}

function Thread({ c, side, base, who, onSend }: { c: Conversation; side: 'investor' | 'team'; base: string; who: { name: string; sub: string; initials: string }; onSend: (t: string, a?: string) => void }) {
  const { state } = useDemo();
  const [text, setText] = useState('');
  const [file, setFile] = useState<string | undefined>();
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const project = state.projects.find((p) => p.id === c.projectId);
  const mine = side === 'investor' ? 'investor' : 'team';
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [c.messages.length, c.id]);
  const send = () => { if (!text.trim() && !file) return; onSend(text.trim() || 'Shared an attachment', file); setText(''); setFile(undefined); };

  // group by day
  let lastDay = '';
  return (
    <>
      <div className="flex items-center gap-3 border-b border-line px-4 py-3 sm:px-5">
        <Link to={base} className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded hover:bg-mist md:hidden" aria-label="Back to conversations"><ArrowLeft size={18} /></Link>
        <Avatar initials={who.initials} size={36} dark={side === 'investor'} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-bold text-ink">{c.subject}</div>
          <div className="truncate text-[12px] text-sage">{who.name} · {who.sub}</div>
        </div>
        {project && (
          <Link to={side === 'investor' ? `/portal/investments/${state.investments.find((i) => i.investorId === c.investorId && i.projectId === project.id)?.id}` : `/admin/projects/${project.id}`}
            className="hidden items-center gap-1.5 rounded border border-[#C0D20D]/50 bg-pale px-2.5 py-1 text-[11.5px] font-semibold text-ink hover:border-ink/30 sm:inline-flex">
            <Leaf size={12} className="text-agri" />{project.name}
          </Link>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto bg-canvas px-4 py-5 sm:px-6">
        <div className="space-y-3">
          {c.messages.map((m) => {
            const day = fmtDate(m.at);
            const showDay = day !== lastDay; lastDay = day;
            const me = m.from === mine;
            return (
              <div key={m.id}>
                {showDay && <div className="my-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-label text-sage"><span className="h-px flex-1 bg-line" />{day}<span className="h-px flex-1 bg-line" /></div>}
                <div className={cx('flex', me ? 'justify-end' : 'justify-start')}>
                  <div className={cx('max-w-[85%] sm:max-w-[70%]')}>
                    <div className={cx('rounded-lg px-4 py-2.5 text-[14px] leading-relaxed', me ? 'rounded-br-sm bg-ink text-canvas' : 'rounded-bl-sm border border-line bg-white text-ink')}>
                      {m.text}
                      {m.attachment && (
                        <div className={cx('mt-2 flex items-center gap-2 rounded px-2.5 py-2 text-[12px] font-semibold', me ? 'bg-white/10' : 'bg-mist')}>
                          <FileText size={14} /><span className="truncate">{m.attachment}</span>
                        </div>
                      )}
                    </div>
                    <div className={cx('mt-1 px-1 text-[11px] text-sage', me && 'text-right')}>{me ? 'You' : m.author} · {fmtTime(m.at)}</div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
      </div>
      <div className="border-t border-line bg-white p-3 sm:p-4">
        {file && (
          <div className="mb-2 inline-flex items-center gap-2 rounded bg-mist px-2.5 py-1.5 text-[12px] font-semibold text-ink">
            <FileText size={13} />{file}<button onClick={() => setFile(undefined)} aria-label="Remove attachment" className="text-sage hover:text-ink"><X size={13} /></button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <input ref={fileRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f.name); e.target.value = ''; }} />
          <button onClick={() => fileRef.current?.click()} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded text-sage hover:bg-mist hover:text-ink" aria-label="Attach a file (demo)" title="Attach a file (demo: the file is not uploaded)"><Paperclip size={18} /></button>
          <label htmlFor={`composer-${side}`} className="sr-only">Message</label>
          <textarea id={`composer-${side}`} value={text} onChange={(e) => setText(e.target.value)} rows={1}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={side === 'investor' ? `Message ${c.teamMember}` : 'Write a reply to the investor'}
            className="field-input max-h-36 min-h-[40px] flex-1 resize-none py-2" />
          <Button onClick={send} disabled={!text.trim() && !file} className="h-10 shrink-0" icon={<Send size={15} />}><span className="hidden sm:inline">Send</span></Button>
        </div>
        <p className="mt-2 text-[11px] text-sage">Simulated messaging · attachments show the file name only and are not uploaded.</p>
      </div>
    </>
  );
}

function NewConversation({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (subject: string, projectId: string, text: string) => void }) {
  const { state } = useDemo();
  const myProjects = state.projects.filter((p) => state.investments.some((i) => i.investorId === state.investorId && i.projectId === p.id));
  const [s, setS] = useState(''); const [p, setP] = useState(''); const [t, setT] = useState('');
  const [errs, setErrs] = useState<{ s?: string; t?: string }>({});
  const submit = () => {
    const e: typeof errs = {};
    if (s.trim().length < 3) e.s = 'Add a short subject.';
    if (t.trim().length < 5) e.t = 'Write a message of at least 5 characters.';
    setErrs(e); if (Object.keys(e).length) return;
    onCreate(s.trim(), p, t.trim()); setS(''); setP(''); setT('');
  };
  return (
    <Modal open={open} onClose={onClose} title="New message" eyebrow="To investor relations"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={submit} icon={<Send size={15} />}>Send message</Button></>}>
      <div className="space-y-4">
        <Field id="nm-subject" label="Subject" error={errs.s}><Input id="nm-subject" value={s} onChange={(e) => setS(e.target.value)} invalid={!!errs.s} placeholder="What is this about?" /></Field>
        <Field id="nm-project" label="Related project (optional)">
          <Select id="nm-project" value={p} onChange={(e) => setP(e.target.value)}><option value="">No specific project</option>{myProjects.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</Select>
        </Field>
        <Field id="nm-text" label="Message" error={errs.t}><Textarea id="nm-text" value={t} onChange={(e) => setT(e.target.value)} invalid={!!errs.t} /></Field>
      </div>
    </Modal>
  );
}

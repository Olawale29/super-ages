import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Images, PlayCircle, Send } from 'lucide-react';
import type { FarmUpdate, Project } from '../../data/types';
import { cx, fmtDate, relative } from '../../lib/format';
import { Photo } from './Photo';
import { Lightbox } from './Overlay';
import { Badge, Textarea } from './Bits';
import { Button } from './Button';
import { DemoTag } from './Brand';

/** Editorial update card used in the journal feed. */
export function UpdateCard({ u, project, to, variant = 'stack', className }: { u: FarmUpdate; project?: Project; to: string; variant?: 'stack' | 'row' | 'feature'; className?: string }) {
  if (variant === 'row') {
    return (
      <Link to={to} className={cx('group grid grid-cols-[88px_1fr] gap-4 py-4 sm:grid-cols-[120px_1fr]', className)}>
        <Photo src={u.cover} className="zoom-img aspect-[4/3] w-full rounded-sm" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 text-[11px] font-semibold uppercase tracking-label text-sage">
            <span className="text-agri">{u.category}</span><span>·</span><span className="tnum">{fmtDate(u.date)}</span>
          </div>
          <h3 className="mt-1 line-clamp-2 text-[14.5px] font-bold leading-snug text-ink group-hover:text-agri">{u.title}</h3>
          {project && <div className="mt-1 truncate text-[12px] text-sage">{project.name}</div>}
        </div>
      </Link>
    );
  }
  return (
    <Link to={to} className={cx('group block', className)}>
      <Photo src={u.cover} className={cx('zoom-img w-full rounded-sm', variant === 'feature' ? 'aspect-[16/10]' : 'aspect-[4/3]')} />
      <div className="mt-4 flex flex-wrap items-center gap-x-2 text-[11px] font-semibold uppercase tracking-label text-sage">
        <span className="text-agri">{u.category}</span><span>·</span><span className="tnum">{fmtDate(u.date)}</span>
        {project && <><span>·</span><span className="normal-case tracking-normal">{project.name}</span></>}
      </div>
      <h3 className={cx('display mt-2 text-ink transition-colors group-hover:text-agri', variant === 'feature' ? 'text-[30px] sm:text-[38px]' : 'text-[24px] leading-[1.08]')}>{u.title}</h3>
      <p className="mt-2 line-clamp-3 max-w-[60ch] text-[14px] leading-relaxed text-body">{u.excerpt}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-ink">View details <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
    </Link>
  );
}

/** Full article: cover, body, gallery with lightbox, video placeholder, milestone link and comments. */
export function UpdateArticle({ u, project, milestoneTitle, onComment, showComments = true, backLink }: {
  u: FarmUpdate; project?: Project; milestoneTitle?: string; onComment?: (text: string) => void; showComments?: boolean; backLink?: React.ReactNode;
}) {
  const [lb, setLb] = useState<number | null>(null);
  const lbImages = u.gallery.includes(u.cover) ? u.gallery : [u.cover, ...u.gallery];
  const offset = lbImages.length - u.gallery.length;
  const [text, setText] = useState('');
  const [err, setErr] = useState('');
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 2) { setErr('Write a short comment before posting.'); return; }
    onComment?.(text.trim()); setText(''); setErr('');
  };
  return (
    <article>
      {backLink}
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="green">{u.category}</Badge>
        {u.status === 'Draft' && <Badge tone="attn">Draft preview</Badge>}
        <DemoTag className="ml-1" />
      </div>
      <h1 className="display mt-4 max-w-[22ch] text-[40px] text-ink sm:text-[56px]">{u.title}</h1>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-line py-3.5 text-[13px] text-body">
        <span><span className="text-sage">Published </span><span className="font-semibold tnum">{fmtDate(u.date, true)}</span></span>
        {project && <span><span className="text-sage">Project </span><span className="font-semibold">{project.name}</span></span>}
        <span><span className="text-sage">By </span><span className="font-semibold">{u.author}</span><span className="text-sage">, {u.authorRole}</span></span>
        <span className="text-sage tnum">{u.readMins} min read</span>
      </div>

      <button onClick={() => setLb(lbImages.indexOf(u.cover))} className="mt-7 block w-full text-left" aria-label="Open cover photograph">
        <Photo src={u.cover} className="aspect-[16/9] w-full rounded-sm" eager />
      </button>

      <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-5 text-[16.5px] leading-[1.75] text-body">
          <p className="text-[19px] leading-relaxed text-ink">{u.excerpt}</p>
          {u.body.map((p, i) => <p key={i} className="max-w-[66ch]">{p}</p>)}
        </div>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {milestoneTitle && (
            <div className="rounded-md border border-[#C0D20D]/40 bg-pale p-4">
              <div className="eyebrow">Related milestone</div>
              <div className="mt-1.5 text-[14px] font-bold text-ink">{milestoneTitle}</div>
              {project && <div className="mt-0.5 text-[12.5px] text-body">{project.name}</div>}
              {u.milestoneDate && <div className="mt-2 text-[12px] font-semibold text-ink tnum">Milestone date: {fmtDate(u.milestoneDate)}</div>}
            </div>
          )}
          <div className="rounded-md border border-line bg-white p-4">
            <div className="eyebrow">Farm manager</div>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-[12px] font-bold text-lime">{u.author.split(' ').map((x) => x[0]).join('').slice(0, 2)}</span>
              <div><div className="text-[13.5px] font-bold text-ink">{u.author}</div><div className="text-[12px] text-sage">{u.authorRole}</div></div>
            </div>
          </div>
        </aside>
      </div>

      {u.gallery.length > 0 && (
        <section className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-label text-ink"><Images size={15} /> Photo gallery</h2>
            <span className="text-[12px] text-sage tnum">{u.gallery.length} photographs</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {u.gallery.map((g, i) => (
              <button key={i} onClick={() => setLb(i + offset)} className={cx('zoom-img group relative overflow-hidden rounded-sm', i === 0 && 'col-span-2 row-span-2')} aria-label={`Open photograph ${i + 1}`}>
                <Photo src={g} className={cx('w-full', i === 0 ? 'aspect-square sm:aspect-auto sm:h-full' : 'aspect-square')} />
              </button>
            ))}
          </div>
        </section>
      )}

      {u.video && (
        <section className="mt-10">
          <div className="relative overflow-hidden rounded-sm">
            <Photo src={u.gallery[1] ?? u.cover} className="aspect-[21/9] w-full" />
            <div className="absolute inset-0 flex items-center justify-center bg-ink/45">
              <div className="flex flex-col items-center text-center text-canvas">
                <PlayCircle size={52} strokeWidth={1.2} />
                <div className="mt-3 text-[15px] font-semibold">{u.video.title}</div>
                <div className="mt-1 text-[12px] text-canvas/70">Video placeholder · {u.video.duration} · playback added with real farm footage</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {showComments && (
        <section className="mt-12 border-t border-line pt-8">
          <h2 className="display text-[28px] text-ink">Comments <span className="text-sage tnum">{u.comments.length}</span></h2>
          <ul className="mt-5 space-y-5">
            {u.comments.length === 0 && <li className="text-[14px] text-sage">No comments yet. Questions about this update go straight to the farm team.</li>}
            {u.comments.map((c) => (
              <li key={c.id} className="flex gap-3">
                <span className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold', c.role === 'team' ? 'bg-ink text-lime' : 'bg-pale text-ink ring-1 ring-[#C0D20D]/50')}>
                  {c.author.split(' ').map((x) => x[0]).join('').slice(0, 2)}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2"><span className="text-[13.5px] font-bold text-ink">{c.author}</span>{c.role === 'team' && <Badge tone="green" dot={false}>Farm team</Badge>}<span className="text-[12px] text-sage">{relative(c.at)}</span></div>
                  <p className="mt-1 text-[14px] leading-relaxed text-body">{c.text}</p>
                </div>
              </li>
            ))}
          </ul>
          {onComment && (
            <form onSubmit={submit} className="mt-6 rounded-md border border-line bg-white p-4" noValidate>
              <label htmlFor="comment" className="field-label">Add a comment</label>
              <Textarea id="comment" value={text} onChange={(e) => setText(e.target.value)} invalid={!!err} placeholder="Ask the farm team a question about this update" className="min-h-[84px]" />
              {err && <p id="comment-err" className="mt-1.5 text-[12px] font-medium text-danger">{err}</p>}
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-[11.5px] text-sage">Simulated: comments are stored in this browser only.</span>
                <Button type="submit" size="sm" icon={<Send size={14} />}>Post comment</Button>
              </div>
            </form>
          )}
        </section>
      )}
      <Lightbox images={lbImages} index={lb} onClose={() => setLb(null)} onIndex={setLb} />
    </article>
  );
}

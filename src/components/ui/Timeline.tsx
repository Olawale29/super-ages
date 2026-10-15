import { Check, AlertTriangle } from 'lucide-react';
import type { Milestone } from '../../data/types';
import { cx, fmtDate } from '../../lib/format';
import { Badge, milestoneMeta } from './Bits';

/**
 * Vertical agricultural timeline. Confirmed events use solid markers and dates;
 * expected milestones use open markers and an "Expected" date label.
 */
export function Timeline({ milestones, compact = false }: { milestones: Milestone[]; compact?: boolean }) {
  return (
    <ol className="relative">
      {milestones.map((m, i) => {
        const last = i === milestones.length - 1;
        const done = m.state === 'completed';
        return (
          <li key={m.id} className={cx('relative grid grid-cols-[28px_1fr] gap-x-4', !last && (compact ? 'pb-5' : 'pb-7'))}>
            {!last && <span aria-hidden className={cx('absolute left-[13px] top-7 bottom-0 w-px', done ? 'bg-agri/50' : 'bg-line [background-image:repeating-linear-gradient(to_bottom,#C9D3C8_0_4px,transparent_4px_8px)] bg-transparent')} />}
            <span aria-hidden className={cx('relative z-[1] mt-0.5 flex h-7 w-7 items-center justify-center rounded-full',
              done && 'bg-agri text-white',
              m.state === 'in_progress' && 'bg-lime text-ink ring-4 ring-pale',
              m.state === 'upcoming' && 'border-[1.5px] border-dashed border-sage/60 bg-white',
              m.state === 'attention' && 'bg-[#FBF1E4] text-attn ring-1 ring-attn/40')}>
              {done ? <Check size={14} strokeWidth={3} /> : m.state === 'attention' ? <AlertTriangle size={13} strokeWidth={2.5} /> : m.state === 'in_progress' ? <span className="h-2 w-2 rounded-full bg-ink" /> : null}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h4 className={cx('text-[14.5px] font-bold', m.state === 'upcoming' ? 'text-body' : 'text-ink')}>{m.title}</h4>
                <span className="text-[12px] font-medium text-sage tnum">{m.confirmed ? fmtDate(m.date) : `Expected ${fmtDate(m.date)}`}</span>
              </div>
              {!compact && <p className="mt-1 max-w-[60ch] text-[13.5px] leading-relaxed text-body">{m.note}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge tone={milestoneMeta[m.state].tone}>{milestoneMeta[m.state].label}</Badge>
                {!m.confirmed && <span className="text-[11px] font-semibold uppercase tracking-label text-sage">Expected</span>}
                {m.metric && <span className="rounded-[4px] bg-mist px-2 py-[3px] text-[11.5px] font-semibold text-body tnum">{m.metric}</span>}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

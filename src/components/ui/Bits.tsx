import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { cx } from '../../lib/format';
import type { DecisionStatus, MilestoneState, ProjectStatus } from '../../data/types';

/* ---------- Status indicators ---------- */
type Tone = 'green' | 'lime' | 'neutral' | 'attn' | 'ink' | 'danger';
const toneCls: Record<Tone, string> = {
  green: 'bg-agri/10 text-[#0F6B3D] ring-agri/20',
  lime: 'bg-pale text-ink ring-[#C0D20D]/50',
  neutral: 'bg-mist text-body ring-line',
  attn: 'bg-[#FBF1E4] text-attn ring-attn/25',
  ink: 'bg-ink text-canvas ring-ink',
  danger: 'bg-danger/5 text-danger ring-danger/20',
};
const dotCls: Record<Tone, string> = { green: 'bg-agri', lime: 'bg-lime', neutral: 'bg-sage', attn: 'bg-attn', ink: 'bg-lime', danger: 'bg-danger' };

export function Badge({ tone = 'neutral', children, className, dot = true }: { tone?: Tone; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 whitespace-nowrap rounded-[4px] px-2 py-[3px] text-[11.5px] font-semibold ring-1 ring-inset', toneCls[tone], className)}>
      {dot && <span className={cx('h-1.5 w-1.5 rounded-full', dotCls[tone])} />}
      {children}
    </span>
  );
}

export const projectTone = (s: ProjectStatus | string): Tone =>
  s === 'Approaching harvest' || s === 'Awaiting decision' ? 'lime' : s === 'Active' ? 'green' : s === 'On hold' ? 'attn' : 'neutral';

export const decisionMeta: Record<DecisionStatus, { label: string; tone: Tone }> = {
  awaiting_instruction: { label: 'Awaiting your instruction', tone: 'attn' },
  submitted: { label: 'Instruction submitted', tone: 'lime' },
  under_review: { label: 'Under review', tone: 'neutral' },
  acknowledged: { label: 'Acknowledged by farm team', tone: 'green' },
  completed: { label: 'Completed', tone: 'ink' },
};
export const decisionAdminLabel: Record<DecisionStatus, string> = {
  awaiting_instruction: 'Awaiting investor', submitted: 'New', under_review: 'Under review', acknowledged: 'Acknowledged', completed: 'Completed',
};

export const milestoneMeta: Record<MilestoneState, { label: string; tone: Tone }> = {
  completed: { label: 'Completed', tone: 'green' },
  in_progress: { label: 'In progress', tone: 'lime' },
  upcoming: { label: 'Upcoming', tone: 'neutral' },
  attention: { label: 'Attention required', tone: 'attn' },
};

/* ---------- Typography ---------- */
export function SectionHeading({ eyebrow, title, intro, className, align = 'left', size = 'lg', id }: {
  eyebrow?: ReactNode; title: ReactNode; intro?: ReactNode; className?: string; align?: 'left' | 'center'; size?: 'md' | 'lg' | 'xl'; id?: string;
}) {
  const sizes = { md: 'text-[32px] sm:text-[40px]', lg: 'text-[40px] sm:text-[54px] lg:text-[64px]', xl: 'text-[48px] sm:text-[68px] lg:text-[84px]' };
  return (
    <div className={cx(align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <div className={cx('eyebrow mb-4 flex items-center gap-3', align === 'center' && 'justify-center')}><span className="h-px w-8 bg-lime" aria-hidden />{eyebrow}</div>}
      <h2 id={id} className={cx('display text-ink', sizes[size])}>{title}</h2>
      {intro && <p className={cx('mt-5 max-w-[56ch] text-[16px] leading-relaxed text-body', align === 'center' && 'mx-auto')}>{intro}</p>}
    </div>
  );
}

export function PageTitle({ eyebrow, title, intro, actions }: { eyebrow?: ReactNode; title: ReactNode; intro?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
        <h1 className="display text-[36px] text-ink sm:text-[44px]">{title}</h1>
        {intro && <p className="mt-2 max-w-[62ch] text-[14.5px] text-body">{intro}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/* ---------- Form fields ---------- */
export function Field({ label, error, hint, children, id, className }: { label: string; error?: string; hint?: string; children: ReactNode; id: string; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">{label}</label>
      {children}
      {error ? <p id={`${id}-err`} className="mt-1.5 text-[12px] font-medium text-danger">{error}</p> : hint ? <p className="mt-1.5 text-[12px] text-sage">{hint}</p> : null}
    </div>
  );
}
export const Input = ({ invalid, className, ...p }: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) =>
  <input aria-invalid={invalid || undefined} aria-describedby={invalid ? `${p.id}-err` : undefined} className={cx('field-input', className)} {...p} />;
export const Textarea = ({ invalid, className, ...p }: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) =>
  <textarea aria-invalid={invalid || undefined} aria-describedby={invalid ? `${p.id}-err` : undefined} className={cx('field-input min-h-[110px] resize-y leading-relaxed', className)} {...p} />;
export const Select = ({ invalid, className, children, ...p }: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) => (
  <select aria-invalid={invalid || undefined} className={cx('field-input appearance-none bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-9', className)}
    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23798179' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }} {...p}>
    {children}
  </select>
);

export function Toggle({ checked, onChange, label, description, id }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string; id: string }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div className="min-w-0">
        <label htmlFor={id} className="text-[14px] font-semibold text-ink">{label}</label>
        {description && <p className="mt-0.5 text-[13px] text-sage">{description}</p>}
      </div>
      <button id={id} role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={cx('relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-agri' : 'bg-line')}>
        <span className={cx('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
      </button>
    </div>
  );
}

/* ---------- Empty state ---------- */
export function Empty({ title, body, action, icon }: { title: string; body?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-line bg-white/60 px-6 py-14 text-center">
      {icon && <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-pale text-agri">{icon}</div>}
      <h3 className="display text-[24px] text-ink">{title}</h3>
      {body && <p className="mt-1.5 max-w-sm text-[13.5px] text-sage">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ---------- Stat ---------- */
export function Stat({ label, value, sub, className }: { label: string; value: ReactNode; sub?: ReactNode; className?: string }) {
  return (
    <div className={cx('min-w-0', className)}>
      <div className="eyebrow">{label}</div>
      <div className="display mt-2 text-[34px] leading-none text-ink tnum sm:text-[40px]">{value}</div>
      {sub && <div className="mt-2 text-[12.5px] text-sage">{sub}</div>}
    </div>
  );
}

export function Tabs<T extends string>({ value, onChange, options, className }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; count?: number }[]; className?: string }) {
  return (
    <div className={cx('scroll-x no-scrollbar -mx-1 flex gap-1 px-1', className)} role="tablist">
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={value === o.value} onClick={() => onChange(o.value)}
          className={cx('inline-flex h-9 shrink-0 items-center gap-2 rounded px-3.5 text-[13px] font-semibold transition',
            value === o.value ? 'bg-ink text-canvas' : 'text-body hover:bg-mist')}>
          {o.label}
          {o.count !== undefined && <span className={cx('tnum text-[11px]', value === o.value ? 'text-lime' : 'text-sage')}>{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

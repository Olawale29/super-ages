import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, ChevronLeft, ChevronRight, Info, X, AlertCircle } from 'lucide-react';
import { cx } from '../../lib/format';
import { useDemo } from '../../store/DemoStore';
import { Photo } from './Photo';
import type { ImageRef } from '../../data/types';
import { photos, type PhotoKey } from '../../data/images';

function useLockScroll(open: boolean) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);
}

/** Accessible modal: full-width sheet on phones, centred dialog on larger screens. */
export function Modal({ open, onClose, title, eyebrow, children, footer, size = 'md' }: {
  open: boolean; onClose: () => void; title: ReactNode; eyebrow?: ReactNode; children: ReactNode; footer?: ReactNode; size?: 'sm' | 'md' | 'lg';
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLockScroll(open);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => ref.current?.querySelector<HTMLElement>('[data-autofocus], input, textarea, select, button')?.focus(), 30);
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(t); };
  }, [open, onClose]);
  if (!open) return null;
  const widths = { sm: 'sm:max-w-md', md: 'sm:max-w-xl', lg: 'sm:max-w-3xl' };
  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}>
      <div className="absolute inset-0 animate-fade bg-ink/55" onClick={onClose} />
      <div ref={ref} className={cx('relative flex max-h-[92svh] w-full animate-slideup flex-col overflow-hidden rounded-t-lg bg-white sm:rounded-lg', widths[size])}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
          <div className="min-w-0">
            {eyebrow && <div className="eyebrow mb-1">{eyebrow}</div>}
            <h2 className="display text-[26px] leading-tight text-ink">{title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="-mr-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded text-sage hover:bg-mist hover:text-ink"><X size={18} /></button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line bg-canvas px-5 py-3.5 sm:px-6">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

export function Toasts() {
  const { toasts, dismissToast } = useDemo();
  return createPortal(
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
      style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom, 0px))' }} aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex w-full max-w-sm animate-slideup items-start gap-3 rounded-md border border-ink/10 bg-ink px-4 py-3.5 text-canvas shadow-[0_12px_40px_-12px_rgba(8,19,8,.45)]">
          <span className="mt-0.5 shrink-0">{t.tone === 'error' ? <AlertCircle size={17} className="text-[#F3A99F]" /> : t.tone === 'info' ? <Info size={17} className="text-botanical" /> : <CheckCircle2 size={17} className="text-lime" />}</span>
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-semibold">{t.title}</div>
            {t.body && <div className="mt-0.5 text-[12.5px] leading-snug text-canvas/70">{t.body}</div>}
          </div>
          <button onClick={() => dismissToast(t.id)} aria-label="Dismiss" className="-mr-1 text-canvas/50 hover:text-canvas"><X size={15} /></button>
        </div>
      ))}
    </div>,
    document.body,
  );
}

export function Lightbox({ images, index, onClose, onIndex }: { images: ImageRef[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  const open = index !== null;
  useLockScroll(open);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex(((index ?? 0) + 1) % images.length);
      if (e.key === 'ArrowLeft') onIndex(((index ?? 0) - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index, images.length, onClose, onIndex]);
  if (!open) return null;
  const cur = images[index!];
  const caption = photos[cur as PhotoKey]?.caption ?? 'Uploaded photograph';
  return createPortal(
    <div className="fixed inset-0 z-[85] flex animate-fade flex-col bg-ink/95 text-canvas" role="dialog" aria-modal="true" aria-label="Photo viewer">
      <div className="flex items-center justify-between gutter py-4" style={{ paddingTop: 'max(16px, env(safe-area-inset-top, 0px))' }}>
        <span className="text-[12px] tracking-wide text-canvas/70 tnum">{index! + 1} / {images.length} · {caption}</span>
        <button onClick={onClose} aria-label="Close photo viewer" className="inline-flex h-10 w-10 items-center justify-center rounded hover:bg-white/10"><X size={20} /></button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center gutter pb-4">
        <Photo key={String(cur)} src={cur} className="h-full max-h-[78svh] w-full max-w-5xl rounded" imgClassName="!object-contain bg-ink" eager />
        {images.length > 1 && <>
          <button onClick={() => onIndex((index! - 1 + images.length) % images.length)} aria-label="Previous photo" className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 hover:bg-ink sm:left-6"><ChevronLeft /></button>
          <button onClick={() => onIndex((index! + 1) % images.length)} aria-label="Next photo" className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 hover:bg-ink sm:right-6"><ChevronRight /></button>
        </>}
      </div>
      <div className="flex justify-center gap-2 overflow-x-auto gutter pb-5 no-scrollbar" style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom, 0px))' }}>
        {images.map((im, i) => (
          <button key={i} onClick={() => onIndex(i)} aria-label={`Photo ${i + 1}`} className={cx('shrink-0 overflow-hidden rounded-sm ring-2 transition', i === index ? 'ring-lime' : 'ring-transparent opacity-60 hover:opacity-100')}>
            <Photo src={im} className="h-12 w-16" />
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}

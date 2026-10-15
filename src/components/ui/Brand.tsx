import logo from '../../assets/logo.png';
import mark from '../../assets/logo-mark.png';
import { cx } from '../../lib/format';

/**
 * Official Super Ages logo (cropped from the supplied asset, colours and
 * proportions untouched). On dark or photographic grounds it sits on a
 * soft-white plate so the dark wordmark stays legible without recolouring it.
 */
export function Logo({ className, plate = false, height = 44 }: { className?: string; plate?: boolean; height?: number }) {
  const img = <img src={logo} alt="Super Ages" style={{ height }} className="block w-auto select-none" draggable={false} />;
  if (!plate) return <span className={cx('inline-block', className)}>{img}</span>;
  return <span className={cx('inline-flex rounded-[4px] bg-canvas px-2.5 py-2', className)}>{img}</span>;
}

export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return <img src={mark} alt="" aria-hidden style={{ height: size }} className={cx('block w-auto select-none', className)} draggable={false} />;
}

export function DemoTag({ className, children = 'Illustrative demo content' }: { className?: string; children?: React.ReactNode }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-label text-sage', className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden />
      {children}
    </span>
  );
}

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cx } from '../../lib/format';

type Variant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'light' | 'outlineLight' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base = 'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-45 select-none';
const variants: Record<Variant, string> = {
  primary: 'bg-agri text-white hover:bg-agri-dark',
  secondary: 'border border-line bg-white text-ink hover:border-ink/30 hover:bg-mist',
  ghost: 'text-ink hover:bg-mist',
  dark: 'bg-ink text-canvas hover:bg-ink/90',
  light: 'bg-canvas text-ink hover:bg-white',
  outlineLight: 'border border-white/45 text-white hover:bg-white/10 hover:border-white/70',
  danger: 'border border-danger/30 bg-white text-danger hover:bg-danger/5',
};
const sizes: Record<Size, string> = {
  sm: 'h-8 rounded px-3 text-[12.5px]',
  md: 'h-10 rounded px-4 text-[13.5px]',
  lg: 'h-12 rounded px-6 text-[14px] tracking-[0.01em]',
};

export const btn = (variant: Variant = 'primary', size: Size = 'md', className?: string) => cx(base, variants[variant], sizes[size], className);

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; icon?: ReactNode }>(
  ({ variant = 'primary', size = 'md', className, icon, children, type = 'button', ...rest }, ref) => (
    <button ref={ref} type={type} className={btn(variant, size, className)} {...rest}>{icon}{children}</button>
  ),
);

export function ButtonLink({ variant = 'primary', size = 'md', className, icon, children, ...rest }: LinkProps & { variant?: Variant; size?: Size; icon?: ReactNode }) {
  return <Link className={btn(variant, size, className)} {...rest}>{children}{icon}</Link>;
}

export function IconButton({ label, className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button type="button" aria-label={label} title={label} className={cx('inline-flex h-9 w-9 items-center justify-center rounded text-ink transition hover:bg-mist', className)} {...rest}>
      {children}
    </button>
  );
}

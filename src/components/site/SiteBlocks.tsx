import { useState } from 'react';
import { CheckCircle2, LayoutDashboard, Leaf, Bell, FileText, MessageSquare, Sprout, Wheat } from 'lucide-react';
import { Field, Input, Select, Textarea } from '../ui/Bits';
import { Button } from '../ui/Button';
import { LogoMark } from '../ui/Brand';
import { Photo } from '../ui/Photo';
import { useDemo } from '../../store/DemoStore';
import { naira } from '../../lib/format';

/* ---------------- Investor enquiry form (validated, simulated submission) ---------------- */
type Form = { name: string; email: string; phone: string; interest: string; message: string };
const empty: Form = { name: '', email: '', phone: '', interest: '', message: '' };

export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const [f, setF] = useState<Form>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const { toast } = useDemo();

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setF({ ...f, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: undefined });
  };
  const validate = () => {
    const e: typeof errors = {};
    if (f.name.trim().length < 2) e.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Enter a valid email address, for example name@company.com.';
    if (f.phone.replace(/[^\d]/g, '').length < 7) e.phone = 'Enter a phone number with at least 7 digits.';
    if (!f.interest) e.interest = 'Choose the area you are interested in.';
    if (f.message.trim().length < 10) e.message = 'Tell us a little more (at least 10 characters).';
    return e;
  };
  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) { document.getElementById(`enq-${Object.keys(e)[0]}`)?.focus(); return; }
    setState('sending');
    window.setTimeout(() => { setState('sent'); toast({ title: 'Enquiry received', body: 'Simulated: no message was sent in this demo.' }); }, 900);
  };

  if (state === 'sent') {
    return (
      <div className="flex min-h-[420px] flex-col items-start justify-center rounded-md border border-line bg-white p-8 sm:p-10">
        <CheckCircle2 className="text-agri" size={36} strokeWidth={1.6} />
        <h3 className="display mt-5 text-[34px] text-ink">Thank you, {f.name.split(' ')[0]}.</h3>
        <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-body">
          Your enquiry about <strong className="text-ink">{f.interest.toLowerCase()}</strong> has been recorded. In the live website, our investor relations team would reply to {f.email} within two working days.
        </p>
        <p className="mt-4 text-[12px] text-sage">This is a demonstration. Nothing has been sent.</p>
        <Button variant="secondary" className="mt-7" onClick={() => { setF(empty); setState('idle'); }}>Send another enquiry</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-md border border-line bg-white p-6 sm:p-8">
      <div className={compact ? 'grid gap-5' : 'grid gap-5 sm:grid-cols-2'}>
        <Field id="enq-name" label="Full name" error={errors.name}><Input id="enq-name" autoComplete="name" value={f.name} onChange={set('name')} invalid={!!errors.name} placeholder="Your full name" /></Field>
        <Field id="enq-email" label="Email" error={errors.email}><Input id="enq-email" type="email" autoComplete="email" value={f.email} onChange={set('email')} invalid={!!errors.email} placeholder="name@company.com" /></Field>
        <Field id="enq-phone" label="Phone" error={errors.phone}><Input id="enq-phone" type="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} invalid={!!errors.phone} placeholder="+234" /></Field>
        <Field id="enq-interest" label="Agricultural interest" error={errors.interest}>
          <Select id="enq-interest" value={f.interest} onChange={set('interest')} invalid={!!errors.interest}>
            <option value="">Select an area</option>
            <option>Crop farming</option>
            <option>Livestock</option>
            <option>Harvest and production</option>
            <option>Farm operations and development</option>
            <option>Not sure yet</option>
          </Select>
        </Field>
        <Field id="enq-message" label="Message" error={errors.message} className={compact ? '' : 'sm:col-span-2'}>
          <Textarea id="enq-message" value={f.message} onChange={set('message')} invalid={!!errors.message} placeholder="What would you like to know about Super Ages?" />
        </Field>
      </div>
      <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[40ch] text-[12px] leading-snug text-sage">Demo form: your details stay in this browser and are not sent anywhere.</p>
        <Button type="submit" size="lg" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : 'Send enquiry'}</Button>
      </div>
    </form>
  );
}

/* ---------------- Investor dashboard preview (composed product shot) ---------------- */
export function DashboardPreview() {
  const nav = [LayoutDashboard, Leaf, Sprout, Wheat, MessageSquare, Bell, FileText];
  return (
    <div className="relative overflow-hidden rounded-lg border border-ink/10 bg-white shadow-[0_40px_80px_-40px_rgba(8,19,8,.35)]" aria-label="Preview of the investor dashboard" role="img">
      <div className="flex items-center gap-1.5 border-b border-line bg-canvas px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-line" /><span className="h-2.5 w-2.5 rounded-full bg-line" /><span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="ml-3 truncate rounded bg-white px-3 py-1 text-[10.5px] text-sage ring-1 ring-line">portal.superages · Investor dashboard</span>
      </div>
      <div className="grid grid-cols-[52px_1fr] sm:grid-cols-[60px_1fr]">
        <div className="flex flex-col items-center gap-4 border-r border-line bg-canvas py-5">
          <LogoMark size={22} />
          {nav.map((I, i) => <span key={i} className={i === 0 ? 'rounded bg-ink p-1.5 text-lime' : 'p-1.5 text-sage'}><I size={15} /></span>)}
        </div>
        <div className="min-w-0 p-4 sm:p-6">
          <div className="text-[9.5px] font-semibold uppercase tracking-label text-sage">Thursday 15 October</div>
          <div className="display mt-1 text-[24px] text-ink sm:text-[30px]">Good morning, Emmanuel.</div>
          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-4">
            {[['Contributed', naira(18_000_000, true)], ['Active', '4'], ['Monitored', '4 projects'], ['Upcoming', '5 milestones']].map(([l, v]) => (
              <div key={l} className="bg-white p-3"><div className="text-[9px] font-semibold uppercase tracking-label text-sage">{l}</div><div className="display mt-1 text-[20px] text-ink tnum">{v}</div></div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-[1.25fr_1fr]">
            <div className="rounded border border-[#C0D20D]/50 bg-pale p-4">
              <div className="flex items-center gap-2 text-[9.5px] font-semibold uppercase tracking-label text-ink"><span className="h-1.5 w-1.5 rounded-full bg-lime" />Harvest decision</div>
              <div className="display mt-1.5 text-[19px] leading-tight text-ink">Your crop is approaching harvest.</div>
              <div className="mt-1 text-[11px] text-body">Greenfield Maize, Cycle 04 · 10 – 24 Nov</div>
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                {['Sell produce', 'Store produce', 'Discuss options', 'Other'].map((o, i) => <span key={o} className={i === 0 ? 'rounded border border-agri bg-white px-2 py-1.5 text-[10.5px] font-semibold text-ink' : 'rounded border border-line bg-white/70 px-2 py-1.5 text-[10.5px] text-body'}>{o}</span>)}
              </div>
            </div>
            <div className="hidden overflow-hidden rounded border border-line sm:block">
              <Photo src="maizeCob" className="h-24 w-full" />
              <div className="p-3">
                <div className="text-[9px] font-semibold uppercase tracking-label text-agri">Harvest · 13 Oct</div>
                <div className="mt-1 text-[11.5px] font-bold leading-snug text-ink">Maize on Block A reaches maturity</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

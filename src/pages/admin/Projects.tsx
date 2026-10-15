import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Plus, Search } from 'lucide-react';
import { useDemo } from '../../store/DemoStore';
import { Badge, Empty, Field, Input, PageTitle, Select, Tabs, Textarea, milestoneMeta, projectTone } from '../../components/ui/Bits';
import { Button, ButtonLink } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Overlay';
import { Photo } from '../../components/ui/Photo';
import { Timeline } from '../../components/ui/Timeline';
import { photoKeys, photos } from '../../data/images';
import type { Category, Milestone, MilestoneState, Project, ProjectStatus } from '../../data/types';
import { cx, fmtDate, naira, uid } from '../../lib/format';

const STATUSES: ProjectStatus[] = ['Planning', 'Active', 'Approaching harvest', 'Harvested', 'Completed', 'On hold'];

export function Projects() {
  const { state } = useDemo();
  const navigate = useNavigate();
  const [cat, setCat] = useState<'All' | Category>('All');
  const [q, setQ] = useState('');
  const [creating, setCreating] = useState(false);
  const list = state.projects.filter((p) => (cat === 'All' || p.category === cat) && (!q || `${p.name} ${p.code}`.toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <PageTitle eyebrow="Operations" title="Projects" intro="Create and update projects, statuses and expected milestones. Changes appear in the investor view." actions={<Button icon={<Plus size={16} />} onClick={() => setCreating(true)}>New project</Button>} />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={cat} onChange={setCat} options={(['All', 'Crops', 'Livestock'] as const).map((c) => ({ value: c, label: c, count: c === 'All' ? state.projects.length : state.projects.filter((p) => p.category === c).length }))} />
        <div className="relative sm:w-72"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sage" /><Input id="ad-pr-q" aria-label="Search projects" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects" className="pl-9" /></div>
      </div>
      {list.length === 0 ? <Empty title="No projects match" action={<Button onClick={() => setCreating(true)}>Create a project</Button>} /> : (
        <div className="card overflow-hidden">
          <div className="scroll-x">
            <table className="w-full min-w-[820px] text-left text-[13.5px]">
              <thead className="border-b border-line bg-canvas text-[11px] uppercase tracking-label text-sage"><tr><th className="px-5 py-3.5 font-bold">Project</th><th className="px-4 py-3.5 font-bold">Category</th><th className="px-4 py-3.5 font-bold">Scale</th><th className="px-4 py-3.5 font-bold">Progress</th><th className="px-4 py-3.5 text-right font-bold">Recorded</th><th className="px-4 py-3.5 font-bold">Status</th></tr></thead>
              <tbody className="divide-y divide-line">
                {list.map((p) => {
                  const done = p.milestones.filter((m) => m.state === 'completed').length;
                  const total = state.investments.filter((i) => i.projectId === p.id).reduce((a, b) => a + b.amount, 0);
                  return (
                    <tr key={p.id} className="group cursor-pointer hover:bg-canvas" onClick={() => navigate(`/admin/projects/${p.id}`)}>
                      <td className="px-5 py-4"><div className="flex items-center gap-3"><Photo src={p.cover} className="h-11 w-14 shrink-0 rounded-sm" /><div><Link to={`/admin/projects/${p.id}`} onClick={(e) => e.stopPropagation()} className="font-bold text-ink group-hover:text-agri">{p.name}</Link><div className="text-[12px] text-sage">{p.code} · {p.manager}</div></div></div></td>
                      <td className="px-4 py-4"><div className="font-semibold text-ink">{p.category}</div><div className="text-[12px] text-sage">{p.enterprise}</div></td>
                      <td className="px-4 py-4 text-body">{p.area}</td>
                      <td className="px-4 py-4"><div className="flex items-center gap-2"><div className="h-1.5 w-24 overflow-hidden rounded-full bg-mist"><div className="h-full bg-agri" style={{ width: `${p.milestones.length ? (done / p.milestones.length) * 100 : 0}%` }} /></div><span className="text-[12px] text-sage tnum">{done}/{p.milestones.length}</span></div></td>
                      <td className="px-4 py-4 text-right font-semibold text-ink tnum">{naira(total)}</td>
                      <td className="px-4 py-4"><Badge tone={projectTone(p.status)}>{p.status}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ProjectForm open={creating} onClose={() => setCreating(false)} onSaved={(id) => navigate(`/admin/projects/${id}`)} />
    </div>
  );
}

export function ProjectAdmin() {
  const { id } = useParams();
  const { state, saveProject, toast } = useDemo();
  const [editing, setEditing] = useState(false);
  const [ms, setMs] = useState<Milestone | null>(null);
  const p = state.projects.find((x) => x.id === id);
  if (!p) return <Empty title="Project not found" action={<ButtonLink to="/admin/projects" variant="secondary">Back to projects</ButtonLink>} />;
  const invs = state.investments.filter((i) => i.projectId === p.id);
  const setStatus = (s: ProjectStatus) => { saveProject({ ...p, status: s }); toast({ title: 'Project status updated', body: `${p.name} is now “${s}”.` }); };
  const saveMilestone = (m: Milestone) => {
    const exists = p.milestones.some((x) => x.id === m.id);
    const milestones = (exists ? p.milestones.map((x) => x.id === m.id ? m : x) : [...p.milestones, m]).sort((a, b) => a.date.localeCompare(b.date));
    saveProject({ ...p, milestones }); setMs(null); toast({ title: exists ? 'Milestone updated' : 'Milestone added', body: 'Investors on this project will see the change.' });
  };
  return (
    <div>
      <Link to="/admin/projects" className="mb-6 inline-flex items-center gap-2 text-[13px] font-semibold text-sage hover:text-ink"><ArrowLeft size={15} /> Projects</Link>
      <div className="card overflow-hidden">
        <div className="grid md:grid-cols-[280px_1fr]">
          <Photo src={p.cover} className="aspect-[16/9] md:aspect-auto md:min-h-[220px]" />
          <div className="p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><div className="eyebrow">{p.code} · {p.category}</div><h1 className="display mt-1 text-[34px] leading-tight text-ink sm:text-[40px]">{p.name}</h1></div>
              <Button variant="secondary" size="sm" icon={<Pencil size={14} />} onClick={() => setEditing(true)}>Edit project</Button>
            </div>
            <p className="mt-2 max-w-[70ch] text-[14px] leading-relaxed text-body">{p.summary}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <label htmlFor="pa-status" className="text-[12.5px] font-semibold text-sage">Status</label>
              <Select id="pa-status" value={p.status} onChange={(e) => setStatus(e.target.value as ProjectStatus)} className="h-9 w-56 py-0">{STATUSES.map((s) => <option key={s}>{s}</option>)}</Select>
            </div>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
          {[['Enterprise', p.enterprise], ['Scale', p.area], ['Cycle', p.cycle], ['Harvest window', p.harvestWindow ?? 'n/a'], ['Site', p.site], ['Manager', p.manager]].map(([k, v]) => <div key={k} className="bg-white p-4"><dt className="eyebrow">{k}</dt><dd className="mt-1 text-[13px] font-semibold text-ink">{v}</dd></div>)}
        </dl>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-12">
        <section className="card xl:col-span-8">
          <div className="flex items-center justify-between border-b border-line px-6 py-4"><h2 className="text-[15px] font-bold text-ink">Milestones</h2><Button size="sm" variant="secondary" icon={<Plus size={14} />} onClick={() => setMs({ id: uid('m'), title: '', date: '2026-11-01', state: 'upcoming', confirmed: false, note: '' })}>Add milestone</Button></div>
          <ul className="divide-y divide-line">
            {p.milestones.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center gap-3 px-6 py-3.5">
                <div className="min-w-0 flex-1"><div className="text-[13.5px] font-bold text-ink">{m.title}</div><div className="text-[12px] text-sage tnum">{m.confirmed ? 'Confirmed' : 'Expected'} · {fmtDate(m.date)}</div></div>
                <Badge tone={milestoneMeta[m.state].tone}>{milestoneMeta[m.state].label}</Badge>
                <Button size="sm" variant="ghost" onClick={() => setMs(m)} icon={<Pencil size={13} />}>Edit</Button>
              </li>
            ))}
          </ul>
        </section>
        <aside className="space-y-6 xl:col-span-4">
          <section className="card p-6">
            <h2 className="text-[15px] font-bold text-ink">Investors on this project</h2>
            <ul className="mt-3 divide-y divide-line">
              {invs.map((x) => { const i = state.investors.find((y) => y.id === x.investorId)!; return <li key={x.id}><Link to={`/admin/investors/${i.id}`} className="flex justify-between gap-3 py-2.5 text-[13px] hover:text-agri"><span className="font-semibold text-ink">{i.firstName} {i.lastName}</span><span className="text-body tnum">{naira(x.amount)}</span></Link></li>; })}
              {!invs.length && <li className="py-2 text-[13px] text-sage">No investment records yet.</li>}
            </ul>
          </section>
          <section className="card p-6"><h2 className="mb-4 text-[15px] font-bold text-ink">Investor-facing preview</h2><Timeline milestones={p.milestones.slice(-4)} compact /></section>
        </aside>
      </div>

      <ProjectForm open={editing} project={p} onClose={() => setEditing(false)} />
      <MilestoneForm m={ms} onClose={() => setMs(null)} onSave={saveMilestone} onDelete={(mid) => { saveProject({ ...p, milestones: p.milestones.filter((x) => x.id !== mid) }); setMs(null); toast({ title: 'Milestone removed' }); }} isNew={!!ms && !p.milestones.some((x) => x.id === ms.id)} />
    </div>
  );
}

function ProjectForm({ open, onClose, project, onSaved }: { open: boolean; onClose: () => void; project?: Project; onSaved?: (id: string) => void }) {
  const { saveProject, toast } = useDemo();
  const blank: Project = { id: uid('p'), name: '', code: '', category: 'Crops', enterprise: '', status: 'Planning', site: 'Demo site', area: '', cycle: '', harvestWindow: '', summary: '', cover: 'cropRows', manager: 'Adaeze Nwosu', milestones: [] };
  const [f, setF] = useState<Project>(project ?? blank);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [lastOpen, setLastOpen] = useState(false);
  if (open !== lastOpen) { setLastOpen(open); if (open) { setF(project ?? { ...blank, id: uid('p') }); setErrs({}); } }
  const set = (k: keyof Project) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setF({ ...f, [k]: e.target.value }); setErrs({ ...errs, [k]: '' }); };
  const save = () => {
    const e: Record<string, string> = {};
    if (f.name.trim().length < 3) e.name = 'Give the project a name.';
    if (!f.code.trim()) e.code = 'Add a project code, for example SA-CR-08.';
    if (!f.enterprise.trim()) e.enterprise = 'Describe the enterprise, for example Maize (grain).';
    if (f.summary.trim().length < 10) e.summary = 'Add a short summary for investors.';
    setErrs(e); if (Object.keys(e).length) return;
    saveProject({ ...f, name: f.name.trim() }); onClose(); toast({ title: project ? 'Project updated' : 'Project created', body: f.name }); onSaved?.(f.id);
  };
  return (
    <Modal open={open} onClose={onClose} title={project ? 'Edit project' : 'New project'} eyebrow="Projects" size="lg"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={save}>{project ? 'Save changes' : 'Create project'}</Button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="pj-name" label="Project name" error={errs.name} className="sm:col-span-2"><Input id="pj-name" value={f.name} onChange={set('name')} invalid={!!errs.name} placeholder="e.g. Soybean Block C" /></Field>
        <Field id="pj-code" label="Code" error={errs.code}><Input id="pj-code" value={f.code} onChange={set('code')} invalid={!!errs.code} placeholder="SA-CR-08" /></Field>
        <Field id="pj-cat" label="Category"><Select id="pj-cat" value={f.category} onChange={set('category')}><option>Crops</option><option>Livestock</option></Select></Field>
        <Field id="pj-ent" label="Enterprise" error={errs.enterprise}><Input id="pj-ent" value={f.enterprise} onChange={set('enterprise')} invalid={!!errs.enterprise} placeholder="e.g. Soybean (grain)" /></Field>
        <Field id="pj-status" label="Status"><Select id="pj-status" value={f.status} onChange={set('status')}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</Select></Field>
        <Field id="pj-area" label="Scale"><Input id="pj-area" value={f.area} onChange={set('area')} placeholder="e.g. 30 ha or 500 birds" /></Field>
        <Field id="pj-cycle" label="Cycle"><Input id="pj-cycle" value={f.cycle} onChange={set('cycle')} placeholder="e.g. Mar – Aug 2027" /></Field>
        <Field id="pj-hw" label="Expected harvest window"><Input id="pj-hw" value={f.harvestWindow ?? ''} onChange={set('harvestWindow')} placeholder="Optional" /></Field>
        <Field id="pj-mgr" label="Farm manager"><Input id="pj-mgr" value={f.manager} onChange={set('manager')} /></Field>
        <Field id="pj-sum" label="Summary for investors" error={errs.summary} className="sm:col-span-2"><Textarea id="pj-sum" value={f.summary} onChange={set('summary')} invalid={!!errs.summary} /></Field>
        <div className="sm:col-span-2">
          <div className="field-label">Cover photograph</div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {photoKeys.slice(0, 16).map((k) => (
              <button key={k} type="button" onClick={() => setF({ ...f, cover: k })} aria-label={photos[k].caption} aria-pressed={f.cover === k} className={cx('overflow-hidden rounded-sm ring-2 ring-offset-1 transition', f.cover === k ? 'ring-agri' : 'ring-transparent opacity-70 hover:opacity-100')}>
                <Photo src={k} className="aspect-square" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

function MilestoneForm({ m, onClose, onSave, onDelete, isNew }: { m: Milestone | null; onClose: () => void; onSave: (m: Milestone) => void; onDelete: (id: string) => void; isNew: boolean }) {
  const [f, setF] = useState<Milestone | null>(m);
  const [err, setErr] = useState('');
  const [last, setLast] = useState<Milestone | null>(null);
  if (m !== last) { setLast(m); setF(m); setErr(''); }
  if (!f) return null;
  const save = () => { if (f.title.trim().length < 3) { setErr('Give the milestone a title.'); return; } onSave({ ...f, title: f.title.trim() }); };
  return (
    <Modal open={!!m} onClose={onClose} title={isNew ? 'Add milestone' : 'Edit milestone'} eyebrow="Milestones" size="md"
      footer={<>{!isNew && <Button variant="danger" className="mr-auto" onClick={() => onDelete(f.id)}>Remove</Button>}<Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={save}>Save milestone</Button></>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="ms-title" label="Title" error={err} className="sm:col-span-2"><Input id="ms-title" value={f.title} onChange={(e) => { setF({ ...f, title: e.target.value }); setErr(''); }} invalid={!!err} /></Field>
        <Field id="ms-date" label="Date"><Input id="ms-date" type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></Field>
        <Field id="ms-state" label="State"><Select id="ms-state" value={f.state} onChange={(e) => setF({ ...f, state: e.target.value as MilestoneState })}>{(Object.keys(milestoneMeta) as MilestoneState[]).map((s) => <option key={s} value={s}>{milestoneMeta[s].label}</option>)}</Select></Field>
        <div className="sm:col-span-2">
          <div className="field-label">Date type</div>
          <div className="grid grid-cols-2 gap-2">
            {[[false, 'Expected', 'Planned date; may change'], [true, 'Confirmed', 'The event has happened']].map(([val, l, d]) => (
              <button key={String(val)} type="button" onClick={() => setF({ ...f, confirmed: val as boolean })} aria-pressed={f.confirmed === val} className={cx('rounded border p-3 text-left', f.confirmed === val ? 'border-agri bg-agri/5' : 'border-line hover:border-ink/30')}>
                <div className="text-[13px] font-bold text-ink">{l as string}</div><div className="text-[12px] text-sage">{d as string}</div>
              </button>
            ))}
          </div>
        </div>
        <Field id="ms-metric" label="Field reading (optional)" className="sm:col-span-2"><Input id="ms-metric" value={f.metric ?? ''} onChange={(e) => setF({ ...f, metric: e.target.value || undefined })} placeholder="e.g. Grain moisture 21%" /></Field>
        <Field id="ms-note" label="Note for investors" className="sm:col-span-2"><Textarea id="ms-note" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} className="min-h-[80px]" /></Field>
      </div>
    </Modal>
  );
}

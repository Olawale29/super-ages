import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, ImagePlus, Pencil, Plus, Send, Trash2, Upload, X, Check } from 'lucide-react';
import { useDemo } from '../../store/DemoStore';
import { Badge, Empty, Field, Input, PageTitle, Select, Tabs, Textarea } from '../../components/ui/Bits';
import { Button, ButtonLink } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Overlay';
import { Photo } from '../../components/ui/Photo';
import { UpdateArticle } from '../../components/ui/UpdateViews';
import { photoKeys, photos, type PhotoKey } from '../../data/images';
import type { FarmUpdate, ImageRef, UpdateCategory } from '../../data/types';
import { cx, fmtDate, nowIso, uid } from '../../lib/format';

const CATS: UpdateCategory[] = ['Crop development', 'Livestock', 'Harvest', 'Farm operations'];

export function PublishingList() {
  const { state, deleteUpdate, toast } = useDemo();
  const [tab, setTab] = useState<'all' | 'Published' | 'Draft'>('all');
  const [del, setDel] = useState<FarmUpdate | null>(null);
  const list = state.updates.filter((u) => tab === 'all' || u.status === tab).sort((a, b) => (a.status === b.status ? b.date.localeCompare(a.date) : a.status === 'Draft' ? -1 : 1));
  return (
    <div>
      <PageTitle eyebrow="Farm journal" title="Farm update publishing" intro="Write, preview and publish field reports. Published updates appear in the investor feed and on the public farm journal." actions={<ButtonLink to="/admin/publishing/new" icon={<Plus size={16} />}>New update</ButtonLink>} />
      <Tabs className="mb-4" value={tab} onChange={setTab} options={[{ value: 'all', label: 'All', count: state.updates.length }, { value: 'Published', label: 'Published', count: state.updates.filter((u) => u.status === 'Published').length }, { value: 'Draft', label: 'Drafts', count: state.updates.filter((u) => u.status === 'Draft').length }]} />
      {list.length === 0 ? <Empty title={tab === 'Draft' ? 'No drafts' : 'Nothing here yet'} body="Start a new update to share progress with investors." action={<ButtonLink to="/admin/publishing/new">New update</ButtonLink>} /> : (
        <ul className="card divide-y divide-line">
          {list.map((u) => {
            const p = state.projects.find((x) => x.id === u.projectId);
            return (
              <li key={u.id} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap sm:px-5">
                <Photo src={u.cover} className="h-14 w-20 shrink-0 rounded-sm" />
                <div className="min-w-0 flex-1">
                  <Link to={`/admin/publishing/${u.id}`} className="line-clamp-1 text-[14px] font-bold text-ink hover:text-agri">{u.title}</Link>
                  <div className="mt-0.5 text-[12px] text-sage">{u.category} · {p?.name} · {fmtDate(u.date)} · {u.comments.length} comments</div>
                </div>
                <Badge tone={u.status === 'Published' ? 'green' : 'attn'}>{u.status}</Badge>
                <div className="flex gap-1">
                  {u.status === 'Published' && <ButtonLink to={`/portal/updates/${u.id}`} variant="ghost" size="sm" title="View as investor"><Eye size={14} /></ButtonLink>}
                  <ButtonLink to={`/admin/publishing/${u.id}`} variant="ghost" size="sm" icon={<Pencil size={13} />}>Edit</ButtonLink>
                  <Button variant="ghost" size="sm" onClick={() => setDel(u)} aria-label="Delete update"><Trash2 size={14} /></Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <Modal open={!!del} onClose={() => setDel(null)} title="Delete this update?" size="sm"
        footer={<><Button variant="secondary" onClick={() => setDel(null)}>Cancel</Button><Button variant="dark" onClick={() => { deleteUpdate(del!.id); setDel(null); toast({ title: 'Update deleted' }); }}>Delete</Button></>}>
        <p className="text-[14px] text-body">“{del?.title}” will be removed from the journal and investor feed in this demo.</p>
      </Modal>
    </div>
  );
}

/** Downscale an uploaded image to a modest JPEG data URL so it fits browser storage. */
function readImage(file: File, max = 1400): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = reject;
    r.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas'); c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.8));
      };
      img.src = r.result as string;
    };
    r.readAsDataURL(file);
  });
}

export function PublishingEditor() {
  const { id } = useParams();
  const { state, saveUpdate, toast } = useDemo();
  const navigate = useNavigate();
  const existing = state.updates.find((u) => u.id === id);
  const [f, setF] = useState<FarmUpdate>(() => existing ?? {
    id: uid('u'), title: '', projectId: state.projects[0].id, category: 'Crop development', date: nowIso().slice(0, 10), excerpt: '', body: [], cover: 'cropRows', gallery: [],
    author: 'Adaeze Nwosu', authorRole: 'Farm Manager', status: 'Draft', comments: [], readMins: 2,
  });
  const [bodyText, setBodyText] = useState((existing?.body ?? []).join('\n\n'));
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState(false);
  const [picker, setPicker] = useState<'cover' | 'gallery' | null>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const galRef = useRef<HTMLInputElement>(null);
  const project = state.projects.find((p) => p.id === f.projectId);
  const set = (k: keyof FarmUpdate) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setF({ ...f, [k]: e.target.value }); setErrs({ ...errs, [k]: '' }); };

  const compiled = useMemo<FarmUpdate>(() => {
    const body = bodyText.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
    const words = (f.excerpt + ' ' + body.join(' ')).split(/\s+/).length;
    return { ...f, body, readMins: Math.max(1, Math.round(words / 200)) };
  }, [f, bodyText]);

  const validate = (forPublish: boolean) => {
    const e: Record<string, string> = {};
    if (f.title.trim().length < 6) e.title = 'Write a headline of at least 6 characters.';
    if (forPublish && f.excerpt.trim().length < 20) e.excerpt = 'Add a summary of at least 20 characters. It appears in the feed.';
    if (forPublish && bodyText.trim().length < 40) e.body = 'Add a description of at least 40 characters before publishing.';
    setErrs(e);
    if (Object.keys(e).length) document.getElementById(`ed-${Object.keys(e)[0]}`)?.focus();
    return !Object.keys(e).length;
  };
  const persist = (status: 'Draft' | 'Published') => {
    if (!validate(status === 'Published')) return;
    const u = { ...compiled, title: f.title.trim(), status };
    try {
      saveUpdate(u);
    } catch { /* storage quota: state still updates in memory */ }
    if (status === 'Published') {
      toast({ title: existing?.status === 'Published' ? 'Update saved' : 'Update published', body: 'Now visible in the investor feed and public farm journal.' });
      navigate('/admin/publishing');
    } else {
      setF(u); toast({ title: 'Draft saved', body: 'Only the farm team can see drafts.', tone: 'info' });
      if (!existing) navigate(`/admin/publishing/${u.id}`, { replace: true });
    }
  };
  const upload = async (files: FileList | null, target: 'cover' | 'gallery') => {
    if (!files?.length) return;
    try {
      const urls = await Promise.all(Array.from(files).slice(0, 6).filter((x) => x.type.startsWith('image/')).map((x) => readImage(x)));
      if (!urls.length) { toast({ title: 'Choose image files', tone: 'error' }); return; }
      if (target === 'cover') setF((x) => ({ ...x, cover: urls[0] }));
      else setF((x) => ({ ...x, gallery: [...x.gallery, ...urls] }));
      toast({ title: urls.length > 1 ? `${urls.length} photos added` : 'Photo added', body: 'Local preview only. Nothing is uploaded in the demo.', tone: 'info' });
    } catch { toast({ title: 'That image could not be read', body: 'Try a JPG or PNG file.', tone: 'error' }); }
  };

  return (
    <div>
      <Link to="/admin/publishing" className="mb-6 inline-flex items-center gap-2 text-[13px] font-semibold text-sage hover:text-ink"><ArrowLeft size={15} /> Farm update publishing</Link>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><div className="eyebrow">{existing ? 'Edit update' : 'New update'}</div><h1 className="display mt-1 text-[36px] text-ink sm:text-[44px]">{f.title.trim() || 'Untitled farm update'}</h1></div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={f.status === 'Published' ? 'green' : 'attn'}>{f.status}</Badge>
          <Button variant="secondary" icon={<Eye size={15} />} onClick={() => setPreview(true)}>Preview</Button>
          <Button variant="secondary" onClick={() => persist('Draft')}>Save draft</Button>
          <Button icon={<Send size={15} />} onClick={() => persist('Published')}>{f.status === 'Published' ? 'Update' : 'Publish'}</Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <section className="card space-y-5 p-6 sm:p-7">
            <Field id="ed-title" label="Title" error={errs.title}><Input id="ed-title" value={f.title} onChange={set('title')} invalid={!!errs.title} placeholder="e.g. Second weigh-in shows steady gains" className="text-[16px] font-semibold" /></Field>
            <Field id="ed-excerpt" label="Summary" error={errs.excerpt} hint="One or two sentences shown in the feed and at the top of the article."><Textarea id="ed-excerpt" value={f.excerpt} onChange={set('excerpt')} invalid={!!errs.excerpt} className="min-h-[80px]" /></Field>
            <Field id="ed-body" label="Description" error={errs.body} hint="Separate paragraphs with a blank line.">
              <Textarea id="ed-body" value={bodyText} onChange={(e) => { setBodyText(e.target.value); setErrs({ ...errs, body: '' }); }} invalid={!!errs.body} className="min-h-[220px]" placeholder="What happened in the field, what was measured, and what comes next." />
            </Field>
          </section>

          <section className="card p-6 sm:p-7">
            <h2 className="text-[15px] font-bold text-ink">Photographs</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-[1.2fr_1fr]">
              <div>
                <div className="field-label">Cover image</div>
                <div className="relative overflow-hidden rounded-sm">
                  <Photo key={String(f.cover).slice(0, 40)} src={f.cover} className="aspect-[16/10]" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" icon={<ImagePlus size={14} />} onClick={() => setPicker('cover')}>Choose from library</Button>
                  <Button size="sm" variant="secondary" icon={<Upload size={14} />} onClick={() => coverRef.current?.click()}>Upload</Button>
                  <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => { upload(e.target.files, 'cover'); e.target.value = ''; }} />
                </div>
              </div>
              <div>
                <div className="field-label">Additional images <span className="font-normal text-sage">({f.gallery.length})</span></div>
                <div className="grid grid-cols-3 gap-2">
                  {f.gallery.map((g, i) => (
                    <div key={i} className="group relative">
                      <Photo src={g} className="aspect-square rounded-sm" />
                      <button onClick={() => setF({ ...f, gallery: f.gallery.filter((_, j) => j !== i) })} aria-label="Remove image" className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/80 text-canvas opacity-100 sm:opacity-0 sm:group-hover:opacity-100"><X size={12} /></button>
                    </div>
                  ))}
                  <button onClick={() => setPicker('gallery')} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-line text-[11px] font-semibold text-sage hover:border-agri hover:text-agri"><ImagePlus size={16} />Library</button>
                  <button onClick={() => galRef.current?.click()} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-line text-[11px] font-semibold text-sage hover:border-agri hover:text-agri"><Upload size={16} />Upload</button>
                  <input ref={galRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { upload(e.target.files, 'gallery'); e.target.value = ''; }} />
                </div>
                <p className="mt-2 text-[11.5px] text-sage">Uploads use a local browser preview; no media storage is involved.</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6 xl:col-span-4">
          <section className="card space-y-4 p-6">
            <h2 className="text-[15px] font-bold text-ink">Details</h2>
            <Field id="ed-project" label="Project"><Select id="ed-project" value={f.projectId} onChange={(e) => setF({ ...f, projectId: e.target.value, milestoneId: undefined })}>{state.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</Select></Field>
            <Field id="ed-cat" label="Category"><Select id="ed-cat" value={f.category} onChange={set('category')}>{CATS.map((c) => <option key={c}>{c}</option>)}</Select></Field>
            <Field id="ed-ms" label="Related milestone"><Select id="ed-ms" value={f.milestoneId ?? ''} onChange={(e) => { const m = project?.milestones.find((x) => x.id === e.target.value); setF({ ...f, milestoneId: e.target.value || undefined, milestoneDate: m?.date ?? f.milestoneDate }); }}><option value="">None</option>{project?.milestones.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}</Select></Field>
            <Field id="ed-msdate" label="Milestone date"><Input id="ed-msdate" type="date" value={f.milestoneDate ?? ''} onChange={(e) => setF({ ...f, milestoneDate: e.target.value || undefined })} /></Field>
            <Field id="ed-date" label="Publication date"><Input id="ed-date" type="date" value={f.date} onChange={set('date')} /></Field>
            <Field id="ed-author" label="Author"><Select id="ed-author" value={f.author} onChange={(e) => setF({ ...f, author: e.target.value, authorRole: { 'Adaeze Nwosu': 'Farm Manager', 'Ibrahim Sule': 'Livestock Lead', 'Kunle Adeyemi-Ross': 'Operations Lead' }[e.target.value] ?? 'Farm team' })}><option>Adaeze Nwosu</option><option>Ibrahim Sule</option><option>Kunle Adeyemi-Ross</option></Select></Field>
            <div>
              <div className="field-label">Publication status</div>
              <div className="grid grid-cols-2 gap-2">
                {(['Draft', 'Published'] as const).map((s) => <div key={s} className={cx('rounded border px-3 py-2 text-[13px] font-semibold', f.status === s ? 'border-agri bg-agri/5 text-ink' : 'border-line text-sage')}>{f.status === s && <Check size={13} className="mr-1 inline text-agri" />}{s}</div>)}
              </div>
              <p className="mt-2 text-[11.5px] text-sage">Use Publish to make the update visible to investors on this project.</p>
            </div>
          </section>
          <section className="rounded-md border border-[#C0D20D]/50 bg-pale p-5 text-[13px] leading-relaxed text-body">
            <strong className="text-ink">Who will see this?</strong> Investors in {project?.name} receive a notification, and the update appears in the public farm journal.
          </section>
        </aside>
      </div>

      <Modal open={preview} onClose={() => setPreview(false)} title="Investor preview" eyebrow="How investors will see this update" size="lg"
        footer={<><Button variant="secondary" onClick={() => setPreview(false)}>Keep editing</Button><Button icon={<Send size={15} />} onClick={() => { setPreview(false); persist('Published'); }}>{f.status === 'Published' ? 'Update' : 'Publish'}</Button></>}>
        <UpdateArticle u={{ ...compiled, title: compiled.title || 'Untitled farm update', excerpt: compiled.excerpt || 'Summary will appear here.' }} project={project} milestoneTitle={project?.milestones.find((m) => m.id === f.milestoneId)?.title} showComments={false} />
      </Modal>

      <Modal open={!!picker} onClose={() => setPicker(null)} title={picker === 'cover' ? 'Choose a cover photograph' : 'Add photographs'} eyebrow="Photo library" size="lg"
        footer={<Button onClick={() => setPicker(null)}>Done</Button>}>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photoKeys.map((k: PhotoKey) => {
            const sel = picker === 'cover' ? f.cover === k : f.gallery.includes(k as ImageRef);
            return (
              <button key={k} onClick={() => picker === 'cover' ? (setF({ ...f, cover: k }), setPicker(null)) : setF({ ...f, gallery: sel ? f.gallery.filter((g) => g !== k) : [...f.gallery, k] })}
                aria-pressed={sel} className={cx('group relative overflow-hidden rounded-sm text-left ring-2 ring-offset-1', sel ? 'ring-agri' : 'ring-transparent')}>
                <Photo src={k} className="aspect-[4/3]" />
                <span className="block truncate px-1 py-1 text-[11px] text-body">{photos[k].caption}</span>
                {sel && <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-agri text-white"><Check size={13} /></span>}
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}

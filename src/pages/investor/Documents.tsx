import { useMemo, useState } from 'react';
import { Eye, FileSpreadsheet, FileText, Search } from 'lucide-react';
import { useDemo, useInvestorView } from '../../store/DemoStore';
import { Badge, Empty, Input, PageTitle, Tabs } from '../../components/ui/Bits';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Brand';
import { Modal } from '../../components/ui/Overlay';
import type { DocumentItem } from '../../data/types';
import { fmtDate } from '../../lib/format';

export function DocRow({ d, onPreview, compact = false, projectName }: { d: DocumentItem; onPreview: () => void; compact?: boolean; projectName?: string }) {
  const Icon = d.format === 'XLSX' ? FileSpreadsheet : FileText;
  return (
    <li className="group flex items-center gap-4 py-3.5">
      <span className="relative flex h-11 w-9 shrink-0 items-center justify-center rounded-[3px] border border-line bg-white text-agri">
        <Icon size={17} strokeWidth={1.7} />
        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-[2px] bg-ink px-1 text-[8px] font-bold leading-[13px] text-canvas">{d.format}</span>
      </span>
      <div className="min-w-0 flex-1">
        <button onClick={onPreview} className="line-clamp-2 text-left text-[13.5px] font-bold leading-snug text-ink hover:text-agri">{d.title}</button>
        <div className="mt-0.5 flex flex-wrap gap-x-2 text-[12px] text-sage">
          <span>{d.type}</span><span>·</span><span className="tnum">{fmtDate(d.date)}</span>
          {!compact && <><span>·</span><span className="tnum">{d.size}</span></>}
          {!compact && projectName && <><span>·</span><span>{projectName}</span></>}
        </div>
      </div>
      {!compact && <Badge tone="neutral" dot={false} className="hidden sm:inline-flex">Demo material</Badge>}
      <Button variant="ghost" size="sm" onClick={onPreview} icon={<Eye size={14} />} aria-label={`Preview ${d.title}`}><span className="hidden sm:inline">Preview</span></Button>
    </li>
  );
}

export function DocPreview({ doc, onClose }: { doc: DocumentItem | null; onClose: () => void }) {
  const { state, toast } = useDemo();
  const v = useInvestorView();
  if (!doc) return null;
  const p = state.projects.find((x) => x.id === doc.projectId);
  return (
    <Modal open={!!doc} onClose={onClose} title={doc.title} eyebrow={`${doc.type} · ${doc.format} · ${doc.size}`} size="lg"
      footer={<><span className="mr-auto text-[12px] text-sage">Sample document for demonstration.</span><Button variant="secondary" onClick={() => toast({ title: 'Download not available in the demo', body: 'Real documents will be downloadable once the backend is connected.', tone: 'info' })}>Download</Button><Button onClick={onClose}>Done</Button></>}>
      <div className="rounded-sm border border-line bg-canvas p-3 sm:p-6">
        <div className="mx-auto max-w-[620px] bg-white px-6 py-8 shadow-[0_10px_30px_-18px_rgba(8,19,8,.35)] sm:px-10 sm:py-12">
          <div className="flex items-start justify-between gap-4 border-b border-line pb-6">
            <Logo height={46} />
            <div className="text-right text-[10.5px] leading-relaxed text-sage">
              <div className="font-bold uppercase tracking-label text-ink">{doc.type}</div>
              <div className="tnum">Issued {fmtDate(doc.date, true)}</div>
              {p && <div>{p.code}</div>}
            </div>
          </div>
          <div className="mt-6 text-[10px] font-bold uppercase tracking-label text-agri">Demonstration document</div>
          <h3 className="display mt-2 text-[28px] leading-tight text-ink">{doc.title}</h3>
          <p className="mt-4 text-[13px] leading-relaxed text-body">{doc.summary}</p>
          {doc.type === 'Contribution record' && (
            <table className="mt-6 w-full text-[12.5px]"><tbody className="divide-y divide-line">
              {[['Investor', `${v.investor.firstName} ${v.investor.lastName}`], ['Project', p?.name ?? '—'], ['Reference', doc.title.split(' ').pop()!], ['Status', 'Recorded']].map(([k, val]) => <tr key={k}><td className="py-2 text-sage">{k}</td><td className="py-2 text-right font-semibold text-ink">{val}</td></tr>)}
            </tbody></table>
          )}
          <div className="mt-6 space-y-2" aria-hidden>
            {[92, 100, 86, 97, 64].map((w, i) => <div key={i} className="h-2 rounded-full bg-mist" style={{ width: `${w}%` }} />)}
          </div>
          <div className="mt-8 border-t border-line pt-4 text-[10.5px] text-sage">Placeholder content. The final document will be issued by Super Ages.</div>
        </div>
      </div>
    </Modal>
  );
}

export default function Documents() {
  const v = useInvestorView();
  const [tab, setTab] = useState('All');
  const [q, setQ] = useState('');
  const [doc, setDoc] = useState<DocumentItem | null>(null);
  const types = ['All', 'Project sheet', 'Farm report', 'Harvest report', 'Contribution record', 'Agreement'];
  const list = useMemo(() => v.myDocuments.filter((d) => (tab === 'All' || d.type === tab) && (!q || d.title.toLowerCase().includes(q.toLowerCase()))).sort((a, b) => b.date.localeCompare(a.date)), [v.myDocuments, tab, q]);
  return (
    <div>
      <PageTitle eyebrow="Library" title="Documents" intro="Project information, reports and records shared with you. All documents in this demo are sample material." />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs value={tab} onChange={setTab} options={types.map((t) => ({ value: t, label: t === 'All' ? 'All documents' : t + 's', count: t === 'All' ? v.myDocuments.length : v.myDocuments.filter((d) => d.type === t).length }))} />
        <div className="relative lg:w-72">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sage" />
          <Input id="doc-search" aria-label="Search documents" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search documents" className="pl-9" />
        </div>
      </div>
      {list.length === 0 ? <Empty title="No documents found" body="Try a different filter or search term." icon={<FileText size={18} />} /> : (
        <ul className="card divide-y divide-line px-4 sm:px-6">
          {list.map((d) => <DocRow key={d.id} d={d} onPreview={() => setDoc(d)} projectName={v.projectById(d.projectId ?? '')?.name} />)}
        </ul>
      )}
      <DocPreview doc={doc} onClose={() => setDoc(null)} />
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Mail, MapPin, Phone, ShieldCheck, Eye, Handshake, Sprout } from 'lucide-react';
import { PageHero } from '../../components/site/SiteChrome';
import { EnquiryForm, DashboardPreview } from '../../components/site/SiteBlocks';
import { Photo } from '../../components/ui/Photo';
import { ButtonLink } from '../../components/ui/Button';
import { DemoTag } from '../../components/ui/Brand';
import { Badge, SectionHeading, Tabs, projectTone, Empty } from '../../components/ui/Bits';
import { Timeline } from '../../components/ui/Timeline';
import { UpdateArticle, UpdateCard } from '../../components/ui/UpdateViews';
import { useDemo } from '../../store/DemoStore';
import type { UpdateCategory } from '../../data/types';
import { cx } from '../../lib/format';

/* ================= Our Farms ================= */
export function Farms() {
  const { state } = useDemo();
  const [open, setOpen] = useState<string | null>(state.projects[0]?.id ?? null);
  return (
    <>
      <PageHero photo="aerial" eyebrow="Our farms" title="Land worked with care, season after season." intro="A look at the crop and livestock projects that make up the Super Ages operation. Sites and figures on this page are illustrative for the demo." />
      <section className="wrap py-20 sm:py-28">
        <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Current projects" title="Four projects this season." size="md" />
          <DemoTag>Fictional projects for demonstration</DemoTag>
        </div>
        <div className="space-y-6">
          {state.projects.map((p, i) => {
            const isOpen = open === p.id;
            return (
              <article key={p.id} className="overflow-hidden rounded-md border border-line bg-white">
                <div className={cx('grid lg:grid-cols-12', i % 2 === 1 && 'lg:[&>*:first-child]:order-2')}>
                  <Photo src={p.cover} className="aspect-[16/10] lg:col-span-6 lg:aspect-auto lg:min-h-[380px]" />
                  <div className="flex flex-col p-7 sm:p-10 lg:col-span-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-label text-agri">{p.category}</span>
                      <span className="text-sage">·</span>
                      <span className="text-[12px] font-medium text-sage">{p.code}</span>
                      <Badge tone={projectTone(p.status)} className="ml-auto">{p.status}</Badge>
                    </div>
                    <h3 className="display mt-4 text-[34px] text-ink sm:text-[42px]">{p.name}</h3>
                    <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-body">{p.summary}</p>
                    <dl className="mt-7 grid grid-cols-2 gap-5 border-t border-line pt-6 sm:grid-cols-4">
                      {[['Enterprise', p.enterprise], ['Scale', p.area], ['Cycle', p.cycle], ['Site', p.site]].map(([k, v]) => (
                        <div key={k} className="min-w-0"><dt className="eyebrow">{k}</dt><dd className="mt-1 text-[13.5px] font-semibold text-ink">{v}</dd></div>
                      ))}
                    </dl>
                    <button onClick={() => setOpen(isOpen ? null : p.id)} aria-expanded={isOpen} className="mt-7 inline-flex items-center gap-2 self-start text-[14px] font-semibold text-ink">
                      {isOpen ? 'Hide season timeline' : 'View season timeline'} <ArrowRight size={15} className={cx('transition', isOpen && 'rotate-90')} />
                    </button>
                  </div>
                </div>
                {isOpen && (
                  <div className="animate-fade border-t border-line bg-canvas p-7 sm:p-10">
                    <div className="grid gap-8 lg:grid-cols-12">
                      <div className="lg:col-span-4">
                        <div className="eyebrow">Season timeline</div>
                        <p className="mt-2 text-[14px] leading-relaxed text-body">Confirmed events are marked with solid markers. Open markers are expected dates and may move with weather and field conditions.</p>
                        <Link to="/portal" className="mt-5 inline-flex items-center gap-2 text-[13.5px] font-semibold text-agri">Investors see full detail in the portal <ArrowUpRight size={15} /></Link>
                      </div>
                      <div className="lg:col-span-8"><Timeline milestones={p.milestones} compact /></div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
      <CtaBand />
    </>
  );
}

/* ================= What We Do ================= */
const areas = [
  { id: 'crops', label: 'Crop farming', photo: 'maizeField', title: 'Grain and root crops, managed stage by stage.', body: 'Each crop cycle follows a written plan: land preparation, planting density, fertiliser timing and scouting. Field teams record stand counts, growth stages and moisture readings, which flow straight into investor reports.', points: ['Land preparation and planting', 'Germination and stand counts', 'Growth-stage monitoring', 'Moisture-led harvest timing'] },
  { id: 'livestock', label: 'Livestock management', photo: 'cattle', title: 'Animal health first, then performance.', body: 'Livestock programmes start with health screening and vaccination. Weigh-ins, feed records and production figures are taken on a fixed schedule so progress is measured consistently.', points: ['Stock acquisition and quarantine', 'Vaccination and veterinary checks', 'Feeding and weigh-in schedule', 'Production and sales milestones'] },
  { id: 'harvest', label: 'Harvest and production', photo: 'wheatGold', title: 'Harvest decisions made together.', body: 'Before harvest, investors record how they would like their share of the produce handled: sold, stored where space allows, or discussed with the team. The farm team confirms each instruction before acting on it.', points: ['Harvest decision requests', 'Drying, cleaning and bagging', 'Storage allocation', 'Post-harvest reporting'] },
  { id: 'operations', label: 'Farm operations and development', photo: 'irrigation', title: 'Building the farm for the long term.', body: 'Machinery, water and storage infrastructure are maintained between seasons. Larger improvements are planned in advance and reported to investors as they progress.', points: ['Machinery and maintenance', 'Irrigation and water management', 'Storage and handling', 'Site development plans'] },
];

export function WhatWeDo() {
  return (
    <>
      <PageHero photo="farmerField" eyebrow="What we do" title="Four disciplines, one season-long commitment." intro="How Super Ages approaches crop farming, livestock, harvest and farm operations. Activities described here are illustrative and will be confirmed with Super Ages." />
      <div className="sticky z-30 border-b border-line bg-canvas/95 backdrop-blur-sm" style={{ top: 'calc(76px + env(safe-area-inset-top, 0px))' }}>
        <nav className="wrap scroll-x no-scrollbar flex gap-6 py-3 text-[13px] font-semibold" aria-label="Sections">
          {areas.map((a) => <a key={a.id} href={`#${a.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(a.id)?.scrollIntoView({ behavior: 'smooth' }); }} className="shrink-0 text-body hover:text-ink">{a.label}</a>)}
        </nav>
      </div>
      {areas.map((a, i) => (
        <section key={a.id} id={a.id} className={cx('scroll-mt-40', i % 2 ? 'bg-white' : '')}>
          <div className="wrap grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-12">
            <Photo src={a.photo} className={cx('aspect-[4/3] rounded-sm lg:col-span-6', i % 2 === 1 && 'lg:order-2 lg:col-start-7')} />
            <div className={cx('lg:col-span-5', i % 2 ? 'lg:col-start-1' : 'lg:col-start-8')}>
              <div className="eyebrow text-agri">{a.label}</div>
              <h2 className="display mt-3 text-[36px] text-ink sm:text-[48px]">{a.title}</h2>
              <p className="mt-5 text-[15.5px] leading-relaxed text-body">{a.body}</p>
              <ul className="mt-7 divide-y divide-line border-y border-line">
                {a.points.map((p) => <li key={p} className="flex items-center gap-3 py-3 text-[14px] font-semibold text-ink"><span className="h-1.5 w-1.5 rounded-full bg-lime" />{p}</li>)}
              </ul>
            </div>
          </div>
        </section>
      ))}
      <CtaBand />
    </>
  );
}

/* ================= Investor Relations ================= */
export function InvestorRelations() {
  const steps = [
    { t: 'Enquire', b: 'Speak with investor relations about current projects and how participation works.' },
    { t: 'Join a project', b: 'Review the project information sheet and agreement, then record your contribution.' },
    { t: 'Follow the season', b: 'Receive farm updates, photographs and milestone notices in your private portal.' },
    { t: 'Decide at harvest', b: 'Record how you would like the produce handled, and receive the harvest report.' },
  ];
  const faqs = [
    { q: 'Does the portal show guaranteed returns?', a: 'No. The portal reports progress, milestones and documents. Agricultural outcomes depend on weather, markets and field conditions, and nothing in the portal is a promise of return.' },
    { q: 'What does a harvest decision do?', a: 'It records your instruction for the farm team. It does not execute a sale or reserve storage by itself. The team reviews each instruction and confirms the next step with you.' },
    { q: 'How often are updates published?', a: 'Each active project receives regular field updates, with additional notes when a milestone is reached or needs attention.' },
    { q: 'Can I speak to someone directly?', a: 'Yes. Every investor can message the farm team and investor relations from the portal.' },
  ];
  const [faq, setFaq] = useState(0);
  return (
    <>
      <PageHero photo="sunriseField" eyebrow="Investor relations" title="A private window onto the season." intro="The Super Ages investor portal brings contributions, field updates, milestones, documents and harvest decisions into one place." />
      <section className="wrap py-20 sm:py-28">
        <SectionHeading eyebrow="How it works" title="From first conversation to harvest report." size="md" />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t} className="bg-white p-7">
              <span className="display text-[44px] leading-none text-lime tnum">{i + 1}</span>
              <h3 className="mt-5 text-[16px] font-bold text-ink">{s.t}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-body">{s.b}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="bg-pale">
        <div className="wrap grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="The portal" title="See it as an investor would." size="md" intro="Open the interactive demo to explore the dashboard, follow a maize crop to harvest, and record a harvest decision." />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/portal" size="lg" icon={<ArrowRight size={17} />}>Open the investor demo</ButtonLink>
            </div>
          </div>
          <div className="min-w-0 lg:col-span-7"><DashboardPreview /></div>
        </div>
      </section>
      <section className="wrap grid gap-12 py-20 sm:py-28 lg:grid-cols-12">
        <div className="lg:col-span-4"><SectionHeading eyebrow="Questions" title="What investors ask us." size="md" /></div>
        <div className="divide-y divide-line border-y border-line lg:col-span-7 lg:col-start-6">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button onClick={() => setFaq(faq === i ? -1 : i)} aria-expanded={faq === i} className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] font-bold text-ink">
                {f.q}<span className={cx('text-[22px] font-light text-agri transition', faq === i && 'rotate-45')}>+</span>
              </button>
              {faq === i && <p className="animate-fade pb-6 text-[15px] leading-relaxed text-body">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>
      <section id="enquiry" className="scroll-mt-24 border-t border-line bg-white">
        <div className="wrap grid gap-12 py-20 sm:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4"><SectionHeading eyebrow="Become an investor" title="Make an enquiry." size="md" intro="Share a few details and the investor relations team will be in touch." /></div>
          <div className="min-w-0 lg:col-span-8"><EnquiryForm /></div>
        </div>
      </section>
    </>
  );
}

/* ================= About ================= */
export function About() {
  const values = [
    { icon: Eye, t: 'Transparency', b: 'Investors see the field notes, photographs and decisions that shape each season.' },
    { icon: Sprout, t: 'Stewardship', b: 'Soil, water and animals are managed for the long term, not just the current cycle.' },
    { icon: Handshake, t: 'Partnership', b: 'Key decisions, such as what happens at harvest, are made with investors.' },
    { icon: ShieldCheck, t: 'Accountability', b: 'Every milestone has an owner, a date and a record of what actually happened.' },
  ];
  return (
    <>
      <PageHero photo="team" eyebrow="About Super Ages" title="Agriculture that people can see into." intro="Super Ages combines working farms with clear reporting, so investors stay connected to the land and the people who manage it." />
      <section className="wrap grid gap-12 py-20 sm:py-28 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionHeading eyebrow="Our story" title="Rooted in agriculture. Built on trust." size="md" />
          <div className="mt-7 space-y-4 text-[16px] leading-relaxed text-body">
            <p>Super Ages was founded on a simple idea: people who support agriculture should be able to follow it closely. Farming is patient work, and the progress of a season is easier to trust when you can see it.</p>
            <p>That is why every project is reported in plain language, from planting to post-harvest handling, with the people responsible for each stage named in every update.</p>
            <p className="text-[13px] text-sage">Placeholder narrative for the demo. Final company history, team and figures will be supplied by Super Ages.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:col-span-5 lg:col-start-8">
          <Photo src="soil" className="aspect-[3/4] rounded-sm" />
          <Photo src="produce" className="mt-12 aspect-[3/4] rounded-sm" />
        </div>
      </section>
      <section className="bg-ink text-canvas">
        <div className="wrap py-20 sm:py-28">
          <div className="text-[11px] font-semibold uppercase tracking-label text-lime">What we stand for</div>
          <h2 className="display mt-4 max-w-[18ch] text-[40px] text-white sm:text-[56px]">Principles that guide each season.</h2>
          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.t} className="border-t border-white/15 pt-5">
                <v.icon size={20} className="text-mlime" strokeWidth={1.6} />
                <h3 className="mt-4 text-[17px] font-bold text-white">{v.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-canvas/70">{v.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="wrap py-20 sm:py-28">
        <div className="mb-10 flex items-end justify-between gap-4"><SectionHeading eyebrow="The farm team" title="People behind the reports." size="md" /><DemoTag>Fictional names</DemoTag></div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[['Adaeze Nwosu', 'Farm Manager, crops'], ['Ibrahim Sule', 'Livestock Lead'], ['Tunde Bakare', 'Investor Relations']].map(([n, r], i) => (
            <div key={n}>
              <Photo src={(['farmerField', 'cattle', 'barn'] as const)[i]} className="aspect-[4/3] rounded-sm" />
              <div className="mt-4 text-[16px] font-bold text-ink">{n}</div>
              <div className="text-[13.5px] text-sage">{r}</div>
            </div>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}

/* ================= Journal ================= */
export function Journal() {
  const { state } = useDemo();
  const [cat, setCat] = useState<'All' | UpdateCategory>('All');
  const pub = useMemo(() => state.updates.filter((u) => u.status === 'Published').sort((a, b) => b.date.localeCompare(a.date)), [state.updates]);
  const list = cat === 'All' ? pub : pub.filter((u) => u.category === cat);
  const cats: ('All' | UpdateCategory)[] = ['All', 'Crop development', 'Livestock', 'Harvest', 'Farm operations'];
  const project = (id: string) => state.projects.find((p) => p.id === id);
  return (
    <>
      <PageHero photo="maizeField" eyebrow="Farm journal" title="Notes from the field." intro="Reports from the farm team on crops, livestock, harvests and operations. Sample reports are illustrative." />
      <section className="wrap py-16 sm:py-24">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Tabs value={cat} onChange={setCat} options={cats.map((c) => ({ value: c, label: c, count: c === 'All' ? pub.length : pub.filter((u) => u.category === c).length }))} />
          <DemoTag>Illustrative sample reports</DemoTag>
        </div>
        {list.length === 0 ? <Empty title="No reports in this category yet" body="New reports appear here as soon as the farm team publishes them." /> : (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((u, i) => (
              <UpdateCard key={u.id} u={u} project={project(u.projectId)} to={`/journal/${u.id}`} variant={i === 0 && cat === 'All' ? 'feature' : 'stack'} className={i === 0 && cat === 'All' ? 'sm:col-span-2' : ''} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export function JournalArticle() {
  const { id } = useParams();
  const { state } = useDemo();
  const u = state.updates.find((x) => x.id === id && x.status === 'Published');
  if (!u) return <div className="wrap py-24"><Empty title="This report is not available" body="It may have been unpublished or the link is incorrect." action={<ButtonLink to="/journal" variant="secondary">Back to the journal</ButtonLink>} /></div>;
  const p = state.projects.find((x) => x.id === u.projectId);
  const more = state.updates.filter((x) => x.status === 'Published' && x.id !== u.id).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  return (
    <div className="wrap py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <UpdateArticle u={u} project={p} milestoneTitle={p?.milestones.find((m) => m.id === u.milestoneId)?.title} showComments={false}
          backLink={<Link to="/journal" className="mb-8 inline-flex items-center gap-2 text-[13px] font-semibold text-sage hover:text-ink"><ArrowLeft size={15} /> Farm journal</Link>} />
        <div className="mt-14 rounded-md border border-[#C0D20D]/40 bg-pale p-6 sm:flex sm:items-center sm:justify-between sm:p-8">
          <div><div className="display text-[26px] text-ink">Investors can comment and ask questions in the portal.</div><p className="mt-1 text-[14px] text-body">Comments, galleries and milestone links are available to investors after signing in.</p></div>
          <ButtonLink to="/portal" className="mt-5 sm:mt-0" icon={<ArrowRight size={16} />}>Open investor portal</ButtonLink>
        </div>
      </div>
      <div className="mx-auto mt-20 max-w-5xl border-t border-line pt-12">
        <h2 className="display text-[32px] text-ink">More from the journal</h2>
        <div className="mt-8 grid gap-10 sm:grid-cols-3">{more.map((m) => <UpdateCard key={m.id} u={m} to={`/journal/${m.id}`} />)}</div>
      </div>
    </div>
  );
}

/* ================= Contact ================= */
export function Contact() {
  return (
    <>
      <PageHero photo="barn" eyebrow="Contact" title="Talk to the Super Ages team." intro="Questions about our farms, investor reporting or partnerships. Contact details shown are placeholders for the demo." />
      <section className="wrap grid gap-14 py-20 sm:py-28 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <ul className="divide-y divide-line border-y border-line">
            {[[Mail, 'Email', 'hello@superages.example'], [Phone, 'Phone', '+234 000 000 0000'], [MapPin, 'Office', 'Address to be confirmed']].map(([I, k, v]: any) => (
              <li key={k} className="flex gap-4 py-5"><I size={18} className="mt-0.5 text-agri" /><div><div className="eyebrow">{k}</div><div className="mt-1 select-all text-[15px] font-semibold text-ink">{v}</div></div></li>
            ))}
          </ul>
          <p className="mt-6 text-[13.5px] leading-relaxed text-sage">Investor relations replies within two working days. Existing investors can message the farm team directly in the portal.</p>
          <ButtonLink to="/portal" variant="secondary" className="mt-6">Investor Login</ButtonLink>
        </div>
        <div id="enquiry" className="min-w-0 scroll-mt-24 lg:col-span-8"><EnquiryForm /></div>
      </section>
    </>
  );
}

/* ================= Legal placeholders ================= */
export function Legal() {
  const { doc } = useParams();
  const titles: Record<string, string> = { privacy: 'Privacy notice', terms: 'Terms of use', risk: 'Investment risk statement' };
  return (
    <section className="wrap py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <DemoTag>Placeholder page</DemoTag>
        <h1 className="display mt-4 text-[48px] text-ink">{titles[doc ?? ''] ?? 'Legal'}</h1>
        <p className="mt-6 text-[16px] leading-relaxed text-body">This page is a placeholder in the demonstration website. The final {(titles[doc ?? ''] ?? 'document').toLowerCase()} will be drafted and approved by Super Ages and its advisers before launch.</p>
        {doc === 'risk' && <p className="mt-4 text-[16px] leading-relaxed text-body">Agricultural projects are affected by weather, pests, disease, input prices and market conditions. Outcomes are not guaranteed, and the portal reports progress rather than promising returns.</p>}
        <ButtonLink to="/" variant="secondary" className="mt-10">Back to home</ButtonLink>
      </div>
    </section>
  );
}

/* ================= Shared CTA ================= */
function CtaBand() {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <Photo src="wheatGold" className="absolute inset-0 -z-10 opacity-40" />
      <div className="wrap flex flex-col items-start gap-8 py-20 sm:py-24 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="display max-w-[18ch] text-[40px] text-white sm:text-[60px]">Follow the season from the inside.</h2>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/portal" size="lg" icon={<ArrowRight size={17} />}>Investor Portal</ButtonLink>
          <ButtonLink to="/investors" state={{ anchor: 'enquiry' }} size="lg" variant="outlineLight">Become an Investor</ButtonLink>
        </div>
      </div>
    </section>
  );
}

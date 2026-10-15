import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, ArrowUpRight, BarChart3, CalendarClock, MessagesSquare, Newspaper } from 'lucide-react';
import { Photo } from '../../components/ui/Photo';
import { ButtonLink } from '../../components/ui/Button';
import { DemoTag } from '../../components/ui/Brand';
import { SectionHeading } from '../../components/ui/Bits';
import { UpdateCard } from '../../components/ui/UpdateViews';
import { DashboardPreview, EnquiryForm } from '../../components/site/SiteBlocks';
import { useDemo } from '../../store/DemoStore';

export default function Home() {
  return (
    <>
      <Hero />
      <BrandIntro />
      <Operations />
      <InvestorShowcase />
      <JournalPreview />
      <Enquiry />
    </>
  );
}

function Hero() {
  return (
    <section className="relative isolate flex min-h-[640px] items-end overflow-hidden bg-ink text-white" style={{ height: '100svh', maxHeight: 1080 }}>
      <div className="absolute inset-0 -z-10">
        <Photo src="heroField" className="h-full w-full" position="center 60%" eager kenburns />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,19,8,.5)_0%,rgba(8,19,8,0)_26%,rgba(8,19,8,.05)_52%,rgba(8,19,8,.82)_100%)]" />
      </div>
      <div className="wrap relative pb-6 sm:pb-48">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <div className="min-w-0">
            <div className="mb-6 flex animate-rise items-center gap-3 text-[11px] font-semibold uppercase tracking-label text-white/80">
              <span className="h-[3px] w-10 bg-agri" aria-hidden />Super Ages · Agriculture with transparent reporting
            </div>
            <h1 className="display animate-rise text-[52px] leading-[0.95] sm:text-[84px] lg:text-[104px] xl:text-[112px]" style={{ animationDelay: '80ms' }}>
              Growing Agriculture.<br /><span className="italic text-mlime">Building Lasting Value.</span>
            </h1>
            <p className="mt-7 max-w-[54ch] animate-rise text-[16px] leading-relaxed text-white/85 sm:text-[17px]" style={{ animationDelay: '180ms' }}>
              Discover a more transparent relationship with agriculture. Follow the progress of our farming operations, stay informed about important milestones, and remain connected to the people and processes behind your investment.
            </p>
            <div className="mt-9 flex animate-rise flex-wrap gap-3" style={{ animationDelay: '260ms' }}>
              <ButtonLink to="/farms" size="lg" icon={<ArrowRight size={17} />}>Explore Our Farms</ButtonLink>
              <ButtonLink to="/portal" size="lg" variant="outlineLight">Investor Portal</ButtonLink>
            </div>
          </div>
          <div className="hidden min-w-[230px] border-l border-white/25 pl-6 text-[12.5px] leading-relaxed text-white/75 lg:block">
            <div className="text-[10.5px] font-semibold uppercase tracking-label text-lime">Season 2026</div>
            <div className="mt-2">Crop and livestock cycles<br />reported milestone by milestone.</div>
            <a href="#intro" onClick={(e) => { e.preventDefault(); document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' }); }} className="mt-6 inline-flex items-center gap-2 font-semibold text-white">
              <ArrowDown size={15} className="animate-bounce" /> Scroll to discover
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandIntro() {
  return (
    <section id="intro" className="wrap py-24 sm:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="relative lg:col-span-6">
          <Photo src="farmerHands" className="aspect-[4/5] w-full rounded-sm sm:w-[86%]" />
          <div className="absolute -bottom-10 right-0 hidden w-[44%] border-[10px] border-canvas sm:block">
            <Photo src="seedlings" className="aspect-square w-full" />
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <SectionHeading eyebrow="Who we are" title={<>Rooted in Agriculture.<br />Built on Trust.</>} />
          <p className="mt-7 max-w-[48ch] text-[17px] leading-relaxed text-body">
            Super Ages works the land with patience and records every stage of the season. Investors see the same field notes, photographs and decisions as the people who manage the farm.
          </p>
          <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-sage">
            From soil preparation to the last bag in storage, each project is reported in plain language, so you always know where your crop or herd stands.
          </p>
          <Link to="/about" className="group mt-9 inline-flex items-center gap-2 border-b border-ink pb-1 text-[14px] font-semibold text-ink">
            Read our story <ArrowRight size={15} className="transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Operations() {
  return (
    <section className="pb-8 pt-12 sm:pt-20">
      <div className="wrap mb-14 grid gap-6 lg:grid-cols-12">
        <SectionHeading className="lg:col-span-7" eyebrow="Agricultural operations" title="What we grow, raise and manage." />
        <div className="flex flex-col justify-end gap-3 lg:col-span-4 lg:col-start-9">
          <p className="text-[15px] leading-relaxed text-body">Four areas of work make up the Super Ages operation. Activities shown here illustrate the platform and will be confirmed with Super Ages.</p>
          <DemoTag />
        </div>
      </div>

      {/* 1. Crop farming: wide image with overlapping panel */}
      <div className="relative">
        <Photo src="cropRows" className="h-[440px] w-full sm:h-[600px]" position="center 40%" />
        <div className="wrap relative -mt-28 sm:-mt-40">
          <div className="max-w-xl rounded-sm bg-canvas p-7 sm:p-10">
            <div className="eyebrow text-agri">Crop farming</div>
            <h3 className="display mt-3 text-[36px] text-ink sm:text-[46px]">Season-long care for grain and root crops.</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-body">Planting, stand counts, growth monitoring and dry-down are recorded at every stage, with readings and photographs from the field.</p>
            <Link to="/farms" className="group mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-ink">See our crop projects <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
          </div>
        </div>
      </div>

      {/* 2. Livestock: text left, stacked photographs right */}
      <div className="wrap grid items-center gap-12 py-24 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="eyebrow text-agri">Livestock management</div>
          <h3 className="display mt-3 text-[36px] text-ink sm:text-[46px]">Healthy animals, measured progress.</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-body">Poultry and cattle programmes are tracked through health checks, weigh-ins and production records, so every report is grounded in what was measured.</p>
          <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6">
            <div><dt className="eyebrow">Recorded</dt><dd className="mt-1.5 text-[14px] font-semibold text-ink">Live weight, daily gain</dd></div>
            <div><dt className="eyebrow">Reported</dt><dd className="mt-1.5 text-[14px] font-semibold text-ink">Hen-day production</dd></div>
          </dl>
          <Link to="/what-we-do" state={{ anchor: 'livestock' }} className="group mt-8 inline-flex items-center gap-2 text-[14px] font-semibold text-ink">How we manage livestock <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
        </div>
        <div className="grid grid-cols-5 gap-4 lg:col-span-7 lg:col-start-6">
          <Photo src="cowsPasture" className="zoom-img col-span-3 aspect-[3/4] rounded-sm" />
          <div className="col-span-2 flex flex-col gap-4 pt-16">
            <Photo src="poultry" className="zoom-img aspect-[4/5] rounded-sm" />
            <Photo src="eggs" className="zoom-img aspect-square rounded-sm" />
          </div>
        </div>
      </div>

      {/* 3. Harvest and production: dark band */}
      <div className="bg-ink text-canvas">
        <div className="wrap grid items-stretch gap-0 lg:grid-cols-12">
          <Photo src="harvest" className="-mx-4 aspect-[4/3] md:-mx-8 lg:col-span-7 lg:mx-0 lg:aspect-auto lg:min-h-[560px]" />
          <div className="flex flex-col justify-center py-16 lg:col-span-5 lg:pl-16">
            <div className="text-[11px] font-semibold uppercase tracking-label text-lime">Harvest and production</div>
            <h3 className="display mt-3 text-[36px] text-white sm:text-[46px]">From the field to the store, accounted for.</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-canvas/75">When a crop approaches harvest, investors are asked how they would like the produce handled. Drying, cleaning, bagging and storage are reported until the cycle closes.</p>
            <Link to="/investors" className="group mt-8 inline-flex items-center gap-2 text-[14px] font-semibold text-mlime">See how harvest decisions work <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
          </div>
        </div>
      </div>

      {/* 4. Farm operations: captioned mosaic */}
      <div className="wrap py-24 sm:py-32">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="eyebrow text-agri">Farm operations and development</div>
            <h3 className="display mt-3 text-[36px] text-ink sm:text-[46px]">The infrastructure behind every season.</h3>
          </div>
          <p className="self-end text-[15px] leading-relaxed text-body lg:col-span-5 lg:col-start-8">Machinery, irrigation and storage are maintained ahead of each cycle. Improvements are planned and shared with investors before work begins.</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-12">
          {[
            { k: 'tractor', t: 'Land preparation', c: 'sm:col-span-5', a: 'aspect-[4/5]' },
            { k: 'irrigation', t: 'Water management', c: 'sm:col-span-4 sm:mt-16', a: 'aspect-[4/5]' },
            { k: 'storage', t: 'Post-harvest storage', c: 'sm:col-span-3 sm:mt-32', a: 'aspect-[3/4]' },
          ].map((x) => (
            <figure key={x.k} className={x.c}>
              <Photo src={x.k} className={`zoom-img w-full rounded-sm ${x.a}`} />
              <figcaption className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[13px] font-semibold text-ink">{x.t}<span className="text-[11px] font-medium text-sage">Illustrative</span></figcaption>
            </figure>
          ))}
        </div>
        <Link to="/what-we-do" state={{ anchor: 'operations' }} className="group mt-10 inline-flex items-center gap-2 text-[14px] font-semibold text-ink">Explore farm operations <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
      </div>
    </section>
  );
}

const benefits = [
  { icon: BarChart3, title: 'Investment overview', body: 'Contributions, active projects and allocation in one calm, private view.' },
  { icon: Newspaper, title: 'Regular farm updates', body: 'Field reports with photographs, readings and notes from the farm managers.' },
  { icon: CalendarClock, title: 'Milestone tracking', body: 'Every stage from planting to post-harvest, with expected and confirmed dates.' },
  { icon: MessagesSquare, title: 'Direct communication', body: 'Message the farm team and record your harvest decisions in the portal.' },
];

function InvestorShowcase() {
  return (
    <section className="bg-pale">
      <div className="wrap py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Investor relations" title={<>Your Investment. A Clearer View of Every Milestone.</>} />
            <ul className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {benefits.map((b) => (
                <li key={b.title} className="border-t border-ink/15 pt-4">
                  <b.icon size={18} className="text-agri" strokeWidth={1.8} />
                  <h3 className="mt-3 text-[15px] font-bold text-ink">{b.title}</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-body">{b.body}</p>
                </li>
              ))}
            </ul>
            <ButtonLink to="/portal" size="lg" className="mt-10" icon={<ArrowRight size={17} />}>Explore the Investor Experience</ButtonLink>
          </div>
          <div className="min-w-0 lg:col-span-7">
            <DashboardPreview />
            <p className="mt-3 text-right text-[11.5px] text-sage">Interface preview with illustrative figures.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function JournalPreview() {
  const { state } = useDemo();
  const pub = state.updates.filter((u) => u.status === 'Published').sort((a, b) => b.date.localeCompare(a.date));
  const byCat = ['Harvest', 'Crop development', 'Livestock', 'Farm operations'].map((c) => pub.find((u) => u.category === c)).filter(Boolean) as typeof pub;
  const [feature, ...rest] = byCat;
  const project = (id: string) => state.projects.find((p) => p.id === id);
  if (!feature) return null;
  return (
    <section className="wrap py-24 sm:py-32">
      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow="Farm journal" title="Notes from the field." />
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <DemoTag>Sample reports · illustrative</DemoTag>
          <Link to="/journal" className="group inline-flex items-center gap-2 text-[14px] font-semibold text-ink">View the full journal <ArrowRight size={15} className="transition group-hover:translate-x-1" /></Link>
        </div>
      </div>
      <div className="grid gap-12 lg:grid-cols-12">
        <UpdateCard u={feature} project={project(feature.projectId)} to={`/journal/${feature.id}`} variant="feature" className="lg:col-span-7" />
        <div className="divide-y divide-line border-y border-line lg:col-span-5">
          {rest.map((u) => <UpdateCard key={u.id} u={u} project={project(u.projectId)} to={`/journal/${u.id}`} variant="row" className="py-5" />)}
        </div>
      </div>
    </section>
  );
}

function Enquiry() {
  return (
    <section id="enquiry" className="border-t border-line bg-white">
      <div className="wrap grid gap-14 py-24 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="Investor enquiry" title="Start a conversation with Super Ages." intro="Tell us what interests you. Our investor relations team will explain current projects, how reporting works and what to expect at each stage." />
          <Photo src="farmerField" className="mt-10 hidden aspect-[16/10] rounded-sm lg:block" />
        </div>
        <div className="min-w-0 lg:col-span-7"><EnquiryForm /></div>
      </div>
    </section>
  );
}

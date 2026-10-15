/**
 * Illustrative demo data. All people, projects, figures and dates are fictional.
 * Shapes mirror what a future API would return (see ./types.ts), so a backend can
 * replace this module without touching the UI components.
 */
import type {
  Investor, Project, Investment, FarmUpdate, HarvestDecision, Conversation,
  Notification, DocumentItem, Activity, Prefs,
} from './types';

/** The demo runs "as of" this date so relative labels stay coherent. */
export const DEMO_TODAY = '2026-10-15T09:00:00';

export const DEMO_INVESTOR_ID = 'inv-emmanuel';

export const investors: Investor[] = [
  { id: 'inv-emmanuel', firstName: 'Emmanuel', lastName: 'Adebayo-Cole', email: 'emmanuel.ac@example.com', phone: '+234 800 000 0141', city: 'Lagos', joined: '2025-12-10', status: 'Active' },
  { id: 'inv-folake', firstName: 'Folake', lastName: 'Ibironke', email: 'folake.i@example.com', phone: '+234 800 000 0207', city: 'Ibadan', joined: '2026-03-22', status: 'Active' },
  { id: 'inv-chukwudi', firstName: 'Chukwudi', lastName: 'Okafor-Hale', email: 'c.okaforhale@example.com', phone: '+234 800 000 0388', city: 'Abuja', joined: '2026-01-18', status: 'Active' },
];

export const projects: Project[] = [
  {
    id: 'p-maize', name: 'Greenfield Maize, Cycle 04', code: 'SA-CR-04', category: 'Crops', enterprise: 'Maize (grain)',
    status: 'Approaching harvest', site: 'Block A · Demo site', area: '42 ha', cycle: 'Apr – Nov 2026',
    harvestWindow: '10 – 24 November 2026', cover: 'maizeField', manager: 'Adaeze Nwosu',
    summary: 'A rain-fed grain maize cycle on Block A, planted in April and now drying down in the field ahead of a November harvest. Investors are asked to record how they would like the harvested grain handled.',
    milestones: [
      { id: 'm-mz-1', title: 'Land preparation', date: '2026-04-06', state: 'completed', confirmed: true, note: 'Ploughing, harrowing and ridging completed across all 42 ha.' },
      { id: 'm-mz-2', title: 'Planting', date: '2026-04-20', state: 'completed', confirmed: true, note: 'Planted over six working days after the first steady rains.', metric: '53,000 plants / ha' },
      { id: 'm-mz-3', title: 'Germination and stand count', date: '2026-05-02', state: 'completed', confirmed: true, note: 'Even emergence recorded in field sampling; two low patches replanted.', metric: 'Emergence 94%' },
      { id: 'm-mz-4', title: 'Growth monitoring (V8 to VT)', date: '2026-07-28', state: 'completed', confirmed: true, note: 'Second fertiliser split applied; no significant pest pressure observed.' },
      { id: 'm-mz-5', title: 'Tasselling and grain fill', date: '2026-09-30', state: 'completed', confirmed: true, note: 'Tasselling completed on schedule, cobs filling well.' },
      { id: 'm-mz-6', title: 'Maturity and field dry-down', date: '2026-10-13', state: 'in_progress', confirmed: true, note: 'Black layer reached. Grain is drying in the field before harvest.', metric: 'Grain moisture 24% · target 15–17%' },
      { id: 'm-mz-7', title: 'Investor harvest instruction', date: '2026-10-31', state: 'attention', confirmed: false, note: 'Record your preferred next step for the harvested grain by 31 October.' },
      { id: 'm-mz-8', title: 'Expected harvest', date: '2026-11-10', state: 'upcoming', confirmed: false, note: 'Harvest window opens subject to moisture readings and weather.' },
      { id: 'm-mz-9', title: 'Post-harvest handling', date: '2026-11-28', state: 'upcoming', confirmed: false, note: 'Drying, shelling, cleaning and bagging before sale or storage.' },
    ],
  },
  {
    id: 'p-cassava', name: 'Cassava Block B', code: 'SA-CR-07', category: 'Crops', enterprise: 'Cassava (roots)',
    status: 'Active', site: 'Block B · Demo site', area: '28 ha', cycle: 'Feb 2026 – Jan 2027',
    harvestWindow: 'January 2027 (expected)', cover: 'cassava', manager: 'Adaeze Nwosu',
    summary: 'A twelve-month cassava cycle with stem cuttings planted in February. The canopy has closed and roots are bulking ahead of an expected early-2027 harvest.',
    milestones: [
      { id: 'm-cs-1', title: 'Planting', date: '2026-02-16', state: 'completed', confirmed: true, note: 'Stem cuttings planted on ridges.', metric: '10,000 stands / ha' },
      { id: 'm-cs-2', title: 'Sprouting', date: '2026-03-05', state: 'completed', confirmed: true, note: 'Sprouting confirmed across the block; gaps filled in week three.', metric: 'Establishment 91%' },
      { id: 'm-cs-3', title: 'Weeding and canopy closure', date: '2026-06-20', state: 'completed', confirmed: true, note: 'Two weeding rounds completed before canopy closure.' },
      { id: 'm-cs-4', title: 'Crop growth review', date: '2026-10-22', state: 'upcoming', confirmed: false, note: 'Sample digs to assess root bulking ahead of the dry season.' },
      { id: 'm-cs-5', title: 'Root bulking check', date: '2026-12-05', state: 'upcoming', confirmed: false, note: 'Second sample dig to refine the harvest estimate.' },
      { id: 'm-cs-6', title: 'Expected harvest', date: '2027-01-18', state: 'upcoming', confirmed: false, note: 'Harvest timing will be confirmed after the December check.' },
      { id: 'm-cs-7', title: 'Post-harvest handling', date: '2027-02-01', state: 'upcoming', confirmed: false, note: 'Roots move to sale or processing within 48 hours of lifting.' },
    ],
  },
  {
    id: 'p-poultry', name: 'Highland Layer Unit', code: 'SA-LV-02', category: 'Livestock', enterprise: 'Poultry (layers)',
    status: 'Active', site: 'Livestock yard · Demo site', area: '1,800 birds', cycle: 'Jan 2026 – Mar 2027',
    cover: 'poultry', manager: 'Ibrahim Sule',
    summary: 'A layer flock housed in a ventilated deep-litter unit. Eggs are graded on site and sold weekly; production and flock health are reported each month.',
    milestones: [
      { id: 'm-pl-1', title: 'Stock acquisition', date: '2026-01-12', state: 'completed', confirmed: true, note: 'Point-of-lay pullets received and settled into the house.', metric: '1,800 birds' },
      { id: 'm-pl-2', title: 'Vaccination and health check', date: '2026-03-02', state: 'completed', confirmed: true, note: 'Scheduled vaccinations and a veterinary inspection completed.' },
      { id: 'm-pl-3', title: 'Peak lay', date: '2026-05-18', state: 'completed', confirmed: true, note: 'Flock reached peak production.', metric: 'Hen-day production 88%' },
      { id: 'm-pl-4', title: 'Health monitoring round', date: '2026-09-08', state: 'completed', confirmed: true, note: 'Routine monitoring; mortality within the planned range.' },
      { id: 'm-pl-5', title: 'Quarterly livestock update', date: '2026-10-20', state: 'upcoming', confirmed: false, note: 'Production, feed conversion and sales summary for Q3.' },
      { id: 'm-pl-6', title: 'Egg sales review', date: '2026-12-15', state: 'upcoming', confirmed: false, note: 'Review of offtake arrangements for the festive season.' },
    ],
  },
  {
    id: 'p-cattle', name: 'Riverside Cattle Finishing', code: 'SA-LV-05', category: 'Livestock', enterprise: 'Beef cattle',
    status: 'Active', site: 'Paddocks 3–5 · Demo site', area: '64 head', cycle: 'Jun 2026 – Feb 2027',
    cover: 'cattle', manager: 'Ibrahim Sule',
    summary: 'A finishing programme for young cattle on pasture with supplementary feeding. Weigh-ins every eight weeks track progress toward sale weight.',
    milestones: [
      { id: 'm-ct-1', title: 'Stock acquisition', date: '2026-06-09', state: 'completed', confirmed: true, note: 'Cattle received, tagged and quarantined.', metric: 'Avg 210 kg live weight' },
      { id: 'm-ct-2', title: 'Health screening', date: '2026-06-16', state: 'completed', confirmed: true, note: 'Veterinary screening and deworming completed.' },
      { id: 'm-ct-3', title: 'First weigh-in', date: '2026-08-25', state: 'completed', confirmed: true, note: 'Weight gain on plan for the pasture phase.', metric: 'Avg daily gain 0.7 kg' },
      { id: 'm-ct-4', title: 'Dry-season feed reserve', date: '2026-10-18', state: 'attention', confirmed: true, note: 'Silage stock is below the planned level. The team is sourcing additional supply.' },
      { id: 'm-ct-5', title: 'Second weigh-in', date: '2026-10-28', state: 'upcoming', confirmed: false, note: 'Weigh-in at the start of the finishing ration.' },
      { id: 'm-ct-6', title: 'Sales milestone', date: '2027-02-10', state: 'upcoming', confirmed: false, note: 'Expected sale window once target weights are reached.' },
    ],
  },
];

export const investments: Investment[] = [
  { id: 'iv-1', investorId: 'inv-emmanuel', projectId: 'p-maize', amount: 6_000_000, date: '2026-03-28', reference: 'SA-INV-2026-0141', status: 'Awaiting decision' },
  { id: 'iv-2', investorId: 'inv-emmanuel', projectId: 'p-cassava', amount: 4_500_000, date: '2026-02-02', reference: 'SA-INV-2026-0098', status: 'Active' },
  { id: 'iv-3', investorId: 'inv-emmanuel', projectId: 'p-poultry', amount: 5_000_000, date: '2025-12-15', reference: 'SA-INV-2025-0412', status: 'Active' },
  { id: 'iv-4', investorId: 'inv-emmanuel', projectId: 'p-cattle', amount: 2_500_000, date: '2026-05-30', reference: 'SA-INV-2026-0203', status: 'Active' },
  { id: 'iv-5', investorId: 'inv-folake', projectId: 'p-maize', amount: 3_500_000, date: '2026-03-30', reference: 'SA-INV-2026-0144', status: 'Awaiting decision' },
  { id: 'iv-6', investorId: 'inv-folake', projectId: 'p-poultry', amount: 2_000_000, date: '2026-04-11', reference: 'SA-INV-2026-0162', status: 'Active' },
  { id: 'iv-7', investorId: 'inv-chukwudi', projectId: 'p-cassava', amount: 8_000_000, date: '2026-01-27', reference: 'SA-INV-2026-0087', status: 'Active' },
  { id: 'iv-8', investorId: 'inv-chukwudi', projectId: 'p-cattle', amount: 5_000_000, date: '2026-06-02', reference: 'SA-INV-2026-0211', status: 'Active' },
];

export const updates: FarmUpdate[] = [
  {
    id: 'u-maize-maturity', title: 'Maize on Block A reaches maturity and begins drying down', projectId: 'p-maize', category: 'Harvest', date: '2026-10-13',
    excerpt: 'Field sampling confirms black layer across the block. Grain is now drying in the field, and the harvest window is expected to open in mid-November.',
    body: [
      'Sampling across twelve points on Block A this week confirmed that the crop has reached physiological maturity. The black layer has formed at the base of the kernels, which means the grain has finished filling and is now losing moisture in the field.',
      'Average grain moisture was 24% at the last reading. We aim to harvest at 15 to 17% to reduce drying costs and protect grain quality, so the team will take readings twice a week from now on.',
      'With dry-down on track, the harvest window is expected to open around 10 November. Investors in this cycle have received a harvest decision request in the portal so the team can plan logistics for each instruction.',
    ],
    cover: 'maizeCob', gallery: ['maizeCob', 'maizeField', 'wheatGold', 'farmerField'],
    video: { title: 'Walking Block A at maturity', duration: '2:14' },
    milestoneId: 'm-mz-6', author: 'Adaeze Nwosu', authorRole: 'Farm Manager', status: 'Published', readMins: 3,
    comments: [
      { id: 'cm-1', author: 'Folake I.', role: 'investor', text: 'Thanks for the detail on moisture targets. Very helpful.', at: '2026-10-13T16:20:00' },
      { id: 'cm-2', author: 'Adaeze Nwosu', role: 'team', text: 'You are welcome. We will post the next reading on Friday.', at: '2026-10-13T17:05:00' },
    ],
  },
  {
    id: 'u-drying-floor', title: 'Drying floor and storage bay prepared ahead of harvest', projectId: 'p-maize', category: 'Farm operations', date: '2026-10-09',
    excerpt: 'The concrete drying floor has been resurfaced and the storage bay fumigated, so grain can be handled quickly once harvest begins.',
    body: [
      'Ahead of the November harvest, the operations team resurfaced the drying floor and repaired two sections of the storage bay roof.',
      'The bay was cleaned and fumigated, and pallets were laid to keep bagged grain off the floor. Storage space is limited and will be allocated in the order instructions are confirmed.',
    ],
    cover: 'storage', gallery: ['storage', 'barn', 'tractor'],
    author: 'Kunle Adeyemi-Ross', authorRole: 'Operations Lead', status: 'Published', readMins: 2, comments: [],
  },
  {
    id: 'u-layers-oct', title: 'Layer unit holds steady production through the rains', projectId: 'p-poultry', category: 'Livestock', date: '2026-10-06',
    excerpt: 'Hen-day production stayed above plan in September despite humid weather, helped by extra ventilation and a revised litter routine.',
    body: [
      'September is usually a demanding month for the layer house because of humidity. The team added two extractor fans and moved to a twice-weekly litter turn.',
      'Production held at an average of 84% hen-day across the month. Egg grading shows a steady share of large eggs, which are in demand with our regular buyers.',
      'The quarterly livestock update with feed conversion and sales figures will follow on 20 October.',
    ],
    cover: 'poultry', gallery: ['poultry', 'eggs', 'barn'],
    milestoneId: 'm-pl-4', author: 'Ibrahim Sule', authorRole: 'Livestock Lead', status: 'Published', readMins: 2,
    comments: [{ id: 'cm-3', author: 'Emmanuel A.', role: 'investor', text: 'Good to see the ventilation upgrade paying off.', at: '2026-10-07T09:12:00' }],
  },
  {
    id: 'u-tassel', title: 'Tasselling complete and grain fill on schedule', projectId: 'p-maize', category: 'Crop development', date: '2026-09-30',
    excerpt: 'Block A completed tasselling and silking within a tight window, a good sign for even grain fill across the field.',
    body: [
      'Tasselling and silking were completed within nine days across Block A. A short, even flowering window usually leads to more uniform cobs.',
      'Scouting found low levels of leaf disease on the lower canopy, well below the threshold for treatment.',
    ],
    cover: 'maizeField', gallery: ['maizeField', 'cropRows', 'farmerField'],
    milestoneId: 'm-mz-5', author: 'Adaeze Nwosu', authorRole: 'Farm Manager', status: 'Published', readMins: 2, comments: [],
  },
  {
    id: 'u-cattle-feed', title: 'Cattle settle into the finishing programme as feed planning begins', projectId: 'p-cattle', category: 'Livestock', date: '2026-09-24',
    excerpt: 'The herd is gaining weight on plan. Planning for the dry season has started, and silage reserves need topping up.',
    body: [
      'The first weigh-in showed an average daily gain of 0.7 kg, in line with the plan for the pasture phase.',
      'Our silage reserve is below the level we planned for the dry season. The team is sourcing additional supply from two growers, and we will confirm the position in the next update.',
    ],
    cover: 'cowsPasture', gallery: ['cowsPasture', 'cattle', 'barn'],
    milestoneId: 'm-ct-4', author: 'Ibrahim Sule', authorRole: 'Livestock Lead', status: 'Published', readMins: 2, comments: [],
  },
  {
    id: 'u-cassava-canopy', title: 'Canopy closure in Cassava Block B', projectId: 'p-cassava', category: 'Crop development', date: '2026-09-18',
    excerpt: 'The cassava canopy has closed across Block B, which suppresses weeds and marks the start of the main root-bulking phase.',
    body: [
      'Canopy closure means less weeding and more of the plant’s energy going into the roots.',
      'A crop growth review with sample digs is planned for 22 October to give a first estimate of root bulking.',
    ],
    cover: 'cassava', gallery: ['cassava', 'seedlings', 'soil'],
    milestoneId: 'm-cs-3', author: 'Adaeze Nwosu', authorRole: 'Farm Manager', status: 'Published', readMins: 2, comments: [],
  },
  {
    id: 'u-layers-vax', title: 'Vaccination round completed for the layer flock', projectId: 'p-poultry', category: 'Livestock', date: '2026-09-10',
    excerpt: 'The scheduled vaccination round and veterinary inspection were completed with no issues recorded.',
    body: ['The flock received its scheduled booster vaccinations, followed by a veterinary inspection of the house and records.'],
    cover: 'eggs', gallery: ['eggs', 'poultry'],
    author: 'Ibrahim Sule', authorRole: 'Livestock Lead', status: 'Published', readMins: 1, comments: [],
  },
];

export const decisions: HarvestDecision[] = [
  { id: 'hd-0412', investorId: 'inv-emmanuel', projectId: 'p-maize', requestedOn: '2026-10-13', respondBy: '2026-10-31', status: 'awaiting_instruction', reference: 'HD-0412' },
  {
    id: 'hd-0413', investorId: 'inv-folake', projectId: 'p-maize', requestedOn: '2026-10-13', respondBy: '2026-10-31', status: 'submitted',
    option: 'sell', note: 'Please proceed with a sale if the offtake terms are in line with the last report.', submittedAt: '2026-10-14T11:32:00', reference: 'HD-0413',
  },
];

export const conversations: Conversation[] = [
  {
    id: 'cv-1', investorId: 'inv-emmanuel', subject: 'Maize harvest timing', projectId: 'p-maize', teamMember: 'Adaeze Nwosu', teamRole: 'Farm Manager',
    unreadInvestor: 1, unreadTeam: 0,
    messages: [
      { id: 'ms-1', from: 'team', author: 'Adaeze Nwosu', text: 'Good afternoon Emmanuel. Block A has reached maturity and the crop is drying down well. I have attached the latest field readings.', at: '2026-10-12T14:05:00', attachment: 'Block-A-moisture-readings.pdf' },
      { id: 'ms-2', from: 'investor', author: 'Emmanuel', text: 'Thank you, Adaeze. How firm is the 10 November date? I would like to plan around it.', at: '2026-10-12T18:40:00' },
      { id: 'ms-3', from: 'team', author: 'Adaeze Nwosu', text: 'It depends on moisture and weather. We will confirm a week ahead. In the meantime, please record your harvest instruction in the portal when you are ready.', at: '2026-10-14T10:15:00' },
    ],
  },
  {
    id: 'cv-2', investorId: 'inv-emmanuel', subject: 'Q3 farm report', teamMember: 'Tunde Bakare', teamRole: 'Investor Relations',
    unreadInvestor: 0, unreadTeam: 0,
    messages: [
      { id: 'ms-4', from: 'team', author: 'Tunde Bakare', text: 'Hello Emmanuel, the Q3 2026 farm report is now in your documents. Let me know if anything needs clarifying.', at: '2026-10-02T09:30:00' },
      { id: 'ms-5', from: 'investor', author: 'Emmanuel', text: 'Received, thank you. The new photo sections are very clear.', at: '2026-10-02T12:02:00' },
    ],
  },
  {
    id: 'cv-3', investorId: 'inv-emmanuel', subject: 'Cattle feed reserve', projectId: 'p-cattle', teamMember: 'Ibrahim Sule', teamRole: 'Livestock Lead',
    unreadInvestor: 0, unreadTeam: 0,
    messages: [
      { id: 'ms-6', from: 'investor', author: 'Emmanuel', text: 'I saw the note on silage reserves. Is there anything investors need to do?', at: '2026-09-25T08:10:00' },
      { id: 'ms-7', from: 'team', author: 'Ibrahim Sule', text: 'Nothing is needed from you at this stage. We are sourcing supply and will confirm the position in the next update.', at: '2026-09-25T11:45:00' },
    ],
  },
  {
    id: 'cv-4', investorId: 'inv-folake', subject: 'Sale instruction for Block A', projectId: 'p-maize', teamMember: 'Adaeze Nwosu', teamRole: 'Farm Manager',
    unreadInvestor: 0, unreadTeam: 1,
    messages: [{ id: 'ms-8', from: 'investor', author: 'Folake', text: 'I have recorded a sale instruction. Could you share the offtake terms when they are agreed?', at: '2026-10-14T11:40:00' }],
  },
  {
    id: 'cv-5', investorId: 'inv-chukwudi', subject: 'Cassava harvest window', projectId: 'p-cassava', teamMember: 'Tunde Bakare', teamRole: 'Investor Relations',
    unreadInvestor: 0, unreadTeam: 1,
    messages: [{ id: 'ms-9', from: 'investor', author: 'Chukwudi', text: 'Will the January harvest estimate be updated after the October review?', at: '2026-10-13T15:20:00' }],
  },
];

export const notifications: Notification[] = [
  { id: 'nt-1', investorId: 'inv-emmanuel', kind: 'decision', title: 'Harvest decision requested', body: 'Greenfield Maize, Cycle 04 is approaching harvest. Record your instruction by 31 October.', at: '2026-10-13T09:00:00', read: false, to: '/portal/harvest' },
  { id: 'nt-2', investorId: 'inv-emmanuel', kind: 'message', title: 'New message from Adaeze Nwosu', body: 'It depends on moisture and weather. We will confirm a week ahead…', at: '2026-10-14T10:15:00', read: false, to: '/portal/messages/cv-1' },
  { id: 'nt-3', investorId: 'inv-emmanuel', kind: 'update', title: 'New farm update published', body: 'Maize on Block A reaches maturity and begins drying down.', at: '2026-10-13T12:30:00', read: false, to: '/portal/updates/u-maize-maturity' },
  { id: 'nt-4', investorId: 'inv-emmanuel', kind: 'milestone', title: 'Upcoming milestone: crop growth review', body: 'Cassava Block B sample digs are planned for 22 October.', at: '2026-10-12T08:00:00', read: true, to: '/portal/milestones' },
  { id: 'nt-5', investorId: 'inv-emmanuel', kind: 'document', title: 'Q3 2026 farm report available', body: 'The quarterly report is now in your documents.', at: '2026-10-02T09:30:00', read: true, to: '/portal/documents' },
  { id: 'nt-6', investorId: 'inv-emmanuel', kind: 'milestone', title: 'Upcoming: quarterly livestock update', body: 'Highland Layer Unit production summary due 20 October.', at: '2026-10-01T08:00:00', read: true, to: '/portal/milestones' },
  { id: 'nt-7', investorId: 'inv-emmanuel', kind: 'update', title: 'New farm update published', body: 'Layer unit holds steady production through the rains.', at: '2026-10-06T15:10:00', read: true, to: '/portal/updates/u-layers-oct' },
];

export const documents: DocumentItem[] = [
  { id: 'dc-1', projectId: 'p-maize', title: 'Project information sheet: Greenfield Maize, Cycle 04', type: 'Project sheet', format: 'PDF', size: '1.2 MB', date: '2026-03-14', summary: 'Scope, site, crop plan, budget headings and reporting schedule for the cycle.' },
  { id: 'dc-2', title: 'Q3 2026 farm report', type: 'Farm report', format: 'PDF', size: '4.8 MB', date: '2026-10-02', summary: 'Quarterly progress across all active projects, with photographs and field notes.' },
  { id: 'dc-3', projectId: 'p-maize', title: 'Harvest report: Maize Cycle 03 (sample)', type: 'Harvest report', format: 'PDF', size: '2.1 MB', date: '2025-12-19', summary: 'Example of the post-harvest report format: yield, handling and outcomes.' },
  { id: 'dc-4', investorId: 'inv-emmanuel', projectId: 'p-maize', title: 'Contribution record SA-INV-2026-0141', type: 'Contribution record', format: 'PDF', size: '180 KB', date: '2026-03-28', summary: 'Record of contribution to Greenfield Maize, Cycle 04.' },
  { id: 'dc-5', investorId: 'inv-emmanuel', projectId: 'p-poultry', title: 'Contribution record SA-INV-2025-0412', type: 'Contribution record', format: 'PDF', size: '176 KB', date: '2025-12-15', summary: 'Record of contribution to Highland Layer Unit.' },
  { id: 'dc-6', investorId: 'inv-emmanuel', title: 'Participation agreement (placeholder)', type: 'Agreement', format: 'PDF', size: '320 KB', date: '2025-12-10', summary: 'Sample agreement placeholder. The final document will be supplied by Super Ages.' },
  { id: 'dc-7', projectId: 'p-poultry', title: 'Project information sheet: Highland Layer Unit', type: 'Project sheet', format: 'PDF', size: '940 KB', date: '2025-12-01', summary: 'Flock plan, housing, health programme and sales arrangements.' },
  { id: 'dc-8', projectId: 'p-cattle', title: 'Weigh-in log: Riverside Cattle Finishing', type: 'Farm report', format: 'XLSX', size: '64 KB', date: '2026-08-26', summary: 'Individual and average weights from the first weigh-in.' },
  { id: 'dc-9', projectId: 'p-cassava', title: 'Project information sheet: Cassava Block B', type: 'Project sheet', format: 'PDF', size: '1.0 MB', date: '2026-01-20', summary: 'Crop plan, planting density and expected harvest timing.' },
];

export const activity: Activity[] = [
  { id: 'ac-1', at: '2026-10-14T11:40:00', who: 'Folake Ibironke', text: 'sent a message about Block A', to: '/admin/messages/cv-4' },
  { id: 'ac-2', at: '2026-10-14T11:32:00', who: 'Folake Ibironke', text: 'recorded a harvest instruction (Sell) for Greenfield Maize', to: '/admin/decisions' },
  { id: 'ac-3', at: '2026-10-13T15:20:00', who: 'Chukwudi Okafor-Hale', text: 'asked about the cassava harvest window', to: '/admin/messages/cv-5' },
  { id: 'ac-4', at: '2026-10-13T12:30:00', who: 'Adaeze Nwosu', text: 'published “Maize on Block A reaches maturity”', to: '/admin/publishing' },
  { id: 'ac-5', at: '2026-10-13T09:00:00', who: 'System', text: 'sent harvest decision requests to 2 investors', to: '/admin/decisions' },
];

export const defaultPrefs: Prefs = { email: true, sms: false, updates: true, milestones: true, decisions: true, digest: 'Weekly' };

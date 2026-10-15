/**
 * Central photo library. Every photograph in the demo is referenced by key,
 * so swapping in real Super Ages farm photography means editing this file only.
 * Placeholders are Unsplash photographs; if one cannot load (offline, blocked
 * host), the <Photo> component shows a branded placeholder with the caption.
 */
export type PhotoKey =
  | 'heroField' | 'wheatGold' | 'cropRows' | 'seedlings' | 'maizeField' | 'maizeCob'
  | 'cassava' | 'greenhouse' | 'cattle' | 'cowsPasture' | 'poultry' | 'eggs'
  | 'farmerHands' | 'farmerField' | 'harvest' | 'produce' | 'tractor' | 'irrigation'
  | 'barn' | 'soil' | 'aerial' | 'storage' | 'team' | 'sunriseField';

const u = (id: string, w = 1800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`;

export const photos: Record<PhotoKey, { src: string; caption: string; tone: 'field' | 'earth' | 'gold' }> = {
  heroField:   { src: u('photo-1500382017468-9049fed747ef', 2400), caption: 'Open farmland at first light', tone: 'gold' },
  sunriseField:{ src: u('photo-1499529112087-3cb3b73cec95', 2400), caption: 'Crop field at sunrise', tone: 'gold' },
  wheatGold:   { src: u('photo-1574323347407-f5e1ad6d020b'), caption: 'Grain field ready for harvest', tone: 'gold' },
  cropRows:    { src: u('photo-1464226184884-fa280b87c399'), caption: 'Crop rows in early growth', tone: 'field' },
  seedlings:   { src: u('photo-1523348837708-15d4a09cfac2'), caption: 'Seedlings after germination', tone: 'field' },
  maizeField:  { src: u('photo-1595841696677-6489ff3f8cd1'), caption: 'Maize field, tasselling stage', tone: 'field' },
  maizeCob:    { src: u('photo-1551754655-cd27e38d2076'), caption: 'Maize cobs at maturity', tone: 'gold' },
  cassava:     { src: u('photo-1530836369250-ef72a3f5cda8'), caption: 'Leafy canopy in a root-crop block', tone: 'field' },
  greenhouse:  { src: u('photo-1585320806297-9794b3e4eeae'), caption: 'Nursery and seedling house', tone: 'field' },
  cattle:      { src: u('photo-1516253593875-bd7ba052fbc5'), caption: 'Cattle in an open paddock', tone: 'earth' },
  cowsPasture: { src: u('photo-1570042225831-d98fa7577f1e'), caption: 'Herd grazing on pasture', tone: 'earth' },
  poultry:     { src: u('photo-1548550023-2bdb3c5beed7'), caption: 'Free-moving poultry flock', tone: 'earth' },
  eggs:        { src: u('photo-1506976785307-8732e854ad03'), caption: 'Graded eggs from the layer unit', tone: 'gold' },
  farmerHands: { src: u('photo-1592982537447-7440770cbfc9'), caption: 'Hands in freshly turned soil', tone: 'earth' },
  farmerField: { src: u('photo-1605000797499-95a51c5269ae'), caption: 'Field team walking the rows', tone: 'field' },
  harvest:     { src: u('photo-1625246333195-78d9c38ad449'), caption: 'Harvest in progress', tone: 'gold' },
  produce:     { src: u('photo-1488459716781-31db52582fe9'), caption: 'Sorted produce after harvest', tone: 'gold' },
  tractor:     { src: u('photo-1530267981375-f0de937f5f13'), caption: 'Tractor preparing the field', tone: 'earth' },
  irrigation:  { src: u('photo-1563514227147-6d2ff665a6a0'), caption: 'Irrigation lines across the block', tone: 'field' },
  barn:        { src: u('photo-1500076656116-558758c991c1'), caption: 'Farm buildings and yard', tone: 'earth' },
  soil:        { src: u('photo-1416879595882-3373a0480b5b'), caption: 'Young plants and prepared beds', tone: 'field' },
  aerial:      { src: u('photo-1586771107445-d3ca888129ff', 2400), caption: 'Aerial view of planted blocks', tone: 'field' },
  storage:     { src: u('photo-1595855759920-86582396756a'), caption: 'Post-harvest storage and handling', tone: 'earth' },
  team:        { src: u('photo-1560493676-04071c5f467b'), caption: 'Farm team on site', tone: 'field' },
};

export const photoKeys = Object.keys(photos) as PhotoKey[];

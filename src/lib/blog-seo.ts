// ─── Blog SEO Content Generator ─────────────────────────────────────────────
// One place that turns a product into:
//   short-tail keywords, long-tail keywords, rank-ready title options,
//   meta description, content outline, and ready-to-paste blog HTML with
//   internal links baked in (blog -> product -> RFQ / contact / home).

export const TITLE_MAX = 60;
export const DESC_MAX = 160;

export interface BlogProduct {
  id: string;
  partNumber: string;
  nsn?: string;
  cage?: string;
  description?: string;
  shortDescription?: string;
  manufacturer?: string;
  category?: string;
  condition?: string;
  tags?: string[];
}

export interface Generated {
  short: string[];
  long: string[];
  titles: string[];
  description: string;
  cat: string;
  mfg: string;
  part: string;
  focusKw: string;
}

export interface OutlineSection {
  h2: string;
  intro: string;
  bullets: string[];
  internal: string; // "url|label|desc"
}

// ─── small helpers ──────────────────────────────────────────────────────────
function titleCase(s: string): string {
  return s
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

// ─── keywords + title + description ─────────────────────────────────────────
export function generate(model: BlogProduct, focusKw = ''): Generated {
  const part = (model.partNumber || '').trim();
  const mfg = (model.manufacturer || 'turbine').trim();
  const isVarious = mfg.toLowerCase() === 'various';
  const cat = cleanTag(model.category || '').toLowerCase() || 'gas turbine';
  const shortDesc = (model.shortDescription || model.description || 'turbine spare parts')
    .replace(/[.,;:]+/g, '')
    .trim();
  const tagWords = (model.tags || []).map(cleanTag).map((t) => t.toLowerCase());
  const base =
    tagWords.find((t) => /turbine|blade|nozzle|liner|combust|shroud|rotor|disc/.test(t)) ||
    (cat === 'hot-stock' ? 'turbine spare' : cat);
  const tail = nsnTail(model);
  const mfgLow = isVarious ? '' : mfg.toLowerCase() + ' ';

  // Short-tail (head terms)
  const short = uniq([
    base,
    'gas turbine parts',
    ...(isVarious ? [] : [`${mfg} turbine parts`]),
    'turbine spare parts',
    'turbine parts supplier',
  ]);

  // Long-tail (user-search, transactional, question style)
  const long = uniq([
    ...(part ? [`${part} turbine spare part`, `${part} for sale`, `${part} spare part price`] : []),
    ...(tail ? [`${tail} ${base} parts`] : []),
    `${cat} spare parts for sale`,
    `best ${mfgLow}turbine parts supplier`,
    `buy ${mfgLow}${base} parts online`,
    `${base} for gas turbine overhaul`,
    `where to buy ${base} spare parts`,
    ...(shortDesc ? [`${shortDesc.toLowerCase()} - ${mfg} spare parts`] : []),
    `${cat} parts with OEM cross reference`,
    'gas turbine parts with 24 hour quote',
    'ISO 9001 AS9120 certified turbine parts',
    ...(focusKw ? [focusKw] : []),
  ]);

  // Title options (keyword first, <=60 chars, no AI-style words)
  const kw = shortDesc.split(' ').slice(0, 3).join(' ').toLowerCase();
  const titles = uniq([
    ...(kw
      ? [
          titleCase(`${kw} - ${isVarious ? 'Turbine' : mfg} Spare Parts`),
          titleCase(`${kw} for Sale | ${isVarious ? 'Gas Turbine' : mfg} Parts`),
        ]
      : []),
    titleCase(`${base} Parts - ${isVarious ? 'Certified Supplier' : mfg} Supply`),
    titleCase(`How to Source ${base} Spare Parts`),
    titleCase(`${isVarious ? '' : mfg + ' '}Turbine Spare Parts`),
  ]);

  // Description (<=160, keyword first)
  const description = (() => {
    const lead = shortDesc ? titleCase(shortDesc) : 'Find quality turbine spare parts';
    let d = `${lead}. ${isVarious ? '' : mfg + ' '}${base} with OEM cross-reference${part ? ` (PN ${part})` : ''}. ISO 9001 & AS9120 certified. 24-hour quotes, worldwide shipping.`;
    if (d.length > DESC_MAX) d = `${d.slice(0, DESC_MAX - 1).replace(/\s+\S*$/, '')}...`;
    return d;
  })();

  return {
    short,
    long,
    titles,
    description,
    cat,
    mfg: isVarious ? 'Certified' : mfg,
    part,
    focusKw: focusKw || long[0] || base,
  };
}

function cleanTag(s: string): string {
  return s.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function nsnTail(p: BlogProduct): string {
  if (!p.nsn) return '';
  const segs = p.nsn.split('-');
  return segs.slice(-2).join('-');
}

const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

// ─── content outline ────────────────────────────────────────────────────────
export function buildOutline(model: BlogProduct, kw: Generated): OutlineSection[] {
  const { mfg, cat, part } = kw;
  const base = kw.short[0] || 'gas turbine parts';
  const link = `/catalog/${model.id}`;

  return [
    {
      h2: `Quality ${titleCase(base)} for Every Job`,
      intro: `This guide explains what ${base} are used for, common part numbers, and how to get a certified quote fast.`,
      bullets: [
        `What ${base} are used for`,
        `How to check if a part number matches your unit`,
        `OEM cross reference vs aftermarket options`,
      ],
      internal: `/rfq|request a quote|Get a quote in 24 hours for ${base}.`,
    },
    {
      h2: `${titleCase(mfg)} Spare Parts - What to Check Before Buying`,
      intro: `Before you buy ${cat} spare parts you want the right part number, the right build, and a supplier you can trust.`,
      bullets: [
        `Confirm the part number${part ? ` (like ${part})` : ''} against your parts manual`,
        `Check material, coating, and latest inspection level`,
        `Ask for full traceability and certificates`,
      ],
      internal: `${link}|see the ${model.partNumber || 'part'}|Open the ${model.partNumber || 'exact part'} listing in our catalog.`,
    },
    {
      h2: `Gas Turbine Parts With OEM Cross Reference`,
      intro: `Every ${cat} component we supply is cross referenced to the original part, so you can be confident about fit and function.`,
      bullets: [
        `OEM cross reference included with every part`,
        `NSN and CAGE data on file`,
        `Ships with chain-of-custody documents`,
      ],
      internal: `/categories|browse all categories|See every part category we stock.`,
    },
    {
      h2: `How Long Does It Take to Get ${titleCase(base)}?`,
      intro: `Most in-stock parts dispatch the same day. Large or hard-to-find items are quoted within 24 hours.`,
      bullets: [
        `In-stock parts ship fast`,
        `AOG emergency requests are handled first`,
        `24-hour quote response on every RFQ`,
      ],
      internal: `/rfq|request a quote|Submit an RFQ and get a certified quote fast.`,
    },
    {
      h2: `Buy With Confidence - ISO 9001 & AS9120`,
      intro: `We are a certified aerospace and gas turbine parts supplier, so you can order ${cat} spare parts without guessing about quality.`,
      bullets: [
        `ISO 9001:2015 and AS9120 Rev B certified`,
        `Every part traceable to source`,
        `12-month warranty on supplied parts`,
      ],
      internal: `/contact|talk to a specialist|Tell us your part number and we will help source it.`,
    },
  ];
}


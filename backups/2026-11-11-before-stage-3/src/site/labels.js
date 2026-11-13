export const STAGE_LABEL = {
  upcoming: 'New launch',
  'under-construction': 'Under construction',
  ready: 'Ready to move'
};

/** How trustworthy a property's figures are, in words a buyer understands. */
export function dataNotice(p) {
  if (!p) return null;
  if (p.mode === 'prototype') return 'Prototype · illustrative only, no inventory';
  if (p.fictional) return 'Fictional demo project · all details are samples';
  if (p.mode === 'demo') return 'Demo · sample data';
  return null;
}

/** "Sample location · Demo city" */
export const placeLine = (p) => [p?.location, p?.city].filter(Boolean).join(' · ');

/** "2 towers · 160 homes · 2, 3 and 4 BHK" from a catalogue summary. */
export function specLine(p) {
  if (!p) return [];
  const parts = [];
  if (p.towers) parts.push(`${p.towers} ${p.towers === 1 ? 'tower' : 'towers'}`);
  if (p.floors) parts.push(p.towers > 1 ? `up to ${p.floors} floors` : `${p.floors} floors`);
  if (p.units?.total) parts.push(`${p.units.total} homes`);
  if (p.configurations?.length) parts.push(joinWords(p.configurations.map((c) => c.replace(/\s*BHK$/i, ''))) + (p.configurations.every((c) => /BHK$/i.test(c)) ? ' BHK' : ''));
  return parts;
}

const joinWords = (list) => (list.length < 2 ? list.join('') : `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`);

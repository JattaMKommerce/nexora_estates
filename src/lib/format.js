export const levelName = (n) => (n === 0 ? 'Ground Level' : `Level ${n}`);
export const levelShort = (n) => (n === 0 ? 'G' : String(n));

export const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

const TYPE_LABELS = {
  '1BHK': '1 BHK',
  '2BHK': '2 BHK',
  '3BHK': '3 BHK',
  '4BHK': '4 BHK',
  PENTHOUSE: 'Penthouse',
  RETAIL: 'Retail',
  OFFICE: 'Office',
  PLOT: 'Plot'
};
export const unitTypeLabel = (t) => TYPE_LABELS[t] || t || 'Unit';

export const initials = (name) =>
  (name || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/** "2026-11-10" → "10 Nov 2026" (local date, no time-zone shift). Other text is shown as written. */
export const dateLabel = (value) => {
  if (!value) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return value;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

export const cls = (...parts) => parts.filter(Boolean).join(' ');

/** ₹ amounts read as lakh / crore; other currencies use the browser's currency format. */
export function formatPrice(value, currency = 'INR') {
  if (value === null || value === undefined) return null;
  const trim = (n) => n.toFixed(2).replace(/\.?0+$/, '');
  if (currency === 'INR') {
    if (value >= 1e7) return `₹${trim(value / 1e7)} Cr`;
    if (value >= 1e5) return `₹${trim(value / 1e5)} L`;
    return `₹${Math.round(value).toLocaleString('en-IN')}`;
  }
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
  } catch {
    return `${currency} ${Math.round(value).toLocaleString()}`;
  }
}

export function formatArea(value, unit = 'sqft') {
  if (value === null || value === undefined) return null;
  return `${Math.round(value).toLocaleString('en-IN')} ${unit === 'sqm' ? 'm²' : 'sq ft'}`;
}

export const STATUS_LABEL = {
  available: 'Available',
  hold: 'On hold',
  booked: 'Booked',
  sold: 'Sold',
  unknown: 'Status not provided',
  none: 'No inventory data'
};

export const bedroomsLabel = (b) => (b === 0 ? 'Studio' : b === null || b === undefined ? 'Residence' : `${b} BHK`);

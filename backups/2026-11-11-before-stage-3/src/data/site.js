/**
 * Site settings from `public/site.json`: the company that runs the website, its contact details,
 * social links and where forms are sent. Everything is optional. A missing value stays empty and
 * the interface says "to be added"; nothing is made up.
 */
const str = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);
const HEX = /^#[0-9a-f]{6}$/i;

function httpUrl(v) {
  const s = str(v);
  if (!s) return null;
  try {
    const u = new URL(s);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : null;
  } catch {
    return null;
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function toSiteModel(raw) {
  const o = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const brand = o.brand || {};
  const company = o.company || {};
  const forms = o.forms || {};
  return {
    brand: {
      name: str(brand.name) || 'Restate',
      tagline: str(brand.tagline),
      logo: str(brand.logo),
      accent: HEX.test(str(brand.accent) || '') ? brand.accent : null
    },
    company: {
      legalName: str(company.legalName),
      email: EMAIL.test(str(company.email) || '') ? company.email.trim() : null,
      phone: str(company.phone),
      address: str(company.address),
      hours: str(company.hours)
    },
    social: (Array.isArray(o.social) ? o.social : [])
      .map((s) => ({ label: str(s?.label), url: httpUrl(s?.url) }))
      .filter((s) => s.label && s.url),
    forms: {
      // Where enquiry, site-visit and demo forms are POSTed. null = not connected: forms say so and
      // never claim a message was sent.
      endpoint: httpUrl(forms.endpoint) || (str(forms.endpoint)?.startsWith('/') ? str(forms.endpoint) : null)
    },
    defaultProperty: str(o.defaultProperty)
  };
}

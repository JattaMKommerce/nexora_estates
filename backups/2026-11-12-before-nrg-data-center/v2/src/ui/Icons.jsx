/** Simple line icons (24×24, stroke = currentColor). */
const P = {
  road: 'M8 3 5 21M16 3l3 18M12 5v2.5M12 10.5v3M12 16.5V19',
  drop: 'M12 3.5s6 6.4 6 10.6a6 6 0 0 1-12 0C6 9.9 12 3.5 12 3.5Z',
  bolt: 'M13 2.5 5.5 13.5H12l-1 8 7.5-11H12l1-8Z',
  boundary: 'M4 6l7-3 9 4-2 12-12 2-2-15ZM4 6h0M11 3h0M20 7h0M18 19h0M6 21h0',
  layers: 'M12 3 3 8l9 5 9-5-9-5ZM3 12.5l9 5 9-5M3 17l9 5 9-5',
  height: 'M5 21h14M12 3v14M8.5 6.5 12 3l3.5 3.5M8.5 13.5 12 17l3.5-3.5',
  cube: 'M12 2.8 20 7.2v9.6l-8 4.4-8-4.4V7.2l8-4.4ZM12 12l8-4.6M12 12 4 7.4M12 12v9.2',
  sun: 'M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8',
  eye: 'M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  pin: 'M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11ZM12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z',
  leaf: 'M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l7-7',
  truck: 'M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7M6 18.5a1.6 1.6 0 1 0 0-.1M17 18.5a1.6 1.6 0 1 0 0-.1',
  dig: 'M3 20h18M6 20v-6h8v6M10 14V9l7-5 3 3-5 4',
  crane: 'M6 21V4M6 4h15M6 4 3 7h3M18 4v5M16.5 9h3M6 9l5-5M6 14l5-5M3 21h6',
  building: 'M5 21V5l7-2.5L19 5v16M9 8h1.5M13.5 8H15M9 12h1.5M13.5 12H15M9 16h1.5M13.5 16H15M3 21h18',
  facade: 'M4 3h16v18H4zM4 9h16M4 15h16M9.3 3v18M14.7 3v18',
  home: 'M3 11 12 4l9 7M5.5 9.5V20h13V9.5M10 20v-5.5h4V20',
  chat: 'M4 5h16v11H9l-5 4V5ZM8 9.5h8M8 12.5h5',
  key: 'M14.5 4a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM10.5 13.5 3 21M6 18l2.5 2.5M8.5 15.5 11 18',
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6 6 18',
  arrowDown: 'M12 4v16M6 14l6 6 6-6',
  arrowRight: 'M4 12h16M14 6l6 6-6 6',
  arrowLeft: 'M20 12H4M10 6l-6 6 6 6',
  menu: 'M4 8h16M4 16h16',
  drag: 'M8 12H3m0 0 3-3m-3 3 3 3M16 12h5m0 0-3-3m3 3-3 3M12 8V3m0 0L9 6m3-3 3 3'
};

export default function Icon({ name, size = 20, stroke = 1.6, className }) {
  if (name === 'sparkle')
    return (
      <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.5c.7 5 2.5 6.8 7.5 7.5-5 .7-6.8 2.5-7.5 7.5-.7-5-2.5-6.8-7.5-7.5 5-.7 6.8-2.5 7.5-7.5Z" fill="currentColor" transform="translate(0 2)" />
      </svg>
    );
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[name] || P.plus} />
    </svg>
  );
}

export function Mark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path d="M10 24V11l6-3 6 3v13M13 14h6M13 18h6" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Line icons for the website (24px grid, 1.6 stroke, currentColor). */

const Svg = ({ children, ...p }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...p}>
    {children}
  </svg>
);

export const IconArrow = (p) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const IconPlay = (p) => (
  <Svg {...p}>
    <path d="M8 5.5v13l10.5-6.5z" />
  </Svg>
);

export const IconExpand = (p) => (
  <Svg {...p}>
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </Svg>
);

export const IconBuilding = (p) => (
  <Svg {...p}>
    <path d="M6 21V4.5L14 3v18M14 9h4v12M4 21h16M9 7.5h2M9 11h2M9 14.5h2" />
  </Svg>
);

export const IconLayers = (p) => (
  <Svg {...p}>
    <path d="M12 4 3 8.5l9 4.5 9-4.5L12 4zM3 13l9 4.5 9-4.5M3 17.5 12 22l9-4.5" />
  </Svg>
);

export const IconPlan = (p) => (
  <Svg {...p}>
    <path d="M4 4h16v16H4zM4 12h7M11 4v11M15 12h5M15 12v8" />
  </Svg>
);

export const IconSofa = (p) => (
  <Svg {...p}>
    <path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3zM6 18v2M18 18v2" />
  </Svg>
);

export const IconPanorama = (p) => (
  <Svg {...p}>
    <path d="M3 7c6 2 12 2 18 0v10c-6-2-12-2-18 0zM12 9.5v5" />
  </Svg>
);

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false
};

export const IconFocus = (p) => (
  <svg {...base} {...p}>
    <path d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

export const IconOrbit = (p) => (
  <svg {...base} {...p}>
    <ellipse cx="12" cy="12" rx="9" ry="4" />
    <path d="M12 3v18" opacity="0.5" />
    <path d="M18.5 6.5 21 8l-1.2 2.6" />
  </svg>
);

export const IconExpand = (p) => (
  <svg {...base} {...p}>
    <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
  </svg>
);

export const IconCollapse = (p) => (
  <svg {...base} {...p}>
    <path d="M20 10h-6V4M4 14h6v6M14 10l7-7M10 14l-7 7" />
  </svg>
);

export const IconArrowLeft = (p) => (
  <svg {...base} {...p}>
    <path d="M19 12H5M11 18l-6-6 6-6" />
  </svg>
);

export const IconArrowUp = (p) => (
  <svg {...base} {...p}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);

export const IconArrowDown = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M18 13l-6 6-6-6" />
  </svg>
);

export const IconBuilding = (p) => (
  <svg {...base} {...p}>
    <path d="M6 21V4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21M3 21h18M10 7h1M13 7h1M10 11h1M13 11h1M10 15h1M13 15h1" />
  </svg>
);

export const IconPlay = (p) => (
  <svg {...base} {...p}>
    <path d="M8 5.5v13l10.5-6.5z" />
  </svg>
);

export const IconPause = (p) => (
  <svg {...base} {...p}>
    <path d="M8.5 5.5v13M15.5 5.5v13" />
  </svg>
);

export const IconNext = (p) => (
  <svg {...base} {...p}>
    <path d="M6 5.5v13l9-6.5zM18 5.5v13" />
  </svg>
);

export const IconPlan = (p) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" />
    <path d="M3.5 12h7M10.5 3.5v5M14 12h6.5M14 12v8.5M10.5 15v5.5" />
  </svg>
);

export const IconDoor = (p) => (
  <svg {...base} {...p}>
    <path d="M5 20.5h14M7 20.5V4.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16" />
    <circle cx="14" cy="12.5" r="0.9" />
  </svg>
);

export const Icon360 = (p) => (
  <svg {...base} {...p}>
    <ellipse cx="12" cy="12" rx="9.5" ry="4.5" />
    <path d="M7 16.2 4.6 18.6M7 16.2l2.6.4" />
    <circle cx="12" cy="12" r="1.6" />
  </svg>
);

export const IconPlus = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = (p) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
);

export const IconClose = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const IconExternal = (p) => (
  <svg {...base} {...p}>
    <path d="M14 4.5h5.5V10M19.5 4.5 11 13M17 14v4.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1H10" />
  </svg>
);

export const IconSofa = (p) => (
  <svg {...base} {...p}>
    <path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M3.5 12.5a1.5 1.5 0 0 1 3 0V14h11v-1.5a1.5 1.5 0 0 1 3 0V17a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1zM6 18v1.5M18 18v1.5" />
  </svg>
);

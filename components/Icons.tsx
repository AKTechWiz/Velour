import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  width: 20, height: 20, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const, ...props,
});

export const IconSearch = (p: P) => (
  <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);

export const IconBag = (p: P) => (
  <svg {...base(p)}><path d="M6 8h12l-1 12H7L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
);

export const IconUser = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" /></svg>
);

export const IconMenu = (p: P) => (
  <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);

export const IconClose = (p: P) => (
  <svg {...base(p)}><path d="m6 6 12 12M18 6 6 18" /></svg>
);

export const IconArrowDown = (p: P) => (
  <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>
);

export const IconChevronRight = (p: P) => (
  <svg {...base(p)}><path d="m9 6 6 6-6 6" /></svg>
);

export const IconTrash = (p: P) => (
  <svg {...base(p)}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
);

export const IconPlus = (p: P) => (
  <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>
);

export const IconMinus = (p: P) => (
  <svg {...base(p)}><path d="M5 12h14" /></svg>
);

export const IconInstagram = (p: P) => (
  <svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" /></svg>
);

export const IconX = (p: P) => (
  <svg {...base(p)}><path d="M4 4l7.2 9.6L4.4 20h2.6l5.4-5.4L16.8 20H20l-7.5-10L19.3 4h-2.6l-4.7 4.9L8 4H4Z" fill="currentColor" stroke="none" /></svg>
);

export const IconFacebook = (p: P) => (
  <svg {...base(p)}><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8Z" fill="currentColor" stroke="none" /></svg>
);

export const IconSun = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

export const IconMoon = (p: P) => (
  <svg {...base(p)}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
);

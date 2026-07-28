// Minimal hand-drawn line-icon set, all self-contained inline SVG (no external assets/fonts).
const EMS_ICONS = {
  compass: '<circle cx="12" cy="12" r="9"/><path d="M14.5 9.5 13 13l-3.5 1.5L11 11z"/>',
  kit: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M12 12v4M10 14h4"/>',
  chart: '<path d="M4 19V5M4 19h16"/><path d="M8 15l3-4 3 2 4-6"/>',
  bandage: '<path d="M6 6 18 18"/><rect x="3.5" y="9.5" width="17" height="5" rx="2.5" transform="rotate(45 12 12)"/><circle cx="8.5" cy="8.5" r="1"/><circle cx="15.5" cy="15.5" r="1"/>',
  flame: '<path d="M12 3c1 3-3 4-3 8a3 3 0 0 0 6 0c1 1 1.5 2.5 1.5 4A4.5 4.5 0 0 1 12 20a5 5 0 0 1-5-5c0-3.5 2.5-4.5 2-8 1.5.5 2.5 2 2.5 4 1-.5.5-3-.5-4Z"/>',
  radio: '<circle cx="12" cy="14" r="2.5"/><path d="M12 11.5V7M7 8a7 7 0 0 1 10 0M4.5 5.5a10.5 10.5 0 0 1 15 0"/>',
  brainpsych: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.5A3 3 0 0 0 8 17h1V4Z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.5A3 3 0 0 1 16 17h-1V4Z"/><path d="M9 4h6M9 17h6"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v18H6.5A2.5 2.5 0 0 0 4 23Z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v18h5.5a2.5 2.5 0 0 1 2.5 2"/>',
  cheatsheet: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  building: '<path d="M4 21V6l8-3 8 3v15"/><path d="M4 21h16M9 21v-4h6v4M9 10h1M14 10h1M9 14h1M14 14h1"/>',
  hospital: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M12 8v8M8 12h8"/>',
  scalpel: '<path d="M20 4 9 15a2.5 2.5 0 1 1-3.5-3.5L16 1"/><path d="M4 20l3-3"/>',
  heart: '<path d="M12 21s-7-4.7-9.5-9.1C.8 8.4 2.4 5 5.7 5c1.9 0 3.3 1 4.3 2.4C11 6 12.4 5 14.3 5c3.3 0 4.9 3.4 3.2 6.9C19 16.3 12 21 12 21Z"/><path d="M6 12h2.5l1.5-2 2 4 1.5-2H16"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><rect x="9" y="2.5" width="6" height="3.5" rx="1"/><path d="M8 11h8M8 15h8M8 19h5"/>',
  lungs: '<path d="M12 3v8"/><path d="M12 11c-1-2-3-2-4-1s-2 4-1 8c.5 2 2 2 3 1s2-3 2-4"/><path d="M12 11c1-2 3-2 4-1s2 4 1 8c-.5 2-2 2-3 1s-2-3-2-4"/>',
  graduation: '<path d="M2 9l10-4 10 4-10 4Z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/><path d="M22 9v6"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.4-4.4"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="M5 5l14 14M19 5 5 19"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowLeft: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  siren: '<path d="M12 3a5 5 0 0 1 5 5v6H7V8a5 5 0 0 1 5-5Z"/><path d="M5 14h14v2H5zM4 20h16M12 3V1"/>'
};

function emsIcon(name, cls) {
  const body = EMS_ICONS[name] || EMS_ICONS.clipboard;
  return `<svg class="icon ${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

// Why: same template + dimensions as the per-market OG image. Inline the
// runtime/size constants so Next's static analyzer reads them without
// following the re-export.
export { default } from './opengraph-image';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'BazarDhor market page';

// Why: Twitter's `summary_large_image` card uses the same 1200×630 size as
// the OG image. The handler delegates to the OG generator so the template
// stays in one place; runtime/size/contentType/alt are declared inline so
// Next's static analyzer can read them without following the re-export.
export { default } from './opengraph-image';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'BazarDhor — Today\'s local market prices';

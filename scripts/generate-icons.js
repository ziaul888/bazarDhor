#!/usr/bin/env node
/**
 * Regenerates the favicon and PWA icon set from the brand mark.
 *
 * Run with: node scripts/generate-icons.js
 *
 * The mark is the Bengali brand initial "দ" on the same sky-blue gradient the
 * OG image uses, so the tab icon, the installed app icon and the social card
 * all read as one brand.
 *
 * Note: the glyph is drawn with a <text> element, so regenerating requires a
 * Bengali font on the machine (macOS ships "Kohinoor Bangla" / "Bangla MN").
 * The committed PNG/ICO files carry the rasterized glyph, so the app itself
 * has no font dependency at runtime.
 */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const ICONS_DIR = path.join(PUBLIC_DIR, 'icons');
// App Router's metadata file convention: src/app/favicon.ico is what actually
// gets served at /favicon.ico, taking precedence over public/favicon.ico — so
// the tab icon has to be written here, not in public/.
const APP_FAVICON = path.join(__dirname, '..', 'src', 'app', 'favicon.ico');

const BRAND_GLYPH = 'দ';
const FONT_STACK = "'Kohinoor Bangla','Noto Sans Bengali','Bangla MN','Bangla Sangam MN',sans-serif";

// Matches the OG image gradient in src/app/[locale]/opengraph-image.tsx.
const GRADIENT_STOPS = ['#0ea5e9', '#38bdf8', '#7dd3fc'];

// PWA icon sizes declared in public/manifest.json.
const PWA_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
// Sizes packed into favicon.ico — 16/32 for tabs, 48 for the Windows taskbar.
const ICO_SIZES = [16, 32, 48];

// Share of the canvas the glyph's ink is allowed to fill. Kept under the
// maskable safe zone (~80%) so an OS circle mask never clips the letter.
const GLYPH_SCALE = 0.56;

/**
 * Builds the gradient plate.
 *
 * `rounded` controls the corner treatment:
 *  - false (full-bleed square) for the PWA and Apple icons, because the
 *    manifest declares `purpose: "maskable any"` and every OS applies its own
 *    mask — transparent corners would show as gaps.
 *  - true for favicon.ico, which browsers render as-is in the tab strip.
 */
function buildPlateSvg(size, { rounded }) {
  const radius = rounded ? size * 0.22 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${GRADIENT_STOPS[0]}"/>
      <stop offset="50%" stop-color="${GRADIENT_STOPS[1]}"/>
      <stop offset="100%" stop-color="${GRADIENT_STOPS[2]}"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="url(#g)"/>
</svg>`;
}

function buildGlyphSvg(box) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${box}" height="${box}" viewBox="0 0 ${box} ${box}">
  <text x="${box / 2}" y="${box * 0.72}" text-anchor="middle"
        font-family="${FONT_STACK}" font-size="${box * 0.6}" font-weight="700"
        fill="#ffffff">${BRAND_GLYPH}</text>
</svg>`;
}

/**
 * Renders the glyph once at high resolution and trims to its ink bounds.
 *
 * Why trim: `text-anchor="middle"` centers the glyph's advance width, not the
 * ink it actually paints — for "দ" that leaves the mark visibly left of and
 * above center. Trimming to the real bounding box lets each icon size place
 * the letter dead center instead.
 */
async function renderGlyph() {
  const BOX = 1024;
  const rendered = await sharp(Buffer.from(buildGlyphSvg(BOX)), { density: 384 })
    .resize(BOX, BOX, { fit: 'fill' })
    .ensureAlpha()
    .png()
    .toBuffer();

  // Scan the alpha channel for the ink box. sharp's trim() keys off the
  // top-left pixel and left this fully transparent canvas untouched, so the
  // bounds are measured directly instead.
  const { data, info } = await sharp(rendered)
    .raw()
    .toBuffer({ resolveWithObject: true });

  let minX = info.width;
  let minY = info.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const alpha = data[(y * info.width + x) * info.channels + (info.channels - 1)];
      if (alpha > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) {
    throw new Error('Glyph rendered empty — is a Bengali font installed?');
  }

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;
  const glyph = await sharp(rendered)
    .extract({ left: minX, top: minY, width, height })
    .png()
    .toBuffer();

  return { glyph, width, height };
}

/** Composites the trimmed glyph centered on a gradient plate at `size`. */
async function render(size, opts, ink) {
  const longest = Math.max(ink.width, ink.height);
  const scale = (size * GLYPH_SCALE) / longest;
  const glyphWidth = Math.max(1, Math.round(ink.width * scale));
  const glyphHeight = Math.max(1, Math.round(ink.height * scale));

  const layer = await sharp(ink.glyph)
    .resize(glyphWidth, glyphHeight, { fit: 'fill' })
    .png()
    .toBuffer();

  return sharp(Buffer.from(buildPlateSvg(size, opts)), { density: 384 })
    .resize(size, size, { fit: 'fill' })
    .composite([
      {
        input: layer,
        left: Math.round((size - glyphWidth) / 2),
        top: Math.round((size - glyphHeight) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Packs PNG frames into an ICO container.
 *
 * Why hand-rolled: sharp cannot write .ico, and an ICO is just a small header
 * plus one directory entry per frame. Storing PNG (rather than BMP) payloads
 * is valid ICO and supported by every browser in use today.
 */
function buildIco(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(frames.length, 4);

  let offset = 6 + frames.length * 16;
  const entries = [];
  for (const { size, data } of frames) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 means 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette colors
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...frames.map((f) => f.data)]);
}

async function main() {
  fs.mkdirSync(ICONS_DIR, { recursive: true });

  const ink = await renderGlyph();
  console.log(`glyph ink bounds: ${ink.width}x${ink.height}`);

  // Master vector, kept in the repo so the mark can be re-rendered or tweaked.
  fs.writeFileSync(
    path.join(ICONS_DIR, 'app-icon.svg'),
    buildPlateSvg(512, { rounded: false }).replace(
      '</svg>',
      `  ${buildGlyphSvg(512).match(/<text[\s\S]*<\/text>/)[0]}\n</svg>`
    )
  );

  for (const size of PWA_SIZES) {
    const png = await render(size, { rounded: false }, ink);
    fs.writeFileSync(path.join(ICONS_DIR, `icon-${size}x${size}.png`), png);
    console.log(`icons/icon-${size}x${size}.png  ${png.length} bytes`);
  }

  // iOS ignores the manifest and reads this via <link rel="apple-touch-icon">.
  const apple = await render(180, { rounded: false }, ink);
  fs.writeFileSync(path.join(ICONS_DIR, 'apple-touch-icon.png'), apple);
  console.log(`icons/apple-touch-icon.png  ${apple.length} bytes`);

  const frames = [];
  for (const size of ICO_SIZES) {
    frames.push({ size, data: await render(size, { rounded: true }, ink) });
  }
  const ico = buildIco(frames);
  fs.writeFileSync(APP_FAVICON, ico);
  console.log(`src/app/favicon.ico  ${ico.length} bytes  (${ICO_SIZES.join(', ')})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

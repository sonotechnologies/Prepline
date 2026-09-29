// Generates striped WebP placeholders (matching the design hand-off) for every image that a content
// file in src/content references but that does not exist yet. Real photos are never overwritten.
// Run: npm run images            (only missing files)
//      npm run images -- --force (regenerate every placeholder; replaces real photos too, careful)
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const pub = path.join(root, 'public');
const content = path.join(root, 'src', 'content');
const force = process.argv.includes('--force');

const LIGHT = { a: '#D4EBEE', b: '#C6E3E7', text: '#0B5960' };
const DARK = { a: '#17506A', b: '#13445B', text: '#1E293B' };

/** Written into every placeholder's EXIF so the Pexels script knows it may replace the file. */
export const PLACEHOLDER_MARK = 'ptt-placeholder';

/** True if the file is a generated placeholder (never true for uploaded or fetched photos). */
export async function isPlaceholder(file) {
  if (!fs.existsSync(file)) return true;
  const { exif } = await sharp(file).metadata();
  return !!exif && exif.includes(Buffer.from(PLACEHOLDER_MARK));
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function svg(w, h, label, tone = LIGHT, corner = 'bottom-left') {
  const stripe = Math.round(Math.max(w, h) / 60);
  const fs = Math.round(Math.min(30, Math.max(14, Math.min(w, h) / 24)));
  const padX = fs * 0.6;
  const boxW = Math.min(w - fs * 2, Math.round(label.length * fs * 0.62 + padX * 2));
  const boxH = Math.round(fs * 1.9);
  const x = corner === 'top-right' ? w - fs * 2 - boxW : fs;
  const y = corner === 'top-right' ? Math.round(h * 0.2) : h - fs - boxH;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs><pattern id="p" width="${stripe * 2}" height="${stripe * 2}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="${stripe * 2}" height="${stripe * 2}" fill="${tone.a}"/><rect width="${stripe}" height="${stripe * 2}" fill="${tone.b}"/>
  </pattern></defs>
  <rect width="100%" height="100%" fill="url(#p)"/>
  <rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="6" fill="rgba(255,255,255,.88)"/>
  <text x="${x + padX}" y="${y + boxH / 2}" dominant-baseline="central" font-family="DejaVu Sans Mono, Menlo, monospace" font-size="${fs}" fill="${tone.text}">${esc(label)}</text>
</svg>`;
}

/** Output size and style for an image path, by section. */
export function specFor(src, shape) {
  if (src.includes('/home/heroSlides/')) return { w: 1920, h: 1080, tone: DARK, corner: 'top-right', prefix: 'Hero photo' };
  if (src.includes('/home/gallery/')) {
    const [aw, ah] = (shape ?? '1/1').split('/').map(Number);
    return { w: 600, h: Math.round((600 * ah) / aw), prefix: 'Client photo' };
  }
  if (src.startsWith('/images/destinations/')) return { w: 600, h: 800, prefix: 'Photo' };
  return { w: 1200, h: 900, prefix: 'Photo' };
}

/** Every { image, alt | imageAlt } pair in a JSON value. */
export function* images(value) {
  if (Array.isArray(value)) for (const v of value) yield* images(v);
  else if (value && typeof value === 'object') {
    if (typeof value.image === 'string' && value.image.startsWith('/images/')) {
      yield { src: value.image, alt: value.alt ?? value.imageAlt ?? '', shape: value.shape };
    }
    for (const v of Object.values(value)) if (v && typeof v === 'object') yield* images(v);
  }
}

export function jsonFiles(dir = content) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? jsonFiles(path.join(dir, e.name)) : e.name.endsWith('.json') ? [path.join(dir, e.name)] : []
    );
}

async function out(rel, { w, h, tone = LIGHT, corner, prefix }, alt, format = 'webp') {
  const file = path.join(pub, rel);
  if (!force && fs.existsSync(file)) return false;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const img = sharp(Buffer.from(svg(w, h, `${prefix} · ${alt}`, tone, corner))).withExif({
    IFD0: { ImageDescription: PLACEHOLDER_MARK }
  });
  await (format === 'jpg' ? img.jpeg({ quality: 80 }) : img.webp({ quality: 72 })).toFile(file);
  return true;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  let made = 0;
  let total = 0;
  for (const file of jsonFiles()) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const img of images(data)) {
      total++;
      if (await out(img.src, specFor(img.src, img.shape), img.alt || path.basename(file, '.json'))) made++;
    }
  }
  if (await out('/images/og-default.jpg', { w: 1200, h: 630, prefix: 'Prepping Travel and Tours' }, 'Share image', 'jpg')) made++;
  console.log(`Placeholders: ${made} generated, ${total + 1 - made} already present.`);
}

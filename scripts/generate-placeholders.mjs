// Generates striped WebP placeholders (matching the design hand-off) for every image the
// content files reference. Existing files are skipped, so real photos are never overwritten.
// Run: npm run images            (only missing files)
//      npm run images -- --force (regenerate everything)
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const pub = path.join(root, 'public');
const force = process.argv.includes('--force');

const LIGHT = { a: '#D4EBEE', b: '#C6E3E7', text: '#0B5960' };
const DARK = { a: '#17506A', b: '#13445B', text: '#1E293B' };

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

let made = 0;
let skipped = 0;
async function out(rel, w, h, label, tone, format = 'webp', corner) {
  const file = path.join(pub, rel);
  if (!force && fs.existsSync(file)) {
    skipped++;
    return;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const img = sharp(Buffer.from(svg(w, h, label, tone, corner)));
  await (format === 'jpg' ? img.jpeg({ quality: 80 }) : img.webp({ quality: 72 })).toFile(file);
  made++;
}

// Packages: every gallery image (the cover is gallery[0]).
const pkgDir = path.join(root, 'src/content/packages');
for (const f of fs.readdirSync(pkgDir).filter((x) => x.endsWith('.json'))) {
  const p = JSON.parse(fs.readFileSync(path.join(pkgDir, f), 'utf8'));
  const imgs = [{ src: p.coverImage, alt: p.coverAlt }, ...p.gallery];
  const seen = new Set();
  for (const g of imgs) {
    if (seen.has(g.src)) continue;
    seen.add(g.src);
    await out(g.src, 1200, 900, `Photo · ${g.alt}`);
  }
}

// Destinations: 3:4 tiles.
const dests = JSON.parse(fs.readFileSync(path.join(root, 'src/content/destinations.json'), 'utf8'));
for (const d of dests) await out(d.image, 600, 800, `Photo · ${d.imageAlt}`);

// Hero slideshow: dark stripes behind white text.
const hero = ['Santorini cliffs at sunset', 'Dubai skyline, wide', 'Bali rice terraces, aerial'];
for (const [i, l] of hero.entries()) await out(`images/hero/${i + 1}.webp`, 1920, 1080, `Hero photo · ${l}`, DARK, 'webp', 'top-right');

// Trip gallery (masonry): mixed aspect ratios.
const gallery = [
  ['3/4', 'Dubai'], ['1/1', 'Zanzibar'], ['4/5', 'Paris'], ['4/3', 'Cape Town'],
  ['1/1', 'Bali'], ['3/4', 'Istanbul'], ['4/3', 'London'], ['4/5', 'Nairobi']
];
for (const [i, [ar, city]] of gallery.entries()) {
  const [aw, ah] = ar.split('/').map(Number);
  await out(`images/gallery/${i + 1}.webp`, 600, Math.round((600 * ah) / aw), `Client photo · ${city}`);
}

// About page and Open Graph fallback.
await out('images/about/team.webp', 1200, 900, 'Photo · Our planners at the Lagos office');
await out('images/og-default.jpg', 1200, 630, 'Prepping Travel and Tours · Share image', LIGHT, 'jpg');

console.log(`Placeholders: ${made} generated, ${skipped} already present.`);

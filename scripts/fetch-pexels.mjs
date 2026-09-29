// Replaces placeholder images with photos from Pexels (https://www.pexels.com/api/).
//
//   PEXELS_API_KEY=xxxx npm run images:pexels               fetch every placeholder
//   PEXELS_API_KEY=xxxx npm run images:pexels -- --dry-run   show the photo each image would get
//   PEXELS_API_KEY=xxxx npm run images:pexels -- --only=visas
//
// Only files carrying the placeholder marker are replaced, so photos uploaded in the admin are never
// touched. Each image's search uses its description (alt text) unless scripts/pexels-queries.json
// has an override for that path. Photographer credits go to src/content/photo-credits.json, which
// the /photo-credits page lists (Pexels asks for attribution where possible).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { images, isPlaceholder, jsonFiles, specFor } from './generate-placeholders.mjs';

const root = path.resolve(import.meta.dirname, '..');
const pub = path.join(root, 'public');
const creditsFile = path.join(root, 'src', 'content', 'photo-credits.json');
const overridesFile = path.join(root, 'scripts', 'pexels-queries.json');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const only = args.find((a) => a.startsWith('--only='))?.slice(7);
const key = process.env.PEXELS_API_KEY;
if (!key) {
  console.error('Set PEXELS_API_KEY (free at https://www.pexels.com/api/).');
  process.exit(1);
}

const credits = fs.existsSync(creditsFile) ? JSON.parse(fs.readFileSync(creditsFile, 'utf8')) : {};
const overrides = fs.existsSync(overridesFile) ? JSON.parse(fs.readFileSync(overridesFile, 'utf8')) : {};
const usedIds = new Set(Object.values(credits).map((c) => c.id));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function orientation(w, h) {
  if (Math.abs(w - h) / Math.max(w, h) < 0.1) return 'square';
  return w > h ? 'landscape' : 'portrait';
}

async function search(query, orient) {
  const url = `https://api.pexels.com/v1/search?${new URLSearchParams({ query, orientation: orient, per_page: '15' })}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: { Authorization: key } });
    if (res.status === 429) {
      await sleep(2000 * 2 ** attempt);
      continue;
    }
    if (!res.ok) throw new Error(`Pexels search failed (${res.status}) for "${query}"`);
    return (await res.json()).photos ?? [];
  }
  throw new Error('Pexels rate limit reached; try again later.');
}

/** WebP at the target size; heroes are kept under 250 KB. */
async function saveWebp(buffer, file, w, h, maxBytes) {
  let quality = 80;
  let out;
  do {
    out = await sharp(buffer).resize(w, h, { fit: 'cover', position: 'attention' }).webp({ quality }).toBuffer();
    quality -= 6;
  } while (maxBytes && out.length > maxBytes && quality > 40);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, out);
  return out.length;
}

const jobs = [];
const seen = new Set();
for (const file of jsonFiles()) {
  if (file === creditsFile) continue;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const img of images(data)) {
    if (seen.has(img.src) || (only && !img.src.includes(`/${only}/`))) continue;
    seen.add(img.src);
    jobs.push({ ...img, source: path.relative(root, file) });
  }
}

let fetched = 0;
let skipped = 0;
for (const job of jobs) {
  const target = path.join(pub, job.src);
  if (!(await isPlaceholder(target))) {
    skipped++;
    continue;
  }
  const spec = specFor(job.src, job.shape);
  const query = overrides[job.src] ?? job.alt ?? path.basename(job.source, '.json');
  const photos = await search(query, orientation(spec.w, spec.h));
  const photo = photos.find((p) => !usedIds.has(p.id)) ?? photos[0];
  if (!photo) {
    console.warn(`  no result: ${job.src} ("${query}"). Add an override in scripts/pexels-queries.json.`);
    continue;
  }
  usedIds.add(photo.id);
  if (dryRun) {
    console.log(`${job.src}\n  "${query}" -> ${photo.url} (${photo.photographer})`);
    continue;
  }
  const src = `${photo.src.original}?auto=compress&cs=tinysrgb&w=${Math.round(spec.w * 1.25)}`;
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${photo.url}`);
  const bytes = await saveWebp(
    Buffer.from(await res.arrayBuffer()),
    target,
    spec.w,
    spec.h,
    job.src.includes('/heroSlides/') ? 250_000 : undefined
  );
  credits[job.src] = {
    id: photo.id,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    pexelsUrl: photo.url,
    query
  };
  fs.writeFileSync(creditsFile, JSON.stringify(credits, null, 2) + '\n');
  fetched++;
  console.log(`✓ ${job.src} (${Math.round(bytes / 1024)} KB) ${photo.photographer}`);
  await sleep(250);
}

console.log(`\nPexels: ${fetched} fetched, ${skipped} kept (real photos), ${jobs.length} images in content.`);

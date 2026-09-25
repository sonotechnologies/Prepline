// Fails the build if the banned booking call to action, or checkout wording, appears anywhere in the site source.
// The phrases are assembled at runtime so this file does not contain them itself.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const banned = [['book', 'now'], ['add to', 'cart'], ['check', 'out now'], ['pay', 'now']].map(
  (words) => new RegExp(words.join('\\s*'), 'i')
);
const dirs = ['src', 'public', 'README.md'];
const exts = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.css', '.md', '.svg', '.txt', '.html']);

const hits = [];
function walk(p) {
  const stat = fs.statSync(p);
  if (stat.isDirectory()) return fs.readdirSync(p).forEach((f) => walk(path.join(p, f)));
  if (!exts.has(path.extname(p))) return;
  fs.readFileSync(p, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      for (const re of banned) if (re.test(line)) hits.push(`${path.relative(root, p)}:${i + 1}: ${line.trim()}`);
    });
}
for (const d of dirs) if (fs.existsSync(path.join(root, d))) walk(path.join(root, d));

if (hits.length) {
  console.error('Forbidden booking or checkout copy found:\n' + hits.join('\n'));
  process.exit(1);
}
console.log('Copy check passed: no booking or checkout calls to action.');

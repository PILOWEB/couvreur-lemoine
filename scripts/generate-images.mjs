/* Visuels procéduraux de démonstration. `npm run images` les régénère.
   À remplacer par les vraies photos du client en gardant les noms de fichiers. */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'public', 'images');
await mkdir(OUT, { recursive: true });

const rand = (seed) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

/* Rangs d'ardoises : rectangles à coins bas arrondis, décalés d'un demi-pas */
const slates = (w, h, seed, { fill, edge, cols = 9, ratio = 1.6, jitter = 0.03 }) => {
  const r = rand(seed);
  const cw = w / cols, ch = cw * ratio, rows = Math.ceil(h / (ch * 0.5)) + 2;
  let s = '';
  for (let y = -1; y < rows; y++) {
    const off = (y % 2) * (cw / 2);
    for (let x = -1; x <= cols; x++) {
      const px = x * cw + off + (r() - 0.5) * cw * jitter, py = y * ch * 0.5 + (r() - 0.5) * ch * jitter;
      const l = 0.82 + r() * 0.36;
      s += `<rect x="${px}" y="${py}" width="${cw - 1.2}" height="${ch}" rx="${cw * 0.06}" ry="${cw * 0.06}" fill="${fill}" fill-opacity="${l.toFixed(2)}" stroke="${edge}" stroke-width="0.8"/>`;
    }
  }
  return s;
};

/* Tuiles mécaniques : ondulations horizontales + rangs */
const tiles = (w, h, seed, { fill, shade, cols = 8 }) => {
  const r = rand(seed);
  const cw = w / cols, ch = cw * 0.55, rows = Math.ceil(h / ch) + 1;
  let s = '';
  for (let y = 0; y < rows; y++) {
    for (let x = -1; x <= cols; x++) {
      const px = x * cw + (y % 2) * (cw / 2), py = y * ch;
      const l = 0.86 + r() * 0.28;
      s += `<path d="M${px} ${py + ch} v-${ch * 0.7} q${cw * 0.5} -${ch * 0.5} ${cw} 0 v${ch * 0.7} z" fill="${fill}" fill-opacity="${l.toFixed(2)}" stroke="${shade}" stroke-width="1"/>`;
    }
  }
  return s;
};

/* Zinc : joints debout verticaux, patine en plages */
const zinc = (w, h, seed, { fill, joint, seams = 6 }) => {
  const r = rand(seed);
  let s = `<rect width="${w}" height="${h}" fill="${fill}"/>`;
  for (let i = 0; i < 24; i++) {
    s += `<ellipse cx="${r() * w}" cy="${r() * h}" rx="${40 + r() * 140}" ry="${20 + r() * 90}" fill="#ffffff" fill-opacity="${(r() * 0.08).toFixed(3)}"/>`;
    s += `<ellipse cx="${r() * w}" cy="${r() * h}" rx="${40 + r() * 140}" ry="${20 + r() * 90}" fill="#000000" fill-opacity="${(r() * 0.07).toFixed(3)}"/>`;
  }
  for (let i = 0; i <= seams; i++) {
    const x = (i / seams) * w;
    s += `<rect x="${x - 3}" y="0" width="6" height="${h}" fill="${joint}"/><rect x="${x + 3}" y="0" width="2" height="${h}" fill="#ffffff" fill-opacity="0.18"/>`;
  }
  return s;
};

/* Bac acier : nervures trapézoïdales */
const steel = (w, h, { fill, dark, light, ribs = 7 }) => {
  let s = `<rect width="${w}" height="${h}" fill="${fill}"/>`;
  const rw = w / ribs;
  for (let i = 0; i < ribs; i++) {
    const x = i * rw;
    s += `<rect x="${x + rw * 0.3}" width="${rw * 0.4}" height="${h}" fill="${light}"/>`;
    s += `<rect x="${x + rw * 0.26}" width="${rw * 0.05}" height="${h}" fill="${dark}"/>`;
    s += `<rect x="${x + rw * 0.69}" width="${rw * 0.05}" height="${h}" fill="${dark}"/>`;
  }
  return s;
};

const svg = (w, h, body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`);
const write = (name, w, h, body, q = 78) => sharp(svg(w, h, body)).webp({ quality: q }).toFile(join(OUT, name));

/* Matériaux (échantillons carrés) ------------------------------------------- */
await write('materiau-ardoise.webp', 900, 900, `<rect width="900" height="900" fill="#2a2e34"/>${slates(900, 900, 11, { fill: '#33383f', edge: '#1b1e22' })}`);
await write('materiau-tuile.webp', 900, 900, `<rect width="900" height="900" fill="#8f3f24"/>${tiles(900, 900, 23, { fill: '#b0492a', shade: '#6f2e18' })}`);
await write('materiau-zinc.webp', 900, 900, zinc(900, 900, 37, { fill: '#7d8890', joint: '#5c666d' }));
await write('materiau-bac-acier.webp', 900, 900, steel(900, 900, { fill: '#5f6a72', dark: '#3f474d', light: '#7a858d' }));

/* Chantiers avant / après ------------------------------------------------------ */
const mossy = (w, h, seed) => {
  const r = rand(seed);
  let s = slates(w, h, seed, { fill: '#5a4a38', edge: '#3a2f22', cols: 11, jitter: 0.12 });
  for (let i = 0; i < 90; i++) s += `<ellipse cx="${r() * w}" cy="${r() * h}" rx="${8 + r() * 40}" ry="${5 + r() * 24}" fill="#6d7a3a" fill-opacity="${(0.35 + r() * 0.5).toFixed(2)}"/>`;
  return s;
};
const sky = (w, h, top, bottom) => `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#sky)"/>`;
const roofScene = (w, h, body) => `${sky(w, h, '#d9c8ac', '#e9dfcf')}<g transform="translate(0 ${h * 0.28}) skewY(-9)">${body}</g><rect y="${h * 0.28}" width="${w}" height="6" fill="#4a5560"/>`;

for (const [i, seed, matFill, matEdge] of [[1, 41, '#b0492a', '#6f2e18'], [2, 53, '#33383f', '#1b1e22'], [3, 67, '#a24a2e', '#6a2c17']]) {
  await write(`chantier-${i}-avant.webp`, 1400, 1000, roofScene(1400, 1000, mossy(1400, 1000, seed)), 74);
  await write(`chantier-${i}-apres.webp`, 1400, 1000, roofScene(1400, 1000, i === 2 ? slates(1400, 1000, seed + 1, { fill: matFill, edge: matEdge, cols: 14 }) : tiles(1400, 1000, seed + 1, { fill: matFill, shade: matEdge, cols: 12 })), 74);
}
await write('chantier-4.webp', 1400, 900, roofScene(1400, 900, steel(1400, 900, { fill: '#5f6a72', dark: '#3f474d', light: '#7a858d', ribs: 12 })), 74);
await write('chantier-5.webp', 1000, 1400, roofScene(1000, 1400, zinc(1000, 1400, 71, { fill: '#7d8890', joint: '#5c666d', seams: 5 })), 74);

/* Portrait métier (vertical, silhouette abstraite sur toit) --------------------- */
await write('portrait-metier.webp', 1000, 1400, `${sky(1000, 1400, '#e8c9a0', '#f2ede4')}<g transform="translate(0 700) skewY(-14)">${slates(1000, 900, 91, { fill: '#33383f', edge: '#1b1e22', cols: 10 })}</g><ellipse cx="520" cy="560" rx="150" ry="60" fill="#1e2126" fill-opacity="0.18"/><path d="M470 560 q50 -180 100 0 z" fill="#1e2126"/><circle cx="520" cy="380" r="34" fill="#1e2126"/>`, 76);

/* Hero statique (mobile) et OG --------------------------------------------- */
const heroBody = (w, h) => `${sky(w, h, '#e8c9a0', '#f2ede4')}<g transform="translate(${-w * 0.1} ${h * 0.42}) skewY(-16)">${slates(w * 1.3, h, 101, { fill: '#33383f', edge: '#1b1e22', cols: 16 })}</g><rect x="0" y="${h * 0.42 - 8}" width="${w}" height="10" fill="#6e7a82" transform="skewY(-16)"/>`;
await write('hero-static.webp', 1200, 1600, heroBody(1200, 1600), 72);
await write('og-image.webp', 1200, 630, `${heroBody(1200, 630)}<text x="60" y="520" font-family="Georgia, serif" font-size="88" fill="#1e2126">Lemoine Couverture</text><text x="60" y="580" font-family="sans-serif" font-size="30" fill="#4a4f56">Couvreur-zingueur à Dourdan</text>`, 80);

console.log('images générées dans public/images/');

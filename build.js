const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');
const sass = require('sass');

// ─── SCSS Compile ───────────────────────────────────────────
const result = sass.compile('src/scss/main.scss', {
  style: 'compressed',
  loadPaths: ['src/scss']
});
fs.mkdirSync('dist/css', { recursive: true });
fs.writeFileSync('dist/css/style.css', result.css);
console.log(`SCSS compiled: ${result.css.length} bytes`);

// ─── Copy static CSS (if any) ───────────────────────────────
const cssDir = 'dist/css';
if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir, { recursive: true });

// ─── Nunjucks ───────────────────────────────────────────────
const env = nunjucks.configure('src/templates', { autoescape: false, noCache: true });

const data = {
  contacts: JSON.parse(fs.readFileSync('src/data/contacts.json', 'utf8')),
  catalog:  JSON.parse(fs.readFileSync('src/data/catalog.json', 'utf8')),
  products: JSON.parse(fs.readFileSync('src/data/products.json', 'utf8')),
};

const pages = [
  'index', 'catalog', 'about', 'contacts', 'payment', 'strapping',
  'manual', 'machine', 'logo-strap', 'pet', 'adhesive', 'adhesive-pack',
  'adhesive-logo', 'adhesive-insc', 'tools', 'strapping-tools', 'mites',
  'brace', 'special', 'fleece', 'mask', 'double', 'stretch', 'sleeve',
];

let success = 0, errors = 0;
for (const page of pages) {
  try {
    const html = env.render(`pages/${page}.html`, data);
    const outPath = `dist/${page === 'index' ? '' : page}`;
    fs.mkdirSync(outPath, { recursive: true });
    fs.writeFileSync(`${outPath}/index.html`, html);
    success++;
  } catch (e) {
    console.error(`  ❌ ${page}: ${e.message}`);
    errors++;
  }
}
console.log(`Built: ${success}/${pages.length} pages, ${errors} errors`);
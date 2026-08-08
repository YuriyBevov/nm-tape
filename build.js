const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');

const env = nunjucks.configure('src/templates', { autoescape: false, noCache: true });

const data = {
  products: JSON.parse(fs.readFileSync('src/data/products.json', 'utf8')),
  catalog:  JSON.parse(fs.readFileSync('src/data/catalog.json', 'utf8')),
  contacts: JSON.parse(fs.readFileSync('src/data/contacts.json', 'utf8')),
};

const pages = [
  { file: 'pages/index.html',    out: 'index.html',                  active: 'home' },
  { file: 'pages/about.html',    out: 'about/index.html',            active: 'about' },
  { file: 'pages/contacts.html', out: 'contacts/index.html',         active: 'contacts' },
  { file: 'pages/payment.html',  out: 'payment-and-shipping/index.html', active: 'payment' },
  { file: 'pages/catalog.html',  out: 'catalog/index.html',          active: 'catalog' },
  { file: 'pages/strapping.html',out: 'catalog/strapping-pp-tape/index.html', active: 'catalog' },
  { file: 'pages/manual.html',   out: 'catalog/strapping-pp-tape/pp-tape-for-manual-pack/index.html', active: 'catalog' },
  { file: 'pages/machine.html',  out: 'catalog/strapping-pp-tape/pp-tape-machine-packaging/index.html', active: 'catalog' },
  { file: 'pages/logo-strap.html',out: 'catalog/strapping-pp-tape/pp-tape-with-logo/index.html', active: 'catalog' },
  { file: 'pages/pet.html',      out: 'catalog/strapping-pp-tape/strap-polyester-tape/index.html', active: 'catalog' },
  { file: 'pages/adhesive.html', out: 'catalog/adhesive-tape/index.html', active: 'catalog' },
  { file: 'pages/adhesive-pack.html', out: 'catalog/adhesive-tape/adhesive-tape-packing/index.html', active: 'catalog' },
  { file: 'pages/adhesive-logo.html', out: 'catalog/adhesive-tape/adhesive-tape-with-logo/index.html', active: 'catalog' },
  { file: 'pages/adhesive-insc.html', out: 'catalog/adhesive-tape/adhesive-tape-with-special-inscriptions/index.html', active: 'catalog' },
  { file: 'pages/tools.html',    out: 'catalog/packaging-tools/index.html', active: 'catalog' },
  { file: 'pages/strapping-tools.html', out: 'catalog/packaging-tools/strapping-tools/index.html', active: 'catalog' },
  { file: 'pages/mites.html',    out: 'catalog/packaging-tools/strapping-tools/mites/index.html', active: 'catalog' },
  { file: 'pages/brace.html',    out: 'catalog/packaging-tools/strapping-tools/packing-brace-bracket-for-polypropylene-tape/index.html', active: 'catalog' },
  { file: 'pages/special.html',  out: 'catalog/special-tapes/index.html', active: 'catalog' },
  { file: 'pages/fleece.html',   out: 'catalog/special-tapes/duct-tape-on-the-basis-of-fleece/index.html', active: 'catalog' },
  { file: 'pages/mask.html',     out: 'catalog/special-tapes/adhesive-tape-mask/index.html', active: 'catalog' },
  { file: 'pages/double.html',   out: 'catalog/special-tapes/double-sided-adhesive-tape-for-carpet/index.html', active: 'catalog' },
  { file: 'pages/stretch.html',  out: 'catalog/stretch-film/index.html', active: 'catalog' },
  { file: 'pages/sleeve.html',   out: 'catalog/cardboard-sleeve/index.html', active: 'catalog' },
];

let built = 0, errors = 0;
pages.forEach(p => {
  try {
    const html = env.render(p.file, { ...data, active: p.active, page: p });
    const outPath = path.join('dist', p.out);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, html);
    built++;
  } catch (e) {
    console.error(`  ❌ ${p.out}: ${e.message}`);
    errors++;
  }
});

// Copy static assets (CSS, JS, images)
const staticDirs = ['css', 'js', 'img'];
staticDirs.forEach(dir => {
  const src = `/var/www/nm.yuriybevov.ru/${dir}`;
  const dst = `dist/${dir}`;
  if (fs.existsSync(src)) {
    fs.rmSync(dst, { recursive: true, force: true });
    fs.cpSync(src, dst, { recursive: true });
  }
});

console.log(`\nBuilt: ${built}/${pages.length} pages, ${errors} errors`);
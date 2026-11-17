const fs = require('fs');
const path = require('path');

const apiBase = process.env.API_BASE || 'http://localhost:3000/api';

const src = path.join(__dirname);
const dist = path.join(__dirname, 'dist');

fs.mkdirSync(dist, { recursive: true });

const entries = fs.readdirSync(src, { withFileTypes: true });

for (const entry of entries) {
  if (entry.isDirectory()) continue;

  const ext = path.extname(entry.name).toLowerCase();
  if (['.html', '.js', '.css'].includes(ext)) {
    let content = fs.readFileSync(path.join(src, entry.name), 'utf8');
    content = content.replace(/API_BASE_PLACEHOLDER/g, apiBase);
    fs.writeFileSync(path.join(dist, entry.name), content);
  } else {
    fs.copyFileSync(path.join(src, entry.name), path.join(dist, entry.name));
  }
}

// Copiar subpastas (css, js, etc.)
for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const srcDir = path.join(src, entry.name);
  const distDir = path.join(dist, entry.name);
  fs.cpSync(srcDir, distDir, { recursive: true });
}

console.log(`Build concluído. API_BASE=${apiBase}`);

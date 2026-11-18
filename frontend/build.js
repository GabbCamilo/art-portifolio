const fs = require('fs');
const path = require('path');

const apiBase = process.env.API_BASE || 'http://localhost:3000/api';

const src = path.join(__dirname);
const dist = path.join(__dirname, 'dist');

fs.mkdirSync(dist, { recursive: true });

function processDir(srcDir, distDir) {
    fs.mkdirSync(distDir, { recursive: true });
    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.name === 'dist' || entry.name === 'node_modules') continue;
        const srcPath = path.join(srcDir, entry.name);
        const distPath = path.join(distDir, entry.name);
        if (entry.isDirectory()) {
            processDir(srcPath, distPath);
        } else {
            const ext = path.extname(entry.name).toLowerCase();
            if (['.html', '.js', '.css'].includes(ext)) {
                let content = fs.readFileSync(srcPath, 'utf8');
                content = content.replace(/API_BASE_PLACEHOLDER/g, apiBase);
                fs.writeFileSync(distPath, content, 'utf8');
            } else {
                fs.copyFileSync(srcPath, distPath);
            }
        }
    }
}

processDir(src, dist);
console.log(`Build concluído. API_BASE=${apiBase}`);

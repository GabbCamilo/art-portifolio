const path = require('path');
const fs = require('fs');
const m = require('../../frontend/js/main.js');

(async () => {
    const artist = await m.loadArtist();
    console.log('artist:', artist.name, '|', artist.location);
    console.log('labels:', JSON.stringify(artist.labels));
    console.log('image:', JSON.stringify(artist.image));
    if (typeof artist.labels !== 'object' || Array.isArray(artist.labels)) throw new Error('labels deve ser objeto');
    if (artist.image !== null && typeof artist.image !== 'object') throw new Error('image deve ser objeto ou null');

    const feat = await m.loadFeatured();
    console.log('featured:', feat && feat.db_id, '|', feat && feat.image.file_name);

    const b1 = await m.loadFeedBatch(6, 0);
    console.log('batch1:', b1.items.length, 'itens | total =', b1.total, '| primeiro =', b1.items[0] && b1.items[0].id, b1.items[0] && b1.items[0].date);
    b1.items.forEach(function (i) {
        if (i.title !== undefined) throw new Error('feed nao deve trazer title');
        if (i.description !== undefined) throw new Error('feed nao deve trazer descricao');
    });

    console.log('indicatorWindow(5,10,3):', JSON.stringify(m.computeIndicatorWindow(5, 10, 3)));
    console.log('ALL OK');
})().catch(e => { console.error('FAIL:', e.message); process.exit(1); });

/* -------------------------------------
   Regressao: admin.js nao pode lançar ao carregar em login.html
   ------------------------------------- */

const adminSrc = fs.readFileSync(path.resolve(__dirname, '../../frontend/js/admin.js'), 'utf8');

const nullEl = () => null;
global.document = {
    getElementById: nullEl,
    querySelector: nullEl,
    querySelectorAll: () => [],
    addEventListener: () => {},
    dispatchEvent: () => {},
    createElement: () => ({
        style: {},
        classList: { add() {}, remove() {}, contains() { return false; } },
        setAttribute() {},
        appendChild() {},
        addEventListener() {}
    }),
    body: { addEventListener: () => {} },
};
global.window = { location: { href: '' } };
global.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
global.Event = function () {};
const originalFetch = global.fetch;
global.fetch = () => Promise.reject(new Error('sem rede no teste de regressão'));

new Function(adminSrc)(); // executa o IIFE; erro de top level lancaria aqui
document.dispatchEvent(new Event('DOMContentLoaded'));
global.fetch = originalFetch;
console.log('admin.js carregado e inicializado sem erros (cenario login.html simulado)');

/* -------------------------------------
   Estrutura HTML (simplificacao)
   ------------------------------------- */

const indexHtml = fs.readFileSync(path.resolve(__dirname, '../../frontend/index.html'), 'utf8');
if (indexHtml.includes('hero-topics')) throw new Error('index.html ainda contem hero-topics');
if (indexHtml.includes('btn-refresh')) throw new Error('index.html ainda contem botao btn-refresh (removido)');

const dashboardHtml = fs.readFileSync(path.resolve(__dirname, '../../frontend/admin/dashboard.html'), 'utf8');
if (dashboardHtml.includes('topics-list') || dashboardHtml.includes('btn-add-topic')) throw new Error('dashboard.html ainda contem caixas de texto');
if (!dashboardHtml.includes('btn-publish')) throw new Error('dashboard.html falta botao btn-publish');
if (!dashboardHtml.includes('data-upload-zone')) throw new Error('dashboard.html falta zonas de upload');

console.log('HTML: structure OK');

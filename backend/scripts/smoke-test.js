const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('../src/db');
const { ensureAdmin } = require('./bootstrap-admin');

const base = 'http://localhost:3000';
const USER = process.env.ADMIN_USERNAME || 'admin';
const PASS = process.env.ADMIN_PASSWORD;
const IMAGE_PATH = path.resolve(__dirname, '../../storage/images/natureza-abstrata.jpg');

async function req(method, path, body, token) {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body) headers['Content-Type'] = 'application/json';
    const res = await fetch(base + path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });
    let data = null;
    try { data = await res.json(); } catch {}
    return { status: res.status, data };
}

async function reqUpload(filePath, token, slot) {
    const form = new FormData();
    form.append('file', new Blob([fs.readFileSync(filePath)], { type: 'image/jpeg' }), 'upload.jpg');
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(base + '/api/admin/uploads?slot=' + slot, { method: 'POST', headers, body: form });
    let data = null;
    try { data = await res.json(); } catch {}
    return { status: res.status, data };
}

async function main() {
    const results = [];
    const check = (name, ok, extra) => {
        console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ' (' + extra + ')' : ''}`);
        results.push(ok);
    };

    await ensureAdmin(USER, PASS);

    // reset de estado para o suíte rodar de forma hermética entre execuções
    await pool.query('DELETE FROM publications');
    await pool.query(`UPDATE artist_profile SET image_file_name = NULL, image_file_size = NULL, image_width = NULL, image_height = NULL WHERE id = 1`);

    // 1. login sem senha -> 400
    let r = await req('POST', '/api/admin/login', { username: USER }, null);
    check('login sem senha = 400', r.status === 400);

    // 2. login senha errada -> 401
    r = await req('POST', '/api/admin/login', { username: USER, password: 'errada-123' }, null);
    check('login senha errada = 401', r.status === 401 && /inv.lidas/i.test(String(r.data.error)));

    // 3. login valido -> 200 + token
    r = await req('POST', '/api/admin/login', { username: USER, password: PASS }, null);
    check('login valido = 200', r.status === 200);
    const token = r.data && r.data.token;
    check('retornou token', typeof token === 'string' && token.length >= 32);
    check('expires_at presente', !!(r.data && r.data.expires_at));
    check('admin username correto', r.data && r.data.admin && r.data.admin.username === USER);

    // 4. GET /session com token -> 200
    r = await req('GET', '/api/admin/session', null, token);
    check('GET /session = 200', r.status === 200 && r.data.username === USER, JSON.stringify(r.data));

    // 5. GET /session sem token -> 401
    r = await req('GET', '/api/admin/session', null, null);
    check('GET /session sem token = 401', r.status === 401);

    // 6. POST publicacoes sem token -> 401
    r = await req('POST', '/api/admin/publications', { featured: false, file_name: 'x.jpg', file_size: '1 MB', width: 100, height: 100 }, null);
    check('POST sem token = 401', r.status === 401);

    // 7. POST publicacoes com token -> 201 (sem coluna title)
    r = await req('POST', '/api/admin/publications', {
        featured: false,
        file_name: 'smoke-teste.jpg',
        file_size: '1,0 MB',
        width: 800,
        height: 600,
    }, token);
    check('POST com sessao = 201', r.status === 201);
    const newId = r.data && r.data.db_id;
    check('retornou db_id', Number.isInteger(newId));

    // 8. token invalido -> 401
    const badRes = await fetch(base + '/api/admin/publications', {
        method: 'POST',
        headers: { Authorization: 'Bearer wrong-token' },
        body: JSON.stringify({ featured: false, file_name: 'x.jpg', file_size: '1 MB', width: 100, height: 100 }),
    });
    check('token invalido = 401', badRes.status === 401);

    // 9. POST corpo invalido -> 400
    r = await req('POST', '/api/admin/publications', { featured: 'não é booleano' }, token);
    check('POST invalido = 400', r.status === 400);

    // 10. PUT valido (descricao/complementar) -> 200
    r = await req('PUT', `/api/admin/publications/${newId}`, {
        description: 'Descricao atualizada',
        complementary: 'Complemento atualizado',
    }, token);
    check('PUT valido = 200', r.status === 200);
    check('PUT aplicou descricao', r.data && r.data.description === 'Descricao atualizada');
    check('PUT aplicou complementar', r.data && r.data.complementary === 'Complemento atualizado');

    // 11. PUT inexistente -> 404
    r = await req('PUT', '/api/admin/publications/99999', { description: 'x' }, token);
    check('PUT inexistente = 404', r.status === 404);

    // 12. GET publicacoes/999 -> 404 com corpo
    r = await req('GET', '/api/publications/999', null, null);
    check('GET 999 = 404 com error', r.status === 404 && !!r.data.error);

    // 13. GET feed nao inclui destaque e nao traz title/descricao
    r = await req('GET', '/api/publications?featured=false&limit=20', null, null);
    check('feed sem destaque', r.data.items.every(i => i.featured === false));
    check('feed sem title', r.data.items.every(i => i.title === undefined));
    check('feed sem descricao', r.data.items.every(i => i.description === undefined));

    // 14. GET /api/artist -> 200, labels, sem topics, imagem nula (banco vazio)
    r = await req('GET', '/api/artist', null, null);
    check('GET /api/artist = 200', r.status === 200);
    check('artist tem labels', r.data && typeof r.data.labels === 'object' && !Array.isArray(r.data.labels));
    check('artist sem topics', r.data && r.data.topics === undefined);
    check('artist sem imagem', r.data && r.data.image === null);

    // 16. PUT /api/admin/artist -> 200
    r = await req('PUT', '/api/admin/artist', {
        name: 'Artista Atualizado',
        location: 'Rio de Janeiro, Brasil',
        medium: 'Oleo',
        website: 'https://novo.com',
        store: 'Loja',
        patreon: 'Apoio',
        labels: { artist: 'Artista', location: 'Local', medium: 'Tecnica', website: 'Site', store: 'Loja', patreon: 'Apoio' }
    }, token);
    check('PUT /api/admin/artist = 200', r.status === 200);
    check('artist atualizado', r.data && r.data.name === 'Artista Atualizado');

    // 17. labels refletidas no GET
    r = await req('GET', '/api/artist', null, null);
    check('labels refletidas', r.data && r.data.labels && r.data.labels.artist === 'Artista');

    // 18. PUT artist sem token -> 401
    r = await req('PUT', '/api/admin/artist', { name: 'x' }, null);
    check('PUT artist sem token = 401', r.status === 401);

    // 19. PUT artist labels invalidas -> 400
    r = await req('PUT', '/api/admin/artist', { labels: 'nao eh objeto' }, token);
    check('PUT labels invalidas = 400', r.status === 400);

    // 20. upload slot feed -> 200 e arquivo armazenado
    r = await reqUpload(IMAGE_PATH, token, 'feed');
    check('upload feed = 200', r.status === 200);
    const feedFile = r.data && r.data.image && r.data.image.file_name;
    check('upload retornou file_name', typeof feedFile === 'string' && feedFile.length > 0);
    check('arquivo armazenado', fs.existsSync(path.resolve(__dirname, '../../storage/images/' + feedFile)));

    // 21. upload slot featured -> 200 e e destaque unico
    r = await reqUpload(IMAGE_PATH, token, 'featured');
    check('upload featured = 200', r.status === 200);
    r = await req('GET', '/api/publications?featured=true', null, null);
    check('apenas um destaque', r.data.items.length === 1);
    const featured = r.data && r.data.items && r.data.items[0];
    check('destaque tem descricao', featured && typeof featured.description === 'string');
    check('destaque tem complementar', featured && typeof featured.complementary === 'string');
    r = await req('GET', '/api/publications?featured=false&limit=20', null, null);
    check('destaque nao esta no feed', !r.data.items.some(i => i.image.file_name === featured.image.file_name));

    // 22. upload slot profile -> 200 e artista com imagem
    r = await reqUpload(IMAGE_PATH, token, 'profile');
    check('upload profile = 200', r.status === 200);
    r = await req('GET', '/api/artist', null, null);
    check('artist com imagem', r.data && r.data.image && r.data.image.file_name);
    check('imagem armazenada', fs.existsSync(path.resolve(__dirname, '../../storage/images/' + r.data.image.file_name)));

    // 23. DELETE valido -> 204 e remove arquivo
    r = await req('DELETE', `/api/admin/publications/${newId}`, null, token);
    check('DELETE valido = 204', r.status === 204);
    check('arquivo removido do storage', !fs.existsSync(path.resolve(__dirname, '../../storage/images/smoke-teste.jpg')));

    // 24. DELETE inexistente -> 404
    r = await req('DELETE', '/api/admin/publications/99999', null, token);
    check('DELETE inexistente = 404', r.status === 404);

    // 25. logout -> 204
    r = await req('POST', '/api/admin/logout', null, token);
    check('logout = 204', r.status === 204);

    // 26. sessao apos logout -> 401
    r = await req('GET', '/api/admin/session', null, token);
    check('sessao apos logout = 401', r.status === 401);

    let pass = 0;
    for (const ok of results) if (ok) pass++;
    console.log(`\n${pass}/${results.length} testes passaram`);

    await pool.end();
    process.exit(pass === results.length ? 0 : 1);
}

main().catch(e => { console.error('ERRO:', e.message); process.exit(1); });

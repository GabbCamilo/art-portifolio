const pool = require('../src/db');
const { ensureAdmin } = require('./bootstrap-admin');

const base = 'http://localhost:3000';
const USER = process.env.ADMIN_USERNAME || 'admin';
const PASS = process.env.ADMIN_PASSWORD;

async function req(method, path, body, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(base + path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });
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

    // 1. body invalido -> 400
    let r = await req('POST', '/api/admin/login', { username: USER }, null);
    check('login sem senha = 400', r.status === 400);

    // 2. credenciais invalidas -> 401
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

    // 6. POST sem token -> 401
    r = await req('POST', '/api/admin/publications', { title: 'x' }, null);
    check('POST sem token = 401', r.status === 401);

    // 7. POST com token de sessao -> 201
    r = await req('POST', '/api/admin/publications', {
        title: 'Obra Teste',
        description: 'Descrição de teste',
        complementary: '',
        published_at: '2026-11-15',
        featured: false,
        file_name: 'obra-teste.jpg',
        file_size: '1,0 MB',
        width: 800,
        height: 600,
    }, token);
    check('POST com sessão = 201', r.status === 201);
    const newId = r.data && r.data.db_id;
    check('retornou db_id', Number.isInteger(newId));

    // 8. token invalido -> 401
    const badRes = await fetch(base + '/api/admin/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer wrong-token' },
        body: JSON.stringify({ title: 'x' }),
    });
    check('token invalido = 401', badRes.status === 401);

    // 9. POST corpo invalido -> 400
    r = await req('POST', '/api/admin/publications', { title: '' }, token);
    check('POST invalido = 400', r.status === 400);

    // 10. PUT valido -> 200
    r = await req('PUT', `/api/admin/publications/${newId}`, {
        title: 'Título atualizado',
        description: 'desc',
        complementary: '',
        published_at: '2026-06-01',
        featured: false,
        file_name: 'atualizado.jpg',
        file_size: '1,0 MB',
        width: 800,
        height: 600,
    }, token);
    check('PUT valido = 200', r.status === 200);
    check('PUT aplicou title', r.data && r.data.title === 'Título atualizado');

    // 11. PUT inexistente -> 404
    r = await req('PUT', '/api/admin/publications/99999', { title: 'x' }, token);
    check('PUT inexistente = 404', r.status === 404);

    // 12. DELETE valido -> 204
    r = await req('DELETE', `/api/admin/publications/${newId}`, null, token);
    check('DELETE valido = 204', r.status === 204);

    // 13. DELETE inexistente -> 404
    r = await req('DELETE', '/api/admin/publications/99999', null, token);
    check('DELETE inexistente = 404', r.status === 404);

    // 14. GET /api/publications/999 -> 404 com corpo
    r = await req('GET', '/api/publications/999', null, null);
    check('GET 999 = 404 com error', r.status === 404 && !!r.data.error);

    // 15. GET /api/publications?featured=false -> nao inclui destaque
    r = await req('GET', '/api/publications?featured=false&limit=20', null, null);
    check('feed sem destaque', r.data.items.every(i => i.featured === false));

    // 17. GET /api/artist -> 200 com labels e topics
    r = await req('GET', '/api/artist', null, null);
    check('GET /api/artist = 200', r.status === 200);
    check('artist tem labels', r.data && typeof r.data.labels === 'object' && !Array.isArray(r.data.labels));
    check('artist tem topics', r.data && Array.isArray(r.data.topics));

    // 18. PUT /api/admin/artist com labels -> 200
    r = await req('PUT', '/api/admin/artist', {
        name: 'Artista Atualizado',
        location: 'Rio de Janeiro, Brasil',
        medium: 'Óleo',
        website: 'https://novo.com',
        store: 'Loja',
        patreon: 'Apoio',
        labels: { artist: 'Artista', location: 'Local', medium: 'Técnica', website: 'Site', store: 'Loja', patreon: 'Apoio' }
    }, token);
    check('PUT /api/admin/artist = 200', r.status === 200);
    check('artist atualizado', r.data && r.data.name === 'Artista Atualizado');

    // 19. labels refletidas no GET
    r = await req('GET', '/api/artist', null, null);
    check('labels refletidas', r.data && r.data.labels && r.data.labels.artist === 'Artista');

    // 20. POST /api/admin/topics -> 201
    r = await req('POST', '/api/admin/topics', { title: 'Tópico Teste', body: 'Corpo de teste' }, token);
    check('POST topics = 201', r.status === 201);
    const topicId = r.data && r.data.id;
    check('topic tem id', Number.isInteger(topicId));

    // 21. GET /api/artist inclui tópico
    r = await req('GET', '/api/artist', null, null);
    check('topics inclui novo', r.data && r.data.topics.some(t => t.id === topicId));

    // 22. PUT /api/admin/topics/:id -> 200
    r = await req('PUT', `/api/admin/topics/${topicId}`, { title: 'Tópico Atualizado', body: 'Corpo atualizado' }, token);
    check('PUT topic = 200', r.status === 200);

    // 23. DELETE /api/admin/topics/:id -> 204
    r = await req('DELETE', `/api/admin/topics/${topicId}`, null, token);
    check('DELETE topic = 204', r.status === 204);

    // 24. tópico removido do GET
    r = await req('GET', '/api/artist', null, null);
    check('topics sem o removido', r.data && !r.data.topics.some(t => t.id === topicId));

    // 25. PUT artist sem token -> 401
    r = await req('PUT', '/api/admin/artist', { name: 'x' }, null);
    check('PUT artist sem token = 401', r.status === 401);

    // 26. PUT artist labels inválidas -> 400
    r = await req('PUT', '/api/admin/artist', { labels: 'não é objeto' }, token);
    check('PUT labels inválido = 400', r.status === 400);

    // 16. logout -> 204
    r = await req('POST', '/api/admin/logout', null, token);
    check('logout = 204', r.status === 204);

    // 17. token apos logout -> 401
    r = await req('GET', '/api/admin/session', null, token);
    check('sessão após logout = 401', r.status === 401);

    let pass = 0;
    for (const ok of results) if (ok) pass++;
    console.log(`\n${pass}/${results.length} testes passaram`);

    await pool.end();
    process.exit(pass === results.length ? 0 : 1);
}

main().catch(e => { console.error('ERRO:', e.message); process.exit(1); });

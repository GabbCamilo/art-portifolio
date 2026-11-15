const pool = require('../src/db');

const token = process.env.ADMIN_TOKEN;
const base = 'http://localhost:3000';

async function req(method, path, body, useToken) {
    const headers = { 'Content-Type': 'application/json' };
    if (useToken) headers.Authorization = `Bearer ${token}`;
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

    // 1. POST sem token -> 401
    let r = await req('POST', '/api/admin/publications', { title: 'x' }, false);
    results.push(['POST sem token = 401', r.status === 401]);

    // 2. POST com token valido -> 201
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
    }, true);
    results.push(['POST com token valido = 201', r.status === 201]);
    const newId = r.data && r.data.db_id;
    results.push(['retornou db_id', Number.isInteger(newId)]);

    // 3. token invalido
    const badRes = await fetch(base + '/api/admin/publications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer wrong-token' },
        body: JSON.stringify({ title: 'x' }),
    });
    results.push(['token invalido = 401', badRes.status === 401]);

    // 4. POST corpo invalido -> 400
    r = await req('POST', '/api/admin/publications', { title: '' }, true);
    results.push(['POST invalido = 400', r.status === 400]);

    // 5. PUT valido -> 200
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
    }, true);
    results.push(['PUT valido = 200', r.status === 200]);
    results.push(['PUT aplicou title', r.data && r.data.title === 'Título atualizado']);

    // 6. PUT inexistente -> 404
    r = await req('PUT', '/api/admin/publications/99999', { title: 'x' }, true);
    results.push(['PUT inexistente = 404', r.status === 404]);

    // 7. DELETE valido -> 204
    r = await req('DELETE', `/api/admin/publications/${newId}`, null, true);
    results.push(['DELETE valido = 204', r.status === 204]);

    // 8. DELETE inexistente -> 404
    r = await req('DELETE', `/api/admin/publications/99999`, null, true);
    results.push(['DELETE inexistente = 404', r.status === 404]);

    // 9. GET /api/publications/999 -> 404 com corpo
    r = await req('GET', '/api/publications/999', null, false);
    results.push(['GET 999 = 404 com error', r.status === 404 && !!r.data.error]);

    // 10. GET /api/publications?featured=false -> nao inclui destaque
    r = await req('GET', '/api/publications?featured=false&limit=20', null, false);
    results.push(['feed sem destaque', r.data.items.every(i => i.featured === false)]);

    let pass = 0;
    for (const [name, ok] of results) {
        console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
        if (ok) pass++;
    }
    console.log(`\n${pass}/${results.length} testes passaram`);

    await pool.end();
    process.exit(pass === results.length ? 0 : 1);
}

main().catch(e => { console.error('ERRO:', e.message); process.exit(1); });

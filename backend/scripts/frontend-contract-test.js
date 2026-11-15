const m = require('../../frontend/js/main.js');

(async () => {
    const artist = await m.loadArtist();
    console.log('artist:', artist.name, '|', artist.location);
    console.log('labels:', JSON.stringify(artist.labels));
    console.log('topics:', artist.topics.length, 'itens');
    if (typeof artist.labels !== 'object' || Array.isArray(artist.labels)) throw new Error('labels deve ser objeto');
    if (!Array.isArray(artist.topics)) throw new Error('topics deve ser array');

    const feat = await m.loadFeatured();
    console.log('featured:', feat.id, '|', feat.title, '| featured =', feat.featured);

    const b1 = await m.loadFeedBatch(6, 0);
    console.log('batch1:', b1.items.length, 'itens | total =', b1.total, '| primeiro =', b1.items[0].id, b1.items[0].date);

    const b2 = await m.loadFeedBatch(4, 6);
    console.log('batch2:', b2.items.length, 'itens | total =', b2.total);

    console.log('indicatorWindow(5,10,3):', JSON.stringify(m.computeIndicatorWindow(5, 10, 3)));

    m.useSimulatedFallback();
    console.log('fallback artist:', m.state.artist.name, '| collection:', m.state.collection.length, '| useApi:', m.state.useApi);

    console.log('ALL OK');
})().catch(e => { console.error('FAIL:', e.message); process.exit(1); });

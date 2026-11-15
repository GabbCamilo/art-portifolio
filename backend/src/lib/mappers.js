function mapPublication(row) {
    return {
        id: `pub-${String(row.id).padStart(2, '0')}`,
        db_id: row.id,
        title: row.title,
        description: row.description,
        complementary: row.complementary,
        date: row.published_at,
        featured: Boolean(row.featured),
        image: {
            file_name: row.file_name,
            file_size: row.file_size,
            width: row.width,
            height: row.height,
            tone: row.id % 5,
        },
    };
}

module.exports = { mapPublication, mapArtist, mapTopic };

function mapArtist(row) {
    return {
        id: row.id,
        name: row.name,
        location: row.location,
        medium: row.medium,
        website: row.website,
        store: row.store,
        patreon: row.patreon,
        labels: (typeof row.labels === 'string' ? JSON.parse(row.labels || '{}') : row.labels) || {},
    };
}

function mapTopic(row) {
    return {
        id: row.id,
        title: row.title,
        body: row.body,
        position: row.position,
    };
}

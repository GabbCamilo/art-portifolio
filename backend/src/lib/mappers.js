function mapPublication(row, withText = false) {
    const base = {
        id: `pub-${String(row.id).padStart(2, '0')}`,
        db_id: row.id,
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
    if (withText) {
        base.description = row.description;
        base.complementary = row.complementary;
    }
    return base;
}

module.exports = { mapPublication, mapArtist };

function mapArtist(row) {
    return {
        id: row.id,
        name: row.name,
        location: row.location,
        medium: row.medium,
        website: row.website,
        store: row.store,
        patreon: row.patreon,
        description: row.description || '',
        labels: (typeof row.labels === 'string' ? JSON.parse(row.labels || '{}') : row.labels) || {},
        image: row.image_file_name
            ? {
                file_name: row.image_file_name,
                file_size: row.image_file_size,
                width: row.image_width,
                height: row.image_height,
            }
            : null,
    };
}

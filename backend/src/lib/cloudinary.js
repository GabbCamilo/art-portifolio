const { v2: cloudinary } = require('cloudinary');

function configureCloudinary() {
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
            api_key: process.env.CLOUDINARY_API_KEY.trim(),
            api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
        });
        return;
    }

    if (process.env.CLOUDINARY_URL) {
        try {
            const parsed = new URL(process.env.CLOUDINARY_URL.trim());
            cloudinary.config({
                cloud_name: parsed.hostname,
                api_key: decodeURIComponent(parsed.username),
                api_secret: decodeURIComponent(parsed.password),
            });
        } catch (err) {
            console.error('[cloudinary] CLOUDINARY_URL inválida:', err.message);
        }
    }
}

configureCloudinary();

function isCloudinaryConfigured() {
    const cfg = cloudinary.config();
    return Boolean(cfg.cloud_name && cfg.api_key && cfg.api_secret);
}

if (!isCloudinaryConfigured()) {
    console.error(
        '[cloudinary] Credenciais não configuradas. Defina CLOUDINARY_URL ou CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET.'
    );
}

async function uploadBufferToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'art-portfolio',
                resource_type: 'image',
                use_filename: true,
                unique_filename: true,
                transformation: [{ width: 2000, height: 2000, crop: 'limit', quality: 'auto:good' }],
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
}

function extractPublicIdFromUrl(url) {
    if (typeof url !== 'string' || !/^https?:\/\/res\.cloudinary\.com\//i.test(url)) {
        return null;
    }
    const marker = '/upload/';
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    let rest = url.slice(idx + marker.length);
    // Remove version prefix (e.g. v1732197327/) if present
    rest = rest.replace(/^v\d+\//, '');
    // Remove file extension
    return rest.replace(/\.[^/.]+$/, '');
}

async function deleteFromCloudinaryByUrl(url) {
    if (!isCloudinaryConfigured()) return null;
    const publicId = extractPublicIdFromUrl(url);
    if (!publicId) return null;
    return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}

module.exports = {
    isCloudinaryConfigured,
    uploadBufferToCloudinary,
    deleteFromCloudinaryByUrl,
    extractPublicIdFromUrl,
};

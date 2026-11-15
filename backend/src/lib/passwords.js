const crypto = require('crypto');

const SCRYPT_KEYLEN = 64;

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, SCRYPT_KEYLEN).toString('hex');
    return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password, stored) {
    if (typeof stored !== 'string') return false;
    const parts = stored.split(':');
    if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
    const [, salt, expected] = parts;
    const actual = crypto.scryptSync(password, salt, SCRYPT_KEYLEN);
    const expectedBuf = Buffer.from(expected, 'hex');
    if (expectedBuf.length !== actual.length) return false;
    return crypto.timingSafeEqual(actual, expectedBuf);
}

module.exports = { hashPassword, verifyPassword };

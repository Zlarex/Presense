require('dotenv').config()
const crypto = require('crypto')
const algorithm = process.env.ALGOCRYPT
const key = process.env.KEYCRYPT
const iv = process.env.IVCRYPT

module.exports.encrypt = (val) => {
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(val, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}
module.exports.decrypt = (encrypted) => {
    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    return (decrypted + decipher.final('utf8'));
}

module.exports.generate = (len) => {
    return crypto.randomBytes(len).toString('base64')
}
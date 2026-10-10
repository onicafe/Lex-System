import crypto from 'crypto';

// B.L.A.S.T Core Rule: AES-256 encryption at rest for PII.
// In production, this key must be a heavily guarded 32-byte (256-bit) environment variable.
// We are mocking this for local development. DO NOT commit actual keys to source control.
const ENCRYPTION_KEY = process.env.PII_VAULT_KEY || 'default_mock_dev_key_32_bytes_x!'; // 32 characters
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Encrypts a sensitive string (like a CPF or RG).
 * Returns a payload structured as `iv:encryptedData`.
 */
export function encryptPII(text: string): string {
    if (!text) return text;

    // Generate a secure random Initialization Vector
    const iv = crypto.randomBytes(IV_LENGTH);

    // Create cipher using AES-256-CBC
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);

    // Encrypt the text
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Return iv and encrypted data, delimited by a colon
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

/**
 * Decrypts a sensitive string payload structured as `iv:encryptedData`.
 */
export function decryptPII(encryptedText: string): string {
    if (!encryptedText) return encryptedText;

    const textParts = encryptedText.split(':');
    if (textParts.length !== 2) {
        throw new Error("Invalid encrypted payload format. Expected 'iv:encryptedData'.");
    }

    const iv = Buffer.from(textParts[0], 'hex');
    const encryptedData = Buffer.from(textParts[1], 'hex');

    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);

    let decrypted = decipher.update(encryptedData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}

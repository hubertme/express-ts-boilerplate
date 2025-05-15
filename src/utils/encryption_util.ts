import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

/**
 * Represents the result of an encryption operation.
 */
interface EncryptionResult {
    /** The initialization vector used for encryption, in hex format. */
    iv: string;
    /** The encrypted data hash, in hex format. */
    hash: string;
    /** The authentication tag for GCM mode, in hex format (optional). */
    authTag?: string;
}

/**
 * Represents the result of a decryption operation.
 */
interface DecryptionResult {
    /** The initialization vector used for decryption, in hex format. */
    iv: string;
    /** The decrypted plaintext string. */
    plain: string;
}

/**
 * Utility class for encryption, decryption, and hashing operations.
 */
export default class EncryptionUtil {
    /**
     * Validates the common inputs for encryption/decryption functions.
     * @param data The data to encrypt or the encrypted data.
     * @param secretKey The secret key (must be 32 characters for AES-256).
     * @param iv Optional initialization vector (must be 16 bytes / 32 hex characters if provided).
     * @throws Error if validation fails.
     */
    private static validateInput(data: string, secretKey: string, iv?: string): void {
        if (!data) throw new Error('Data is required');
        if (!secretKey || secretKey.length !== 32) throw new Error('Secret key must be 32 characters');
        if (iv) {
            try {
                const ivBuffer = Buffer.from(iv, 'hex');
                if (ivBuffer.length !== 16) throw new Error('IV must be 32 hex characters (16 bytes) when provided');
            } catch (e) {
                throw new Error('IV must be a valid hex string');
            }
        }
    }

    /**
     * Hashes a password using bcrypt.
     * @param password The password string to hash.
     * @returns A promise that resolves to the hashed password.
     * @throws Error if password is not provided.
     */
    static async hashPassword(password: string): Promise<string> {
        if (!password) throw new Error('Password is required');
        return bcrypt.hash(password, 12);
    }

    /**
     * Compares a plaintext password with a bcrypt hash.
     * @param password The plaintext password.
     * @param hash The hash to compare against.
     * @returns A promise that resolves to true if the password matches the hash, false otherwise.
     * @throws Error if password or hash is not provided.
     */
    static async comparePassword(password: string, hash: string): Promise<boolean> {
        if (!password || !hash) throw new Error('Password and hash are required');
        return bcrypt.compare(password, hash);
    }

    /**
     * Encrypts data using AES-256-CBC.
     * A new IV is generated if one is not provided.
     * @param data The string data to encrypt.
     * @param secretKey The 32-character secret key.
     * @param iv Optional 16-byte (32 hex characters) initialization vector. If not provided, one will be generated.
     * @returns An EncryptionResult object containing the iv and hash.
     * @throws Error on validation or encryption failure.
     */
    static encryptAES256CBC(data: string, secretKey: string, iv?: string): EncryptionResult {
        try {
            this.validateInput(data, secretKey, iv);
            if (!iv) {
                iv = crypto.randomBytes(16).toString('hex');
            }
            const ivBuffer = Buffer.from(iv, 'hex');
            const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(secretKey), ivBuffer);
            let encrypted = cipher.update(data);
            encrypted = Buffer.concat([encrypted, cipher.final()]);

            return {
                iv,
                hash: encrypted.toString('hex')
            };
        } catch (e) {
            throw e;
        }
    }

    /**
     * Decrypts data using AES-256-CBC.
     * @param encData The encrypted data hash (hex string).
     * @param secretKey The 32-character secret key.
     * @param iv The 16-byte (32 hex characters) initialization vector used for encryption.
     * @returns A DecryptionResult object containing the original iv and decrypted plaintext.
     * @throws Error on validation or decryption failure.
     */
    static decryptAES256CBC(encData: string, secretKey: string, iv: string): DecryptionResult {
        try {
            this.validateInput(encData, secretKey, iv);
            const encrypted = Buffer.from(encData, 'hex');
            const ivBuffer = Buffer.from(iv, 'hex');
            const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(secretKey), ivBuffer);
            let decrypted = decipher.update(encrypted);
            decrypted = Buffer.concat([decrypted, decipher.final()]);

            return {
                iv,
                plain: decrypted.toString('utf8')
            };
        } catch (e) {
            throw e;
        }
    }

    /**
     * Encrypts data using AES-256-GCM.
     * A new IV is generated if one is not provided.
     * GCM mode provides both encryption and authentication.
     * @param data The string data to encrypt.
     * @param secretKey The 32-character secret key.
     * @param iv Optional 16-byte (32 hex characters) initialization vector. If not provided, one will be generated.
     * @returns An EncryptionResult object containing the iv, hash, and authTag.
     * @throws Error on validation or encryption failure.
     */
    static encryptAES256GCM(data: string, secretKey: string, iv?: string): EncryptionResult {
        try {
            this.validateInput(data, secretKey, iv);
            if (!iv) {
                iv = crypto.randomBytes(16).toString('hex');
            }
            const ivBuffer = Buffer.from(iv, 'hex');
            const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(secretKey), ivBuffer);
            let encrypted = cipher.update(data);
            encrypted = Buffer.concat([encrypted, cipher.final()]);

            return {
                iv,
                hash: encrypted.toString('hex'),
                authTag: cipher.getAuthTag().toString('hex')
            };
        } catch (e) {
            throw e;
        }
    }

    /**
     * Decrypts data using AES-256-GCM.
     * Requires the authentication tag generated during encryption.
     * @param encData The encrypted data hash (hex string).
     * @param secretKey The 32-character secret key.
     * @param iv The 16-byte (32 hex characters) initialization vector used for encryption.
     * @param authTag The authentication tag (hex string) generated during encryption.
     * @returns A DecryptionResult object containing the original iv and decrypted plaintext.
     * @throws Error on validation, authTag missing, or decryption/authentication failure.
     */
    static decryptAES256GCM(encData: string, secretKey: string, iv: string, authTag: string): DecryptionResult {
        try {
            this.validateInput(encData, secretKey, iv);
            if (!authTag) throw new Error('Auth tag is required for GCM decryption');
            
            const encrypted = Buffer.from(encData, 'hex');
            const ivBuffer = Buffer.from(iv, 'hex');
            const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(secretKey), ivBuffer);
            decipher.setAuthTag(Buffer.from(authTag, 'hex'));
            let decrypted = decipher.update(encrypted);
            decrypted = Buffer.concat([decrypted, decipher.final()]);

            return {
                iv,
                plain: decrypted.toString('utf8')
            };
        } catch (e) {
            throw e;
        }
    }

    /**
     * Creates a Version 4 UUID.
     * @returns A string representing the generated UUID.
     */
    static createUUID(): string {
        return uuidv4();
    }
} 
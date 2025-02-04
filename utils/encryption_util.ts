import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

interface EncryptionResult {
    iv: string;
    hash: string;
    authTag?: string;
}

interface DecryptionResult {
    iv: string;
    plain: string;
}

export default class EncryptionUtil {
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

    static async hashPassword(password: string): Promise<string> {
        if (!password) throw new Error('Password is required');
        return bcrypt.hash(password, 12);
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        if (!password || !hash) throw new Error('Password and hash are required');
        return bcrypt.compare(password, hash);
    }

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

    static createUUID(): string {
        return uuidv4();
    }
}

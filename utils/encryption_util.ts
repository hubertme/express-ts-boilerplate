import crypto from "crypto";
import {v4 as uuidv4} from "uuid";

export default class EncryptionUtil {
    /**
     * Encrypt plain data to a hex hash using AES 256 CBC
     *
     * @param data - Plain data to be encrypted using AES 256 CBC
     * @param secretKey - Must be 32 characters in length (256-bit)
     * @param iv - Must be 16 characters in length
     *
     * @return An object with two keys "iv" (initialisation vector) and "hash" (the encrypted data)
     */
    static encryptAES256CBC(data: string, secretKey: string, iv: string = null): {[key: string]: any} {
        try {
            if (iv === null || iv == undefined) {
                iv = crypto.randomBytes(8).toString('hex');
            }
            const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(secretKey), iv);

            let encrypted = cipher.update(data);
            encrypted = Buffer.concat([encrypted, cipher.final()]);

            return {
                iv,
                hash: encrypted.toString('hex'),
            }
        } catch (e) {
            throw e;
        }
    }

    /**
     * Decrypt a hex string (hash of AES 256 CBC)
     *
     * @param encData - Encrypted data to be decrypted using AES 256 CBC
     * @param secretKey - Must be 32 characters in length (256-bit)
     * @param iv - Must be 16 characters in length
     *
     * @return An object with two keys: "iv" (initialisation vector) and "plain" (the actual unencrypted data)
     */
    static decryptAES256CBC(encData: string, secretKey: string, iv: string): {[key: string]: any} {
        try {
            const encrypted = Buffer.from(encData, 'hex');
            const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(secretKey), iv);
            let decrypted = decipher.update(encrypted);
            decrypted = Buffer.concat([decrypted, decipher.final()]);

            return {
                iv,
                plain: decrypted.toString('utf8'),
            }
        } catch (e) {
            throw e;
        }
    }

    /**
     * Encrypt plain data to a hex hash using AES 256 GCM
     *
     * @param data - Plain data to be encrypted using AES 256 GCM
     * @param secretKey - Must be 32 characters in length (256-bit)
     * @param iv - Must be 16 characters in length
     *
     * @return An object with two keys "iv" (initialisation vector) and "hash" (the encrypted data)
     */
    static encryptAES256GCM(data: string, secretKey: string, iv: string = null): {[key: string]: any} {
        try {
            if (iv === null || iv == undefined) {
                iv = crypto.randomBytes(8).toString('hex');
            }
            const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(secretKey), iv);

            let encrypted = cipher.update(data);
            encrypted = Buffer.concat([encrypted, cipher.final()]);

            return {
                iv,
                hash: encrypted.toString('hex'),
                authTag: cipher.getAuthTag().toString('hex'),
            }
        } catch (e) {
            throw e;
        }
    }


    /**
     * Decrypt a hex string (hash of AES 256 GCM)
     *
     * @param encData - Encrypted data to be decrypted using AES 256 GCM
     * @param secretKey - Must be 32 characters in length (256-bit)
     * @param iv - Must be 16 characters in length
     * @param authTag
     *
     * @return An object with two keys: "iv" (initialisation vector) and "plain" (the actual unencrypted data)
     */
    static decryptAES256GCM(encData: string, secretKey: string, iv: string, authTag: string): {[key: string]: any} {
        try {
            const encrypted = Buffer.from(encData, 'hex');
            const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(secretKey), iv);
            decipher.setAuthTag(Buffer.from(authTag, 'hex'));

            let decrypted = decipher.update(encrypted);
            decrypted = Buffer.concat([decrypted, decipher.final()]);

            return {
                iv,
                plain: decrypted.toString('utf8'),
            }
        } catch (e) {
            throw e;
        }
    }

    static hashMD5(data: string): string {
        try {
            const md5Hasher = crypto.createHash("md5");
            const hash = md5Hasher.update(data).digest('hex').toString();

            return hash;
        } catch (e) {
            throw e;
        }
    }

    /**
     * Create new v4 uuid to be used as random key
     * @returns 
     */
    static createUUID(): string {
        return uuidv4();
    }
}

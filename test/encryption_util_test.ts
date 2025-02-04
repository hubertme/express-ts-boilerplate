import { assert } from "chai";
import EncryptionUtil from "../utils/encryption_util";

describe('EncryptionUtil', () => {
    const testString = 'this is another test string';
    const secretKey = '7^dKqU$aDa^PPvAZ6YxJZMFgn=t7^qB3';
    const iv = '0123456789abcdef0123456789abcdef';

    describe('AES-256-CBC', () => {
        it('should encrypt and decrypt data correctly', () => {
            const encrypted = EncryptionUtil.encryptAES256CBC(testString, secretKey, iv);
            assert.exists(encrypted.hash);
            const decrypted = EncryptionUtil.decryptAES256CBC(encrypted.hash, secretKey, iv);
            assert.equal(decrypted.plain, testString);
        });

        it('should generate IV when not provided', () => {
            const encrypted = EncryptionUtil.encryptAES256CBC(testString, secretKey);
            assert.exists(encrypted.iv);
            assert.equal(Buffer.from(encrypted.iv, 'hex').length, 16);

            const decrypted = EncryptionUtil.decryptAES256CBC(encrypted.hash, secretKey, encrypted.iv);
            assert.equal(decrypted.plain, testString);
        });

        it('should throw error on invalid input', () => {
            assert.throws(() => EncryptionUtil.encryptAES256CBC('', secretKey), 'Data is required');
            assert.throws(() => EncryptionUtil.encryptAES256CBC(testString, 'short-key'), 'Secret key must be 32 characters');
        });
    });

    describe('AES-256-GCM', () => {
        it('should encrypt and decrypt data correctly with auth tag', () => {
            const encrypted = EncryptionUtil.encryptAES256GCM(testString, secretKey, iv);
            assert.exists(encrypted.authTag);

            const decrypted = EncryptionUtil.decryptAES256GCM(encrypted.hash, secretKey, iv, encrypted.authTag);
            assert.equal(decrypted.plain, testString);
        });
    });

    describe('Password Hashing', () => {
        it('should hash and verify passwords correctly', async () => {
            const password = 'test-password-123';
            const hash = await EncryptionUtil.hashPassword(password);
            
            const isValid = await EncryptionUtil.comparePassword(password, hash);
            assert.isTrue(isValid);
            
            const isInvalid = await EncryptionUtil.comparePassword('wrong-password', hash);
            assert.isFalse(isInvalid);
        });

        it('should throw error on invalid input', async () => {
            try {
                await EncryptionUtil.hashPassword('');
                assert.fail('Should have thrown an error');
            } catch (error: any) {
                assert.equal(error.message, 'Password is required');
            }
            
            try {
                await EncryptionUtil.comparePassword('', 'hash');
                assert.fail('Should have thrown an error');
            } catch (error: any) {
                assert.equal(error.message, 'Password and hash are required');
            }
        });
    });
});

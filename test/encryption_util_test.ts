import {assert} from "chai";
import IndexBiz from "../src/index/index_biz";
import EncryptionUtil from "../utils/encryption_util";
import crypto from "crypto";

describe('EncryptionUtil', () => {
    it('Create an MD5 hash', () => {
        const string = "test it as it is";
        const hash = EncryptionUtil.hashMD5(string);

        assert.equal(hash, 'e10308104933a9630d7b6e89fe3db632');
    });

    it('Create an AES-256-CBC encrypt/decrypt', () => {
        const string = 'this is another test string';
        const secretKey = '7^dKqU$aDa^PPvAZ6YxJZMFgn=t7^qB3';
        const iv = 'sK3HG2A^x$EpW6*j';

        const encryptString = EncryptionUtil.encryptAES256CBC(string, secretKey, iv)['hash'];
        assert.equal(encryptString.toUpperCase(), 'C30FA233D0714C3E9A391CB293732B18A9FEA8B37964733061F65B41A22D6EF2');

        const decryptString = EncryptionUtil.decryptAES256CBC(encryptString, secretKey, iv)['plain'];
        assert.equal(decryptString, string);
    })
});

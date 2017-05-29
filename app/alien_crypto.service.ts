import {Injectable, Inject} from '@angular/core'
import {Keyring} from "./models/keyring.model";
import {CookieManager} from "./cookie_manager.service";
import {Conversation} from "./models/conversation.model";

declare var pbkdf2Sync: any;
declare var aesjs: any;
declare var window: any;
declare var base64js: any;
declare var JSEncrypt: any;

export class RsaKeyPair {
    public public_key: string = "";
    public private_key: string = "";
};
export type RsaGenerationCallback = (keyPair: RsaKeyPair)=>void;

@Injectable()
export class AlienCrypto {
    public nPbkdf2Iterations: number = 100000;
    private masterKey: any;
    private keyring: Keyring;

    public dumpKeyring(): Keyring {
        return <Keyring>JSON.parse(JSON.stringify(this.keyring));
    }

    constructor(@Inject(CookieManager) private sCookieManager: CookieManager) {}

    public get_test_pwd_hash(login: string, password: string, nIterations: number): string {
        var bytes = pbkdf2Sync(password, "alien_test_pwd_pash_"+login, nIterations, 32, 'sha512');
        return base64js.fromByteArray(bytes);
    };

    public generateMasterKey(login: string, password: string): void {
        this.masterKey = pbkdf2Sync(password, login, this.nPbkdf2Iterations, 256 / 8, 'sha512');
    }


    public saveMasterKeyInCookies(): void {
        let encodedMk = base64js.fromByteArray(this.masterKey);
        this.sCookieManager.setCookie("mk", encodedMk, 30, "s");
    }

    public loadMasterKeyFromCookies(): void {
        let mkCookie = this.sCookieManager.getCookie("mk");
        this.masterKey = base64js.toByteArray(mkCookie);
        console.log(this.masterKey);
    }

    public encryptKeyring(keyring: Keyring): string {
        var textBytes = aesjs.util.convertStringToBytes(JSON.stringify(keyring));
        var aesCtr = new aesjs.ModeOfOperation.ctr(this.masterKey, new aesjs.Counter());
        var encryptedBytes = aesCtr.encrypt(textBytes);
        var base64 = base64js.fromByteArray(encryptedBytes);
        return base64;
    }

    public decryptKeyring(base64: string): void {
        var raw = base64js.toByteArray(base64);
        var aesCtr = new aesjs.ModeOfOperation.ctr(this.masterKey, new aesjs.Counter());
        var decrypted = aesCtr.decrypt(raw);
        var decryptedString = aesjs.util.convertBytesToString(decrypted);
        this.keyring =  JSON.parse(decryptedString);

        console.log(this.keyring);
    }

    public generateKeyPair(callback: RsaGenerationCallback): void {
        var crypt = new JSEncrypt({default_key_size: 2048});
        crypt.getKey(function () {
            var res = new RsaKeyPair();
            res.private_key = crypt.getPrivateKey();
            res.public_key = crypt.getPublicKey();
            callback(res);
        });
    }

    public encryptWithPublicKey(pubKey: string, content: string) {
        let encrypt: any = new JSEncrypt();
        encrypt.setPublicKey(pubKey);
        return encrypt.encrypt(content);
    }

    public decryptWithPrivateKey(encryptedData: string): string {
        let encrypt: any = new JSEncrypt();
        encrypt.setPrivateKey(this.keyring.private_keys[this.keyring.private_keys.length - 1]);
        return encrypt.decrypt(encryptedData);
    }

    public genereteAesKey(): string {
        let key = "";
        const hex = "0123456789abcdef";

        for (let i: number = 0; i < 64; i++) {
            key += hex.charAt(Math.floor(Math.random() * 16));
        }

        return key;
    }

    private parseHexString(str: string) {
        let result: any[] = [];
        while (str.length >= 2) {
            result.push(parseInt(str.substring(0, 2), 16));

            str = str.substring(2, str.length);
        }

        return result;
    }

    public getConvKey(convId: string) {
        let convKey: string = this.keyring.conversations[convId];
        if(!convKey)
            return null;

        return this.parseHexString(convKey);
    }

    public encryptMessage(convId: string, message: string) {
        let key: any[] = this.getConvKey(convId);
        if(!key)
            return null;
        console.log(key);

        var textBytes = aesjs.util.convertStringToBytes(message);
        var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter());
        var encryptedBytes = aesCtr.encrypt(textBytes);
        var base64 = base64js.fromByteArray(encryptedBytes);
        return base64;
    }

    public decryptMessage(convId: string, message: string): string {
        let key: any[] = this.getConvKey(convId);
        if(!key)
            return null;

        var raw = base64js.toByteArray(message);
        var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter());
        var decrypted = aesCtr.decrypt(raw);
        var decryptedString = aesjs.util.convertBytesToString(decrypted);

        console.log(decryptedString);

        return decryptedString;
    }
}
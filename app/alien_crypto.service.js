System.register(['@angular/core', "./cookie_manager.service"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1, cookie_manager_service_1;
    var RsaKeyPair, AlienCrypto;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (cookie_manager_service_1_1) {
                cookie_manager_service_1 = cookie_manager_service_1_1;
            }],
        execute: function() {
            RsaKeyPair = (function () {
                function RsaKeyPair() {
                    this.public_key = "";
                    this.private_key = "";
                }
                return RsaKeyPair;
            }());
            exports_1("RsaKeyPair", RsaKeyPair);
            ;
            AlienCrypto = (function () {
                function AlienCrypto(sCookieManager) {
                    this.sCookieManager = sCookieManager;
                    this.nPbkdf2Iterations = 100000;
                }
                AlienCrypto.prototype.dumpKeyring = function () {
                    return JSON.parse(JSON.stringify(this.keyring));
                };
                AlienCrypto.prototype.get_test_pwd_hash = function (login, password, nIterations) {
                    var bytes = pbkdf2Sync(password, "alien_test_pwd_pash_" + login, nIterations, 32, 'sha512');
                    return base64js.fromByteArray(bytes);
                };
                ;
                AlienCrypto.prototype.generateMasterKey = function (login, password) {
                    this.masterKey = pbkdf2Sync(password, login, this.nPbkdf2Iterations, 256 / 8, 'sha512');
                };
                AlienCrypto.prototype.saveMasterKeyInCookies = function () {
                    var encodedMk = base64js.fromByteArray(this.masterKey);
                    this.sCookieManager.setCookie("mk", encodedMk, 30, "s");
                };
                AlienCrypto.prototype.loadMasterKeyFromCookies = function () {
                    var mkCookie = this.sCookieManager.getCookie("mk");
                    this.masterKey = base64js.toByteArray(mkCookie);
                    console.log(this.masterKey);
                };
                AlienCrypto.prototype.encryptKeyring = function (keyring) {
                    var textBytes = aesjs.util.convertStringToBytes(JSON.stringify(keyring));
                    var aesCtr = new aesjs.ModeOfOperation.ctr(this.masterKey, new aesjs.Counter());
                    var encryptedBytes = aesCtr.encrypt(textBytes);
                    var base64 = base64js.fromByteArray(encryptedBytes);
                    return base64;
                };
                AlienCrypto.prototype.decryptKeyring = function (base64) {
                    var raw = base64js.toByteArray(base64);
                    var aesCtr = new aesjs.ModeOfOperation.ctr(this.masterKey, new aesjs.Counter());
                    var decrypted = aesCtr.decrypt(raw);
                    var decryptedString = aesjs.util.convertBytesToString(decrypted);
                    this.keyring = JSON.parse(decryptedString);
                    console.log(this.keyring);
                };
                AlienCrypto.prototype.generateKeyPair = function (callback) {
                    var crypt = new JSEncrypt({ default_key_size: 2048 });
                    crypt.getKey(function () {
                        var res = new RsaKeyPair();
                        res.private_key = crypt.getPrivateKey();
                        res.public_key = crypt.getPublicKey();
                        callback(res);
                    });
                };
                AlienCrypto.prototype.encryptWithPublicKey = function (pubKey, content) {
                    var encrypt = new JSEncrypt();
                    encrypt.setPublicKey(pubKey);
                    return encrypt.encrypt(content);
                };
                AlienCrypto.prototype.decryptWithPrivateKey = function (encryptedData) {
                    var encrypt = new JSEncrypt();
                    encrypt.setPrivateKey(this.keyring.private_keys[this.keyring.private_keys.length - 1]);
                    return encrypt.decrypt(encryptedData);
                };
                AlienCrypto.prototype.genereteAesKey = function () {
                    var key = "";
                    var hex = "0123456789abcdef";
                    for (var i = 0; i < 64; i++) {
                        key += hex.charAt(Math.floor(Math.random() * 16));
                    }
                    return key;
                };
                AlienCrypto.prototype.parseHexString = function (str) {
                    var result = [];
                    while (str.length >= 2) {
                        result.push(parseInt(str.substring(0, 2), 16));
                        str = str.substring(2, str.length);
                    }
                    return result;
                };
                AlienCrypto.prototype.getConvKey = function (convId) {
                    var convKey = this.keyring.conversations[convId];
                    if (!convKey)
                        return null;
                    return this.parseHexString(convKey);
                };
                AlienCrypto.prototype.encryptMessage = function (convId, message) {
                    var key = this.getConvKey(convId);
                    if (!key)
                        return null;
                    console.log(key);
                    var textBytes = aesjs.util.convertStringToBytes(message);
                    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter());
                    var encryptedBytes = aesCtr.encrypt(textBytes);
                    var base64 = base64js.fromByteArray(encryptedBytes);
                    return base64;
                };
                AlienCrypto.prototype.decryptMessage = function (convId, message) {
                    var key = this.getConvKey(convId);
                    if (!key)
                        return null;
                    var raw = base64js.toByteArray(message);
                    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter());
                    var decrypted = aesCtr.decrypt(raw);
                    var decryptedString = aesjs.util.convertBytesToString(decrypted);
                    console.log(decryptedString);
                    return decryptedString;
                };
                AlienCrypto = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.Inject(cookie_manager_service_1.CookieManager)), 
                    __metadata('design:paramtypes', [cookie_manager_service_1.CookieManager])
                ], AlienCrypto);
                return AlienCrypto;
            }());
            exports_1("AlienCrypto", AlienCrypto);
        }
    }
});
//# sourceMappingURL=alien_crypto.service.js.map
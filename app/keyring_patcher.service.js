System.register(['@angular/core', "./alien_crypto.service", "./models/ext_conv_id.model", "./models/patch_request.model"], function(exports_1, context_1) {
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
    var core_1, alien_crypto_service_1, ext_conv_id_model_1, patch_request_model_1;
    var KeyringPatcher;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (alien_crypto_service_1_1) {
                alien_crypto_service_1 = alien_crypto_service_1_1;
            },
            function (ext_conv_id_model_1_1) {
                ext_conv_id_model_1 = ext_conv_id_model_1_1;
            },
            function (patch_request_model_1_1) {
                patch_request_model_1 = patch_request_model_1_1;
            }],
        execute: function() {
            KeyringPatcher = (function () {
                function KeyringPatcher(sAlienCrypto) {
                    this.sAlienCrypto = sAlienCrypto;
                    this.sApiClient = null;
                    this.patchAgain = false;
                    this.fetchStarted = false;
                }
                KeyringPatcher.prototype.beginPatching = function () {
                    var self = this;
                    if (this.fetchStarted) {
                        this.patchAgain = true;
                        return;
                    }
                    var die = function () {
                        self.fetchStarted = false;
                        if (self.patchAgain)
                            self.beginPatching();
                    };
                    this.fetchStarted = true;
                    this.sApiClient.getPatches(function (status, body) {
                        if (status && status === 200) {
                            var key = body.key;
                            if (key === -1 || body.patches.length === 0)
                                return die();
                            var keyringDump_1 = self.sAlienCrypto.dumpKeyring();
                            var patchIds_1 = [];
                            var patches = body.patches;
                            patches.forEach(function (patch) {
                                if (patch.type === 'new_convkey_insert') {
                                    keyringDump_1.conversations[new ext_conv_id_model_1.ExtConvId(patch.conv_id).id()] =
                                        self.sAlienCrypto.decryptWithPrivateKey(patch.key);
                                    patchIds_1.push(patch['_id']['$oid']);
                                }
                            });
                            console.error(keyringDump_1);
                            var request = new patch_request_model_1.PatchRequest();
                            request.key = key;
                            request.patches = patchIds_1;
                            request.keyring = self.sAlienCrypto.encryptKeyring(keyringDump_1);
                            self.sApiClient.applyPatches(request, function (status) {
                                console.log("ApplyPatches status code: " + status);
                                return die();
                            });
                        }
                        if (status && status === 419)
                            setTimeout(function () {
                                self.beginPatching();
                            }, 2000 * 1000);
                    });
                };
                KeyringPatcher = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.Inject(alien_crypto_service_1.AlienCrypto)), 
                    __metadata('design:paramtypes', [alien_crypto_service_1.AlienCrypto])
                ], KeyringPatcher);
                return KeyringPatcher;
            }());
            exports_1("KeyringPatcher", KeyringPatcher);
        }
    }
});
//# sourceMappingURL=keyring_patcher.service.js.map
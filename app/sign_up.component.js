System.register(["@angular/core", "./session.service", "./window_mgr.service", "./api_client.service", "./alien_crypto.service", "./recaptcha_overlay.component", "./models/registration_request_body.model", "./models/keyring.model", "./models/hash_info.model", "./status_window.component"], function(exports_1, context_1) {
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
    var core_1, session_service_1, window_mgr_service_1, api_client_service_1, alien_crypto_service_1, core_2, recaptcha_overlay_component_1, registration_request_body_model_1, keyring_model_1, hash_info_model_1, status_window_component_1;
    var SignUpComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
            },
            function (session_service_1_1) {
                session_service_1 = session_service_1_1;
            },
            function (window_mgr_service_1_1) {
                window_mgr_service_1 = window_mgr_service_1_1;
            },
            function (api_client_service_1_1) {
                api_client_service_1 = api_client_service_1_1;
            },
            function (alien_crypto_service_1_1) {
                alien_crypto_service_1 = alien_crypto_service_1_1;
            },
            function (recaptcha_overlay_component_1_1) {
                recaptcha_overlay_component_1 = recaptcha_overlay_component_1_1;
            },
            function (registration_request_body_model_1_1) {
                registration_request_body_model_1 = registration_request_body_model_1_1;
            },
            function (keyring_model_1_1) {
                keyring_model_1 = keyring_model_1_1;
            },
            function (hash_info_model_1_1) {
                hash_info_model_1 = hash_info_model_1_1;
            },
            function (status_window_component_1_1) {
                status_window_component_1 = status_window_component_1_1;
            }],
        execute: function() {
            SignUpComponent = (function () {
                function SignUpComponent(sSessionManager, sWindowManager, sApiClient, sAlienCrypto) {
                    this.sSessionManager = sSessionManager;
                    this.sWindowManager = sWindowManager;
                    this.sApiClient = sApiClient;
                    this.sAlienCrypto = sAlienCrypto;
                    this.isOpen = false;
                    this.mSignUpStarted = false;
                    this.mCloseAllowed = false;
                    this.mSignUpStatus = "";
                    this.regions = [{ id: 0, name: "EU0", info: "EU0 - Amsterdam" }];
                    this.requestBody = new registration_request_body_model_1.RegistrationRequestBody();
                    var self = this;
                    sWindowManager.subscribeOnGlobalEvent("openSignUp", function (data) {
                        self.isOpen = true;
                        draggable_window.showIt(self.mainBlock.nativeElement);
                        var elWidth = parseInt(window.getComputedStyle(self.mainBlock.nativeElement).width, 10);
                        var elHeight = 450;
                        var docWidth = document.documentElement.clientWidth;
                        var docHeight = window.innerHeight;
                        var x = (docWidth / 2 - elWidth / 2);
                        var y = (docHeight / 2 - elHeight / 2);
                        self.mainBlock.nativeElement.style.left =
                            x + "px";
                        self.mainBlock.nativeElement.style.top =
                            y + "px";
                    });
                }
                SignUpComponent.prototype.signInAfterRegistration = function (test_password_hash) {
                    var self = this;
                    this.mSignUpStarted = false;
                    this.statusWindow.show();
                    this.statusWindow.setCaption("Signing in...");
                    this.sApiClient.authorizeWithoutToken(this.requestBody.login, this.mPassword, function (finished, status) {
                        if (finished) {
                            setTimeout(function () {
                                self.isOpen = false;
                                self.statusWindow.close();
                            }, 1000);
                        }
                        self.statusWindow.setStatus(status);
                    }, this.mRecaptchaBlock, false, test_password_hash);
                };
                SignUpComponent.prototype.onSubmit = function (ev) {
                    ev.preventDefault();
                    this.performSignUp();
                };
                SignUpComponent.prototype.performSignUp = function () {
                    //Todo: make it dynamically chosen
                    console.log(this.requestBody.login);
                    this.mSignUpStarted = true;
                    this.mSignUpStatus = "Generating RSA keypair...";
                    var self = this;
                    this.sAlienCrypto.generateKeyPair(function (rsaKeyPair) {
                        var initialKeyring = new keyring_model_1.Keyring();
                        initialKeyring.pushPrivateKey(rsaKeyPair.private_key);
                        self.requestBody.public_key = rsaKeyPair.public_key;
                        var hashInfo = new hash_info_model_1.HashInfo();
                        hashInfo.alg = "pbkdf2/sha512";
                        hashInfo.nIterations = self.sAlienCrypto.nPbkdf2Iterations;
                        self.requestBody.hash_info = hashInfo;
                        self.mSignUpStatus = "Computing the test password hash...";
                        setTimeout(function () {
                            self.requestBody.test_pwd_hash = self.sAlienCrypto
                                .get_test_pwd_hash(self.requestBody.login, self.mPassword, self.sAlienCrypto.nPbkdf2Iterations);
                            self.mSignUpStatus = "Computing the master key and encrypting the keyring...";
                            setImmediate(function () {
                                self.sAlienCrypto.generateMasterKey(self.requestBody.login, self.mPassword);
                                self.requestBody.keyring = self.sAlienCrypto.encryptKeyring(initialKeyring);
                                self.mSignUpStatus = "Waiting for a backend response...";
                                var body = JSON.stringify(self.requestBody.serialize());
                                self.sApiClient.registration(body, self.mRecaptchaBlock, function (res) {
                                    var status = res.status;
                                    self.mCloseAllowed = true;
                                    switch (status) {
                                        case 0:
                                            self.mSignUpStatus = "Unknown error, please contact the administration";
                                            break;
                                        case 200:
                                            self.signInAfterRegistration(self.requestBody.test_pwd_hash);
                                            break;
                                        case 412:
                                            self.mSignUpStatus = "Error: Login contains invalid characters";
                                            break;
                                        case 413:
                                            self.mSignUpStatus = "Error: This login is already being used";
                                            break;
                                    }
                                });
                            });
                        }, 0);
                    });
                    /*
                            this.mRecaptchaBlock.show(function (err: boolean, token: string) {
                                if(err)
                                    alert("err");
                                else
                                    alert(token);
                            });
                    */
                };
                ;
                SignUpComponent.prototype.ngOnInit = function () {
                    this.requestBody.region = this.regions[0];
                    jQuery('#registration_form_container').perfectScrollbar();
                };
                __decorate([
                    core_2.ViewChild('mainBlock'), 
                    __metadata('design:type', core_1.ElementRef)
                ], SignUpComponent.prototype, "mainBlock", void 0);
                __decorate([
                    core_2.ViewChild('recaptchaBlock'), 
                    __metadata('design:type', recaptcha_overlay_component_1.ReCaptchaBlockComponent)
                ], SignUpComponent.prototype, "mRecaptchaBlock", void 0);
                __decorate([
                    core_2.ViewChild('statusWindow'), 
                    __metadata('design:type', status_window_component_1.StatusWindowComponent)
                ], SignUpComponent.prototype, "statusWindow", void 0);
                SignUpComponent = __decorate([
                    core_1.Component({
                        selector: 'sign-up',
                        templateUrl: './app/sign_up.component.html',
                        styleUrls: ['./app/sign_up.component.css']
                    }), 
                    __metadata('design:paramtypes', [session_service_1.UserSession, window_mgr_service_1.WindowManager, api_client_service_1.ApiClient, alien_crypto_service_1.AlienCrypto])
                ], SignUpComponent);
                return SignUpComponent;
            }());
            exports_1("SignUpComponent", SignUpComponent);
        }
    }
});
//# sourceMappingURL=sign_up.component.js.map
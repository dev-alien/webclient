System.register(["@angular/core", "./session.service", "./window_mgr.service", "./api_client.service", "./alien_crypto.service", "./status_window.component", "./recaptcha_overlay.component"], function(exports_1, context_1) {
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
    var core_1, session_service_1, window_mgr_service_1, api_client_service_1, alien_crypto_service_1, core_2, status_window_component_1, recaptcha_overlay_component_1;
    var SignInComponent;
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
            function (status_window_component_1_1) {
                status_window_component_1 = status_window_component_1_1;
            },
            function (recaptcha_overlay_component_1_1) {
                recaptcha_overlay_component_1 = recaptcha_overlay_component_1_1;
            }],
        execute: function() {
            SignInComponent = (function () {
                function SignInComponent(sSessionManager, sWindowManager, sApiClient, sAlienCrypto) {
                    this.sSessionManager = sSessionManager;
                    this.sWindowManager = sWindowManager;
                    this.sApiClient = sApiClient;
                    this.sAlienCrypto = sAlienCrypto;
                    this.mSignInStarted = false;
                    this.isOpen = false;
                    this.storeSessiong = false;
                    var self = this;
                    sWindowManager.subscribeOnGlobalEvent("signInOpen", function (data) {
                        self.isOpen = true;
                        draggable_window.showIt(self.mainBlock.nativeElement);
                        var elWidth = parseInt(window.getComputedStyle(self.mainBlock.nativeElement).width, 10);
                        var elHeight = 240;
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
                SignInComponent.prototype.performSignIn = function () {
                    var self = this;
                    this.statusWindow.show();
                    this.statusWindow.setCaption("Signing in...");
                    this.sApiClient.authorizeWithoutToken(this.login, this.password, function (finished, status) {
                        if (finished) {
                            setTimeout(function () {
                                self.isOpen = false;
                                self.statusWindow.close();
                            }, 1000);
                        }
                        self.statusWindow.setStatus(status);
                    }, this.mRecaptchaBlock);
                };
                __decorate([
                    core_2.ViewChild('mainBlock'), 
                    __metadata('design:type', core_1.ElementRef)
                ], SignInComponent.prototype, "mainBlock", void 0);
                __decorate([
                    core_2.ViewChild('statusWindow'), 
                    __metadata('design:type', status_window_component_1.StatusWindowComponent)
                ], SignInComponent.prototype, "statusWindow", void 0);
                __decorate([
                    core_2.ViewChild('recaptchaBlock'), 
                    __metadata('design:type', recaptcha_overlay_component_1.ReCaptchaBlockComponent)
                ], SignInComponent.prototype, "mRecaptchaBlock", void 0);
                SignInComponent = __decorate([
                    core_1.Component({
                        selector: 'sign-in',
                        templateUrl: './app/sign_in.component.html',
                        styleUrls: ['./app/sign_in.component.css']
                    }), 
                    __metadata('design:paramtypes', [session_service_1.UserSession, window_mgr_service_1.WindowManager, api_client_service_1.ApiClient, alien_crypto_service_1.AlienCrypto])
                ], SignInComponent);
                return SignInComponent;
            }());
            exports_1("SignInComponent", SignInComponent);
        }
    }
});
//# sourceMappingURL=sign_in.component.js.map
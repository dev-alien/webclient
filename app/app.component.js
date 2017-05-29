System.register(["@angular/core", "./session.service", "./api_client.service", "./window_mgr.service", "./alien_crypto.service", "./cookie_manager.service", "./recaptcha_overlay.component", "./notification_listener.service", "./keyring_patcher.service"], function(exports_1, context_1) {
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
    var core_1, session_service_1, api_client_service_1, window_mgr_service_1, alien_crypto_service_1, cookie_manager_service_1, recaptcha_overlay_component_1, notification_listener_service_1, keyring_patcher_service_1;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (session_service_1_1) {
                session_service_1 = session_service_1_1;
            },
            function (api_client_service_1_1) {
                api_client_service_1 = api_client_service_1_1;
            },
            function (window_mgr_service_1_1) {
                window_mgr_service_1 = window_mgr_service_1_1;
            },
            function (alien_crypto_service_1_1) {
                alien_crypto_service_1 = alien_crypto_service_1_1;
            },
            function (cookie_manager_service_1_1) {
                cookie_manager_service_1 = cookie_manager_service_1_1;
            },
            function (recaptcha_overlay_component_1_1) {
                recaptcha_overlay_component_1 = recaptcha_overlay_component_1_1;
            },
            function (notification_listener_service_1_1) {
                notification_listener_service_1 = notification_listener_service_1_1;
            },
            function (keyring_patcher_service_1_1) {
                keyring_patcher_service_1 = keyring_patcher_service_1_1;
            }],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(sCookieManager, sAlienCrypto, sUserSession, sApiClient, sWindowManager, sNotificationListener) {
                    this.sCookieManager = sCookieManager;
                    this.sAlienCrypto = sAlienCrypto;
                    this.sUserSession = sUserSession;
                    this.sApiClient = sApiClient;
                    this.sWindowManager = sWindowManager;
                    this.sNotificationListener = sNotificationListener;
                }
                AppComponent.prototype.ngOnInit = function () {
                    this.sWindowManager.globalRecaptchaBlock = this.recaptchaBlock;
                    var self = this;
                    this.sUserSession.loadTokenFromCookies();
                    self.sAlienCrypto.loadMasterKeyFromCookies();
                    if (this.sUserSession.token) {
                        this.sApiClient.authorizeWithToken(this.sUserSession.token, function (success) {
                            if (success) {
                            }
                            else {
                                this.sUserSession.logOut();
                            }
                        });
                    }
                };
                __decorate([
                    core_1.ViewChild('recaptchaBlock'), 
                    __metadata('design:type', recaptcha_overlay_component_1.ReCaptchaBlockComponent)
                ], AppComponent.prototype, "recaptchaBlock", void 0);
                AppComponent = __decorate([
                    core_1.Component({
                        selector: 'app',
                        templateUrl: './app/app.component.html',
                        styleUrls: ['./app/app.component.css'],
                        providers: [
                            session_service_1.UserSession,
                            api_client_service_1.ApiClient,
                            window_mgr_service_1.WindowManager,
                            alien_crypto_service_1.AlienCrypto,
                            cookie_manager_service_1.CookieManager,
                            notification_listener_service_1.NotificationListener,
                            keyring_patcher_service_1.KeyringPatcher
                        ]
                    }),
                    __param(0, core_1.Inject(cookie_manager_service_1.CookieManager)),
                    __param(1, core_1.Inject(alien_crypto_service_1.AlienCrypto)),
                    __param(2, core_1.Inject(session_service_1.UserSession)),
                    __param(3, core_1.Inject(api_client_service_1.ApiClient)),
                    __param(4, core_1.Inject(window_mgr_service_1.WindowManager)),
                    __param(5, core_1.Inject(notification_listener_service_1.NotificationListener)), 
                    __metadata('design:paramtypes', [cookie_manager_service_1.CookieManager, alien_crypto_service_1.AlienCrypto, session_service_1.UserSession, api_client_service_1.ApiClient, window_mgr_service_1.WindowManager, notification_listener_service_1.NotificationListener])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map
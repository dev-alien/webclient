System.register(["@angular/core", "./session.service", "./window_mgr.service", "./api_client.service", "./alien_crypto.service", "./models/user.model"], function(exports_1, context_1) {
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
    var core_1, session_service_1, window_mgr_service_1, api_client_service_1, alien_crypto_service_1, user_model_1;
    var UserInfoLink;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
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
            function (user_model_1_1) {
                user_model_1 = user_model_1_1;
            }],
        execute: function() {
            UserInfoLink = (function () {
                function UserInfoLink(sSessionManager, sWindowManager, sApiClient, sAlienCrypto) {
                    this.sSessionManager = sSessionManager;
                    this.sWindowManager = sWindowManager;
                    this.sApiClient = sApiClient;
                    this.sAlienCrypto = sAlienCrypto;
                }
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', user_model_1.User)
                ], UserInfoLink.prototype, "user", void 0);
                UserInfoLink = __decorate([
                    core_1.Component({
                        selector: 'user_info_link',
                        templateUrl: './app/user_info_link.component.html',
                        styleUrls: ['./app/user_info_link.component.css']
                    }), 
                    __metadata('design:paramtypes', [session_service_1.UserSession, window_mgr_service_1.WindowManager, api_client_service_1.ApiClient, alien_crypto_service_1.AlienCrypto])
                ], UserInfoLink);
                return UserInfoLink;
            }());
            exports_1("UserInfoLink", UserInfoLink);
        }
    }
});
//# sourceMappingURL=user_info_link.component.js.map
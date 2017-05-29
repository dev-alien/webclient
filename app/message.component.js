System.register(["@angular/core", "./session.service", "./window_mgr.service", "./api_client.service", "./alien_crypto.service", "./models/message.model"], function(exports_1, context_1) {
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
    var core_1, session_service_1, window_mgr_service_1, api_client_service_1, alien_crypto_service_1, message_model_1;
    var MessageComponent;
    function isScrolledIntoView(elem) {
        var docViewTop = jQuery(window).scrollTop();
        var docViewBottom = docViewTop + jQuery(window).height();
        var elemTop = jQuery(elem).offset().top;
        var elemBottom = elemTop + jQuery(elem).height();
        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }
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
            function (message_model_1_1) {
                message_model_1 = message_model_1_1;
            }],
        execute: function() {
            MessageComponent = (function () {
                function MessageComponent(sSessionManager, sWindowManager, sApiClient, sAlienCrypto) {
                    this.sSessionManager = sSessionManager;
                    this.sWindowManager = sWindowManager;
                    this.sApiClient = sApiClient;
                    this.sAlienCrypto = sAlienCrypto;
                }
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', message_model_1.Message)
                ], MessageComponent.prototype, "message", void 0);
                MessageComponent = __decorate([
                    core_1.Component({
                        selector: 'message`',
                        templateUrl: './app/message.component.html',
                        styleUrls: ['./app/message.component.css']
                    }), 
                    __metadata('design:paramtypes', [session_service_1.UserSession, window_mgr_service_1.WindowManager, api_client_service_1.ApiClient, alien_crypto_service_1.AlienCrypto])
                ], MessageComponent);
                return MessageComponent;
            }());
            exports_1("MessageComponent", MessageComponent);
        }
    }
});
//# sourceMappingURL=message.component.js.map
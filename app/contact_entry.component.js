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
    var ContactEntryComponent;
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
            ContactEntryComponent = (function () {
                function ContactEntryComponent(sSessionManager, sWindowManager, sApiClient, sAlienCrypto) {
                    this.sSessionManager = sSessionManager;
                    this.sWindowManager = sWindowManager;
                    this.sApiClient = sApiClient;
                    this.sAlienCrypto = sAlienCrypto;
                    this.onContactDeleted = new core_1.EventEmitter();
                }
                ContactEntryComponent.prototype.deleteContact = function (user) {
                    this.onContactDeleted.emit(this.contact);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', user_model_1.User)
                ], ContactEntryComponent.prototype, "contact", void 0);
                __decorate([
                    core_1.Output(), 
                    __metadata('design:type', core_1.EventEmitter)
                ], ContactEntryComponent.prototype, "onContactDeleted", void 0);
                ContactEntryComponent = __decorate([
                    core_1.Component({
                        selector: 'app-contact-entry',
                        template: "\n        <div class=\"contacts_entry\">\n            <div class=\"remove_icon\" (click)=\"deleteContact(entry)\"></div>\n            <div class=\"contacts_icon\">\n                <div class=\"online_status green\">\n                </div>\n            </div>\n            <div class=\"contacts_content\">\n                <div class=\"contact_name\">\n                        <span class=\"contact_first_name\" *ngIf=\"contact.info.first_name\" >\n                            {{ contact.info.first_name }}\n                        </span>\n                    <span class=\"contact_last_names\" *ngIf=\"contact.info.first_name\" >\n                            {{ contact.info.last_name }}\n                        </span>\n                    @{{ contact.login }}\n                </div>\n                <div class=\"last_\">\n\n                </div>\n            </div>\n        </div>\n    ",
                        styles: ["\n        .contacts_icon {\n            position: absolute;\n            margin-left: 5px;\n            width: 32px;\n            height: 32px;\n            border: 2px solid black;\n        }\n\n        .contact_name {\n            padding-top: 9px;\n            padding-left: 50px;\n            font-weight: bold;\n        }\n\n        .contacts_entry {\n            background-color: white;\n            margin-top: 5px;\n            width: 300px;\n            height: 40px;\n            padding-top: 5px;\n        }\n\n        .contacts_entry:hover {\n            background-color: lightgrey;\n        }\n    "]
                    }), 
                    __metadata('design:paramtypes', [session_service_1.UserSession, window_mgr_service_1.WindowManager, api_client_service_1.ApiClient, alien_crypto_service_1.AlienCrypto])
                ], ContactEntryComponent);
                return ContactEntryComponent;
            }());
            exports_1("ContactEntryComponent", ContactEntryComponent);
        }
    }
});
//# sourceMappingURL=contact_entry.component.js.map
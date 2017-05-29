System.register(["@angular/core", "./session.service", "./window_mgr.service", "./api_client.service", "./alien_crypto.service"], function(exports_1, context_1) {
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
    var core_1, session_service_1, window_mgr_service_1, api_client_service_1, alien_crypto_service_1, core_2;
    var AddContactComponent;
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
            }],
        execute: function() {
            AddContactComponent = (function () {
                function AddContactComponent(sSessionManager, sWindowManager, sApiClient, sAlienCrypto) {
                    this.sSessionManager = sSessionManager;
                    this.sWindowManager = sWindowManager;
                    this.sApiClient = sApiClient;
                    this.sAlienCrypto = sAlienCrypto;
                    this.isOpen = false;
                    this.requestStarted = false;
                    this.showStatus = false;
                    this.status = "";
                    this.id = "";
                    var self = this;
                    sWindowManager.subscribeOnGlobalEvent("openAddContact", function (data) {
                        self.isOpen = true;
                        draggable_window.showIt(self.mainBlock.nativeElement);
                        var elWidth = parseInt(window.getComputedStyle(self.mainBlock.nativeElement).width, 10);
                        var elHeight = 200;
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
                AddContactComponent.prototype.createRequest = function () {
                    var self = this;
                    this.showStatus = true;
                    this.requestStarted = true;
                    this.status = "Waiting for a backend response...";
                    this.sApiClient.createContactRequest(this.id, function (error_code) {
                        switch (error_code) {
                            case 200:
                                self.status = "The request has been sent";
                                break;
                            case 414:
                                self.status = "This request already exists";
                                break;
                            case 417:
                                self.status = "The contact does not exists or already is in your contact list";
                                break;
                            case 460:
                                self.status = "The CAPTCHA hasn't been entered";
                                break;
                            default:
                                self.status = "Unknown error, please contact the administration";
                                break;
                        }
                        self.requestStarted = false;
                    });
                };
                ;
                AddContactComponent.prototype.onInit = function () {
                };
                __decorate([
                    core_2.ViewChild('self'), 
                    __metadata('design:type', core_1.ElementRef)
                ], AddContactComponent.prototype, "mainBlock", void 0);
                AddContactComponent = __decorate([
                    core_1.Component({
                        selector: 'contact-add',
                        templateUrl: './app/contact_add.component.html',
                        styleUrls: ['./app/contact_add.component.css']
                    }), 
                    __metadata('design:paramtypes', [session_service_1.UserSession, window_mgr_service_1.WindowManager, api_client_service_1.ApiClient, alien_crypto_service_1.AlienCrypto])
                ], AddContactComponent);
                return AddContactComponent;
            }());
            exports_1("AddContactComponent", AddContactComponent);
        }
    }
});
//# sourceMappingURL=contact_add.component.js.map
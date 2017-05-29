System.register(["@angular/core", "./session.service", "./window_mgr.service", "./api_client.service", "./alien_crypto.service", "./models/create_conversation_body.model", "./models/user_key_pair.model"], function(exports_1, context_1) {
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
    var core_1, session_service_1, window_mgr_service_1, api_client_service_1, alien_crypto_service_1, core_2, create_conversation_body_model_1, user_key_pair_model_1;
    var CreateConversationComponent;
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
            function (create_conversation_body_model_1_1) {
                create_conversation_body_model_1 = create_conversation_body_model_1_1;
            },
            function (user_key_pair_model_1_1) {
                user_key_pair_model_1 = user_key_pair_model_1_1;
            }],
        execute: function() {
            CreateConversationComponent = (function () {
                function CreateConversationComponent(sSessionManager, sWindowManager, sApiClient, sAlienCrypto) {
                    this.sSessionManager = sSessionManager;
                    this.sWindowManager = sWindowManager;
                    this.sApiClient = sApiClient;
                    this.sAlienCrypto = sAlienCrypto;
                    this.isOpen = false;
                    this.requestStarted = false;
                    this.showStatus = false;
                    this.status = "";
                    this.name = "";
                    this.participants = [];
                    var self = this;
                    sWindowManager.subscribeOnGlobalEvent("openCreateConversation", function (data) {
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
                CreateConversationComponent.prototype.createRequest = function () {
                    if (this.participants.length == 0)
                        return;
                    var self = this;
                    this.showStatus = true;
                    this.requestStarted = true;
                    var requestBody = new create_conversation_body_model_1.CreateConversationBody();
                    var key = this.sAlienCrypto.genereteAesKey();
                    var myUserKeyPair = new user_key_pair_model_1.UserKeyPair();
                    myUserKeyPair.user = this.sSessionManager.profile;
                    myUserKeyPair.key = self.sAlienCrypto.encryptWithPublicKey(myUserKeyPair.user.public_key, key);
                    requestBody.name = this.name;
                    requestBody.participants = this.participants.map(function (participant) {
                        var userKeyPair = new user_key_pair_model_1.UserKeyPair();
                        userKeyPair.user = participant;
                        userKeyPair.key = self.sAlienCrypto.encryptWithPublicKey(participant.public_key, key);
                        return userKeyPair;
                    });
                    requestBody.participants.unshift(myUserKeyPair);
                    this.status = "Waiting for a backend response...";
                    this.sApiClient.createConversation(requestBody, function (error_code) {
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
                CreateConversationComponent.prototype.onInit = function () {
                };
                __decorate([
                    core_2.ViewChild('self'), 
                    __metadata('design:type', core_1.ElementRef)
                ], CreateConversationComponent.prototype, "mainBlock", void 0);
                CreateConversationComponent = __decorate([
                    core_1.Component({
                        selector: 'create-conversation',
                        templateUrl: './app/create_conversation.component.html',
                        styleUrls: ['./app/create_conversation.component.css']
                    }), 
                    __metadata('design:paramtypes', [session_service_1.UserSession, window_mgr_service_1.WindowManager, api_client_service_1.ApiClient, alien_crypto_service_1.AlienCrypto])
                ], CreateConversationComponent);
                return CreateConversationComponent;
            }());
            exports_1("CreateConversationComponent", CreateConversationComponent);
        }
    }
});
//# sourceMappingURL=create_conversation.component.js.map
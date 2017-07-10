System.register(["@angular/core", "./session.service", "./window_mgr.service", "./api_client.service", "./alien_crypto.service", "./models/conversation.model"], function(exports_1, context_1) {
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
    var core_1, session_service_1, window_mgr_service_1, api_client_service_1, alien_crypto_service_1, core_2, conversation_model_1;
    var ConversationComponent;
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
            function (conversation_model_1_1) {
                conversation_model_1 = conversation_model_1_1;
            }],
        execute: function() {
            ConversationComponent = (function () {
                function ConversationComponent(sSessionManager, sWindowManager, sApiClient, sAlienCrypto) {
                    this.sSessionManager = sSessionManager;
                    this.sWindowManager = sWindowManager;
                    this.sApiClient = sApiClient;
                    this.sAlienCrypto = sAlienCrypto;
                    this.isShown = false;
                    this.requestStarted = false;
                    this.showStatus = false;
                    this.status = "";
                    this.id = "";
                    this.fetchStatus = "";
                    this.messages = [];
                    this.showParticipants = false;
                    this.participantsHovered = false;
                    this.noMoreMessagesAvailable = false;
                    this.fetchStarted = false;
                    this.conversationWasEmpty = false;
                    this.previousHeight = -1;
                    this.previousScrollTop = -1;
                    var self = this;
                    setImmediate(function () {
                        self.autoFetch();
                        jQuery(self.messageContainer.nativeElement).perfectScrollbar();
                        self.isShown = true;
                        draggable_window.showIt(self.mainBlock.nativeElement);
                        var elWidth = parseInt(window.getComputedStyle(self.mainBlock.nativeElement).width, 10);
                        var elHeight = 400;
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
                ConversationComponent.prototype.keydown = function (event) {
                    if (event.key === "Enter") {
                        this.sendMessage();
                        return false;
                    }
                };
                ConversationComponent.prototype.fetchMore = function () {
                    var self = this;
                    if (this.conversationWasEmpty)
                        return;
                    if (this.noMoreMessagesAvailable) {
                        self.fetchStatus = "No more messages available";
                        return;
                    }
                    if (this.fetchStarted) {
                        return;
                    }
                    var lastMessageId = this.conversation.lastMessageId();
                    if (lastMessageId === -1) {
                        this.conversationWasEmpty = true;
                        self.fetchStatus = "";
                        return;
                    }
                    this.fetchStarted = true;
                    self.fetchStatus = "Fetching more messages...";
                    this.sApiClient.getMessages(lastMessageId - 1, 20, this.conversation, function (errorCode, messages) {
                        if (errorCode === 200) {
                            self.fetchStarted = false;
                            if (messages.length === 0)
                                return self.noMoreMessagesAvailable = true;
                            self.fetchStatus = "";
                            self.conversation.insertMessages(messages);
                        }
                        else
                            return self.fetchStatus = "Unable to fetch more messages, click to retry";
                    });
                };
                ConversationComponent.prototype.autoFetch = function () {
                    var isVisible = isScrolledIntoView(this.autoFetchIndicator.nativeElement);
                    if (isVisible)
                        this.fetchMore();
                    var self = this;
                    if (this.conversation.isOpen) {
                        setTimeout(function () { return self.autoFetch(); }, 500);
                    }
                };
                ConversationComponent.prototype.sendMessage = function () {
                    var messageBlockContent = this.messageBox.nativeElement.innerHTML;
                    var requestBody = {
                        message: this.sAlienCrypto.encryptMessage(this.conversation.extConvId.id(), messageBlockContent)
                    };
                    if (!requestBody.message) {
                        alert('Unable to find conversation key');
                        return;
                    }
                    console.error(requestBody);
                    this.sApiClient.sendMessage(requestBody, this.conversation, function (errorCode) {
                        //Todo: resend message
                    });
                    this.messageBox.nativeElement.innerHTML = "";
                };
                ;
                ConversationComponent.prototype.ngAfterViewChecked = function () {
                    console.log(this.conversation.messages);
                    var messageContainer = this.messageContainer.nativeElement;
                    if (this.previousHeight === -1) {
                        this.previousHeight = messageContainer.scrollHeight;
                        this.previousScrollTop = messageContainer.scrollTop;
                        return;
                    }
                    var currentHeight = messageContainer.scrollHeight;
                    if (currentHeight != this.previousHeight) {
                        var diff = currentHeight - this.previousHeight;
                        messageContainer.scrollTop = this.previousScrollTop + diff;
                        jQuery(this.messageContainer.nativeElement).perfectScrollbar('update');
                    }
                    this.previousScrollTop = messageContainer.scrollTop;
                    this.previousHeight = currentHeight;
                };
                ConversationComponent.prototype.onInit = function () {
                };
                __decorate([
                    core_2.ViewChild('selfcb'), 
                    __metadata('design:type', core_1.ElementRef)
                ], ConversationComponent.prototype, "mainBlock", void 0);
                __decorate([
                    core_2.ViewChild('message_box'), 
                    __metadata('design:type', core_1.ElementRef)
                ], ConversationComponent.prototype, "messageBox", void 0);
                __decorate([
                    core_2.ViewChild('auto_fetch'), 
                    __metadata('design:type', core_1.ElementRef)
                ], ConversationComponent.prototype, "autoFetchIndicator", void 0);
                __decorate([
                    core_2.ViewChild('messages_container'), 
                    __metadata('design:type', core_1.ElementRef)
                ], ConversationComponent.prototype, "messageContainer", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', conversation_model_1.Conversation)
                ], ConversationComponent.prototype, "conversation", void 0);
                ConversationComponent = __decorate([
                    core_1.Component({
                        selector: 'conversation',
                        templateUrl: './app/conversation.component.html',
                        styleUrls: ['./app/conversation.component.css']
                    }), 
                    __metadata('design:paramtypes', [session_service_1.UserSession, window_mgr_service_1.WindowManager, api_client_service_1.ApiClient, alien_crypto_service_1.AlienCrypto])
                ], ConversationComponent);
                return ConversationComponent;
            }());
            exports_1("ConversationComponent", ConversationComponent);
        }
    }
});
//# sourceMappingURL=conversation.component.js.map
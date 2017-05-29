System.register(["@angular/core", "./session.service", "./window_mgr.service", "./api_client.service", "./alien_crypto.service", "./status_window.component", "./recaptcha_overlay.component", "./contact_add.component"], function(exports_1, context_1) {
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
    var core_1, session_service_1, window_mgr_service_1, api_client_service_1, alien_crypto_service_1, core_2, status_window_component_1, recaptcha_overlay_component_1, contact_add_component_1;
    var ContactsComponent;
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
            },
            function (contact_add_component_1_1) {
                contact_add_component_1 = contact_add_component_1_1;
            }],
        execute: function() {
            ContactsComponent = (function () {
                function ContactsComponent(sSessionManager, sWindowManager, sApiClient, sAlienCrypto) {
                    this.sSessionManager = sSessionManager;
                    this.sWindowManager = sWindowManager;
                    this.sApiClient = sApiClient;
                    this.sAlienCrypto = sAlienCrypto;
                    this.contacts = {};
                    this.incomingRequests = {};
                    this.outgoingRequests = {};
                    this.activetab = 1;
                    this.mSignInStarted = false;
                    this.isOpen = false;
                    this.storeSessiong = false;
                    var self = this;
                    sSessionManager.contactsUpdated.subscribe(function () {
                        self.contacts = self.sSessionManager.contacts;
                    });
                    sSessionManager.incomingRequestsUpdated.subscribe(function () {
                        self.incomingRequests = self.sSessionManager.incomingRequests;
                    });
                    sSessionManager.outgoingRequestsUpdated.subscribe(function () {
                        self.outgoingRequests = self.sSessionManager.outgoingRequests;
                    });
                    sWindowManager.subscribeOnGlobalEvent("openContacts", function (data) {
                        self.isOpen = true;
                        jQuery('#contacts_container').perfectScrollbar();
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
                ContactsComponent.prototype.ngOnInit = function () {
                    document.getElementById("defaultOpen").click();
                };
                ContactsComponent.prototype.openTab = function (evt, cityName, el) {
                    this.activetab = el;
                    // Declare all variables
                    var i, tabcontent, tablinks;
                    // Get all elements with class="tabcontent" and hide them
                    tabcontent = document.getElementsByClassName("tabcontent");
                    for (i = 0; i < tabcontent.length; i++) {
                        tabcontent[i].style.display = "none";
                    }
                    // Get all elements with class="tablinks" and remove the class "active"
                    tablinks = document.getElementsByClassName("tablinks");
                    for (i = 0; i < tablinks.length; i++) {
                        tablinks[i].className = tablinks[i].className.replace(" active", "");
                    }
                    // Show the current tab, and add an "active" class to the link that opened the tab
                    document.getElementById(cityName).style.display = "block";
                    //evt.currentTarget.className += " active";
                };
                ContactsComponent.prototype.deleteContact = function (contact) {
                    this.sApiClient.deleteContact(contact.key);
                };
                ContactsComponent.prototype.deleteRequest = function (user, isIncoming) {
                    this.sApiClient.deleteRequest(user.key, isIncoming);
                };
                ContactsComponent.prototype.acceptRequest = function (user) {
                    this.sApiClient.acceptRequest(user.key);
                };
                ContactsComponent.prototype.openAddContact = function () {
                    this.sWindowManager.emitGlobalEvent("openAddContact");
                };
                __decorate([
                    core_2.ViewChild('mainBlock'), 
                    __metadata('design:type', core_1.ElementRef)
                ], ContactsComponent.prototype, "mainBlock", void 0);
                __decorate([
                    core_2.ViewChild('contactsContainer'), 
                    __metadata('design:type', core_1.ElementRef)
                ], ContactsComponent.prototype, "contactsContainer", void 0);
                __decorate([
                    core_2.ViewChild('statusWindow'), 
                    __metadata('design:type', status_window_component_1.StatusWindowComponent)
                ], ContactsComponent.prototype, "statusWindow", void 0);
                __decorate([
                    core_2.ViewChild('recaptchaBlock'), 
                    __metadata('design:type', recaptcha_overlay_component_1.ReCaptchaBlockComponent)
                ], ContactsComponent.prototype, "mRecaptchaBlock", void 0);
                __decorate([
                    core_2.ViewChild('contactAdd'), 
                    __metadata('design:type', contact_add_component_1.AddContactComponent)
                ], ContactsComponent.prototype, "contactAdd", void 0);
                ContactsComponent = __decorate([
                    core_1.Component({
                        selector: 'contacts',
                        templateUrl: './app/contacts.component.html',
                        styleUrls: ['./app/contacts.component.css']
                    }), 
                    __metadata('design:paramtypes', [session_service_1.UserSession, window_mgr_service_1.WindowManager, api_client_service_1.ApiClient, alien_crypto_service_1.AlienCrypto])
                ], ContactsComponent);
                return ContactsComponent;
            }());
            exports_1("ContactsComponent", ContactsComponent);
        }
    }
});
//# sourceMappingURL=contacts.component.js.map
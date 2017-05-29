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
    var UsersSelectionBox;
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
            UsersSelectionBox = (function () {
                function UsersSelectionBox(sSessionManager, sWindowManager, sApiClient, sAlienCrypto) {
                    this.sSessionManager = sSessionManager;
                    this.sWindowManager = sWindowManager;
                    this.sApiClient = sApiClient;
                    this.sAlienCrypto = sAlienCrypto;
                    var self = this;
                    setTimeout(function () {
                        jQuery(self.usersContainer.nativeElement).perfectScrollbar();
                    }, 0);
                }
                UsersSelectionBox.prototype.isSelected = function (user) {
                    return !!this.result.filter(function (item) { return item === user; })[0];
                };
                UsersSelectionBox.prototype.select = function (user) {
                    if (!this.isSelected(user)) {
                        this.result.push(user);
                    }
                    else {
                        this.result = this.result.filter(function (item) { return item != user; });
                    }
                };
                __decorate([
                    core_2.ViewChild('users_container'), 
                    __metadata('design:type', core_1.ElementRef)
                ], UsersSelectionBox.prototype, "usersContainer", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], UsersSelectionBox.prototype, "users", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], UsersSelectionBox.prototype, "result", void 0);
                UsersSelectionBox = __decorate([
                    core_1.Component({
                        selector: 'users_selection_box',
                        templateUrl: './app/users_selection_box.component.html',
                        styleUrls: ['./app/users_selection_box.component.css']
                    }), 
                    __metadata('design:paramtypes', [session_service_1.UserSession, window_mgr_service_1.WindowManager, api_client_service_1.ApiClient, alien_crypto_service_1.AlienCrypto])
                ], UsersSelectionBox);
                return UsersSelectionBox;
            }());
            exports_1("UsersSelectionBox", UsersSelectionBox);
        }
    }
});
//# sourceMappingURL=users_selection_box.component.js.map
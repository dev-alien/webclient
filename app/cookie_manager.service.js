System.register(["@angular/core"], function(exports_1, context_1) {
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
    var core_1;
    var CookieManager;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            CookieManager = (function () {
                function CookieManager() {
                }
                CookieManager.prototype.getCookie = function (name) {
                    name += '=';
                    var ca = document.cookie.split(';');
                    var res = '';
                    ca.forEach(function (cookieString) {
                        cookieString = cookieString.trim();
                        var cName = cookieString.substr(0, name.length);
                        if (cName === name)
                            res = cookieString.substr(name.length);
                    });
                    return res;
                };
                CookieManager.prototype.deleteCookie = function (name) {
                    this.setCookie(name, "", -1);
                };
                CookieManager.prototype.setCookie = function (name, value, expireDays, path) {
                    if (path === void 0) { path = ""; }
                    var d = new Date();
                    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
                    var expires = "expires=" + d.toUTCString();
                    document.cookie = name + "=" + value + "; " + expires + (path.length > 0 ? "; path=" + path : "");
                };
                CookieManager = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], CookieManager);
                return CookieManager;
            }());
            exports_1("CookieManager", CookieManager);
        }
    }
});
//# sourceMappingURL=cookie_manager.service.js.map
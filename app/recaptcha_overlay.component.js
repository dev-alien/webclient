System.register(["@angular/core", "ng2-google-recaptcha/create-recaptcha/create-recaptcha.component"], function(exports_1, context_1) {
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
    var core_1, create_recaptcha_component_1;
    var ReCaptchaBlockComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (create_recaptcha_component_1_1) {
                create_recaptcha_component_1 = create_recaptcha_component_1_1;
            }],
        execute: function() {
            ReCaptchaBlockComponent = (function () {
                function ReCaptchaBlockComponent() {
                    this.recaptchaSiteKey = '6LcfbxIUAAAAACflvtkMZbXsiTYzwBB1BwA6E66L';
                    this.isShown = false;
                }
                ReCaptchaBlockComponent.prototype.show = function (callback) {
                    this.mCallback = callback;
                    this.isShown = true;
                };
                ReCaptchaBlockComponent.prototype.onCaptchaComplete = function (result) {
                    if (!result.token) {
                        this.mCallback(true, "");
                        this.isShown = false;
                    }
                    var self = this;
                    this.recaptchaInstance.resetRecaptcha();
                    setTimeout(function () {
                        self.isShown = false;
                        self.mCallback(false, result.token);
                    }, 500);
                };
                ReCaptchaBlockComponent.prototype.onCaptchaCancelled = function () {
                    this.mCallback(true, "");
                    this.isShown = false;
                };
                __decorate([
                    core_1.ViewChild(create_recaptcha_component_1.CreateRecaptchaComponent), 
                    __metadata('design:type', create_recaptcha_component_1.CreateRecaptchaComponent)
                ], ReCaptchaBlockComponent.prototype, "recaptchaInstance", void 0);
                ReCaptchaBlockComponent = __decorate([
                    core_1.Component({
                        selector: 'recaptcha-block',
                        templateUrl: './app/recaptcha_overlay.component.html',
                        styleUrls: ['./app/recaptcha-overlay.component.css']
                    }), 
                    __metadata('design:paramtypes', [])
                ], ReCaptchaBlockComponent);
                return ReCaptchaBlockComponent;
            }());
            exports_1("ReCaptchaBlockComponent", ReCaptchaBlockComponent);
        }
    }
});
//# sourceMappingURL=recaptcha_overlay.component.js.map
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
    var core_1, core_2;
    var StatusWindowComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
            }],
        execute: function() {
            StatusWindowComponent = (function () {
                function StatusWindowComponent() {
                    this.isShown = false;
                    this.status = "";
                    this.caption = "";
                }
                StatusWindowComponent.prototype.setPosition = function (x, y) {
                    this.mainBlock.nativeElement.style.left = x + 'px';
                    this.mainBlock.nativeElement.style.top = y + 'px';
                };
                StatusWindowComponent.prototype.setCaption = function (caption) {
                    this.caption = caption;
                };
                StatusWindowComponent.prototype.setStatus = function (status) {
                    this.status = status;
                };
                StatusWindowComponent.prototype.show = function () {
                    this.isShown = true;
                    draggable_window.showIt(this.mainBlock.nativeElement);
                    var elWidth = parseInt(window.getComputedStyle(this.mainBlock.nativeElement).width, 10);
                    var elHeight = 100;
                    var docWidth = document.documentElement.clientWidth;
                    var docHeight = window.innerHeight;
                    var x = (docWidth / 2 - elWidth / 2);
                    var y = (docHeight / 2 - elHeight / 2);
                    this.mainBlock.nativeElement.style.left =
                        x + "px";
                    this.mainBlock.nativeElement.style.top =
                        y + "px";
                };
                StatusWindowComponent.prototype.close = function () {
                    this.isShown = false;
                };
                __decorate([
                    core_2.ViewChild('mainBlock'), 
                    __metadata('design:type', core_2.ElementRef)
                ], StatusWindowComponent.prototype, "mainBlock", void 0);
                StatusWindowComponent = __decorate([
                    core_1.Component({
                        selector: 'status-window',
                        templateUrl: './app/status_window.component.html',
                        styleUrls: ['./app/status_window.component.css']
                    }), 
                    __metadata('design:paramtypes', [])
                ], StatusWindowComponent);
                return StatusWindowComponent;
            }());
            exports_1("StatusWindowComponent", StatusWindowComponent);
        }
    }
});
//# sourceMappingURL=status_window.component.js.map
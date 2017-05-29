import {Input, Component, OnInit, ViewChild} from "@angular/core";
import {CreateRecaptchaComponent} from "ng2-google-recaptcha/create-recaptcha/create-recaptcha.component";

type ReCaptchaCallback = (success: boolean, token: string) => void;

@Component({
    selector: 'recaptcha-block',
    templateUrl: './app/recaptcha_overlay.component.html',
    styleUrls: ['./app/recaptcha-overlay.component.css']
})
export class ReCaptchaBlockComponent {
    @ViewChild(CreateRecaptchaComponent)
    private recaptchaInstance: CreateRecaptchaComponent;

    private mCallback: ReCaptchaCallback;
    private recaptchaSiteKey = '6LcfbxIUAAAAACflvtkMZbXsiTYzwBB1BwA6E66L';
    private isShown: boolean = false;

    public show(callback: ReCaptchaCallback): void {
        this.mCallback = callback;
        this.isShown = true;
    }

    private onCaptchaComplete(result: any) {
        if(!result.token) {
            this.mCallback(true, "");
            this.isShown = false;
        }
        var self = this;
        this.recaptchaInstance.resetRecaptcha();
        setTimeout(function () {
            self.isShown = false;
            self.mCallback(false, result.token)
        }, 500);
    }

    private onCaptchaCancelled() {
        this.mCallback(true, "");
        this.isShown = false;
    }

    constructor() {

    }
}
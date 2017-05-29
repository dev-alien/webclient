import {Component, OnInit, ElementRef} from "@angular/core";
import {UserSession} from "./session.service";
import {WindowManager} from "./window_mgr.service";
import {ApiClient} from "./api_client.service";
import {AlienCrypto, RsaKeyPair} from "./alien_crypto.service";
import {ViewChild} from "@angular/core";
import {ReCaptchaBlockComponent} from "./recaptcha_overlay.component";
import {RegistrationRequestBody} from "./models/registration_request_body.model";
import {Response} from "@angular/http";
import {Keyring} from "./models/keyring.model";
import {HashInfo} from "./models/hash_info.model";
import {PublicKey} from "./models/public_key.model";
import {StatusWindowComponent} from "./status_window.component";

declare var draggable_window: any;

@Component({
    selector: 'contact-add',
    templateUrl: './app/contact_add.component.html',
    styleUrls: ['./app/contact_add.component.css']
})
export class AddContactComponent {
    @ViewChild('self') mainBlock: ElementRef;

    private isOpen: boolean = false;
    private requestStarted: boolean = false;
    private showStatus: boolean = false;
    private status: string = "";
    private id: string = "";

    constructor(private sSessionManager: UserSession,
                private sWindowManager: WindowManager,
                private sApiClient: ApiClient,
                private sAlienCrypto: AlienCrypto) {
        var self = this;
        sWindowManager.subscribeOnGlobalEvent("openAddContact", function (data: any) {
            self.isOpen = true;
            draggable_window.showIt(self.mainBlock.nativeElement);
            var elWidth = parseInt(window.getComputedStyle(self.mainBlock.nativeElement).width, 10);
            var elHeight = 200;

            var docWidth = document.documentElement.clientWidth;
            var docHeight = window.innerHeight;
            var x = (docWidth/2 - elWidth/2);
            var y = (docHeight/2 - elHeight/2);

            self.mainBlock.nativeElement.style.left =
                x+"px";
            self.mainBlock.nativeElement.style.top =
                y+"px";
        });
    }

    private createRequest(): void {
        var self = this;
        this.showStatus = true;
        this.requestStarted = true;
        this.status = "Waiting for a backend response...";
        this.sApiClient.createContactRequest(this.id, function (error_code: number) {
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

    onInit() {
    }
}
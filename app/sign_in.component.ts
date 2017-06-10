import {Component, OnInit, ElementRef} from "@angular/core";
import {UserSession} from "./session.service";
import {WindowManager} from "./window_mgr.service";
import {ApiClient} from "./api_client.service";
import {AlienCrypto, RsaKeyPair} from "./alien_crypto.service";
import {ViewChild} from "@angular/core";
import {StatusWindowComponent} from "./status_window.component";
import {ReCaptchaBlockComponent} from "./recaptcha_overlay.component";

declare var draggable_window: any;

@Component({
    selector: 'sign-in',
    templateUrl: './app/sign_in.component.html',
    styleUrls: ['./app/sign_in.component.css']
})
export class SignInComponent {
    @ViewChild('mainBlock') mainBlock: ElementRef;
    @ViewChild('statusWindow') statusWindow: StatusWindowComponent;
    @ViewChild('recaptchaBlock') mRecaptchaBlock: ReCaptchaBlockComponent;
    private mSignInStarted: boolean = false;
    private login: string;
    private password: string;
    private isOpen: boolean = false;
    private storeSessiong: boolean = false;
    constructor(private sSessionManager: UserSession,
                private sWindowManager: WindowManager,
                private sApiClient: ApiClient,
                private sAlienCrypto: AlienCrypto) {
        var self = this;
        sWindowManager.subscribeOnGlobalEvent("signInOpen", function (data: any) {
            self.isOpen = true;
            draggable_window.showIt(self.mainBlock.nativeElement);
            var elWidth = parseInt(window.getComputedStyle(self.mainBlock.nativeElement).width, 10);
            var elHeight = 240;

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

    private onSubmit(ev: any) {
        ev.preventDefault();
        this.performSignIn();
    }

    private performSignIn(): void {
        var self = this;

        this.statusWindow.show();
        this.statusWindow.setCaption("Signing in...");

        this.sApiClient.authorizeWithoutToken(this.login, this.password,
            function (finished: boolean, status: string) {
                if(finished) {
                    setTimeout(function () {
                        self.isOpen = false;
                        self.statusWindow.close();
                    }, 1000);
                }
                self.statusWindow.setStatus(status);
            }, this.mRecaptchaBlock);
    }
}
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
import {User} from "./models/user.model";
import {CreateConversationBody} from "./models/create_conversation_body.model";
import {UserKeyPair} from "./models/user_key_pair.model";

declare var draggable_window: any;

@Component({
    selector: 'create-conversation',
    templateUrl: './app/create_conversation.component.html',
    styleUrls: ['./app/create_conversation.component.css']
})
export class CreateConversationComponent {
    @ViewChild('self') mainBlock: ElementRef;

    private isOpen: boolean = false;
    private requestStarted: boolean = false;
    private showStatus: boolean = false;
    private status: string = "";
    private name: string = "";
    private participants: User[] = [];
    
    constructor(private sSessionManager: UserSession,
                private sWindowManager: WindowManager,
                private sApiClient: ApiClient,
                private sAlienCrypto: AlienCrypto) {
        var self = this;
        sWindowManager.subscribeOnGlobalEvent("openCreateConversation", function (data: any) {
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
        if(this.participants.length == 0)
            return;

        var self = this;
        this.showStatus = true;
        this.requestStarted = true;
        let requestBody: CreateConversationBody = new CreateConversationBody();

        let key = this.sAlienCrypto.genereteAesKey();

        let myUserKeyPair: UserKeyPair = new UserKeyPair();
        myUserKeyPair.user = this.sSessionManager.profile;
        myUserKeyPair.key = self.sAlienCrypto.encryptWithPublicKey(myUserKeyPair.user.public_key, key);

        requestBody.name = this.name;
        requestBody.participants = this.participants.map(function (participant: User) {
            let userKeyPair: UserKeyPair = new UserKeyPair();
            userKeyPair.user = participant;
            userKeyPair.key = self.sAlienCrypto.encryptWithPublicKey(participant.public_key, key);
            return userKeyPair;
        });

        requestBody.participants.unshift(myUserKeyPair);

        this.status = "Waiting for a backend response...";


        this.sApiClient.createConversation(requestBody, function (error_code: number) {
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
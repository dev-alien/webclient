import {Component, OnInit, ElementRef, Input, OnChanges, SimpleChange, AfterViewChecked} from "@angular/core";
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
import {Conversation} from "./models/conversation.model";
import {Message} from "./models/message.model";
import {User} from "./models/user.model";


@Component({
    selector: 'user_entry',
    template: `
        
    `,
    styles: [`
                
    `]
})
export class UserEntryComponent {
    @Input() user: User;
    constructor(private sSessionManager: UserSession,
                private sWindowManager: WindowManager,
                private sApiClient: ApiClient,
                private sAlienCrypto: AlienCrypto) {
    }
}
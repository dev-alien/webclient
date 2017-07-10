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

@Component({
    selector: 'conversation-participants',
    templateUrl: './app/conversation_participants.component.html',
    styleUrls: ['./app/conversation_participants.component.css']
})
export class ConversationParticipantsComponent {
    constructor(private sSessionManager: UserSession,
                private sWindowManager: WindowManager,
                private sApiClient: ApiClient,
                private sAlienCrypto: AlienCrypto) {
    }
}
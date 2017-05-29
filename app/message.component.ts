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

declare var draggable_window: any;
declare var jQuery:any;

function isScrolledIntoView(elem: any)
{
    var docViewTop: any = jQuery(window).scrollTop();
    var docViewBottom: any = docViewTop + jQuery(window).height();

    var elemTop: any = jQuery(elem).offset().top;
    var elemBottom: any = elemTop + jQuery(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

@Component({
    selector: 'message`',
    templateUrl: './app/message.component.html',
    styleUrls: ['./app/message.component.css']
})
export class MessageComponent {
    @Input() message: Message;
    constructor(private sSessionManager: UserSession,
                private sWindowManager: WindowManager,
                private sApiClient: ApiClient,
                private sAlienCrypto: AlienCrypto) {
    }
}
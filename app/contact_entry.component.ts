import {Component, OnInit, ElementRef, Input, OnChanges, SimpleChange, AfterViewChecked} from "@angular/core";
import {UserSession} from "./session.service";
import {WindowManager} from "./window_mgr.service";
import {ApiClient} from "./api_client.service";
import {AlienCrypto, RsaKeyPair} from "./alien_crypto.service";
import {User} from "./models/user.model";

declare var draggable_window: any;
declare var jQuery:any;

@Component({
    selector: 'app-contact-entry',
    template: `
        {{ contact.login }}
    `,
    styles: [`
            
    `]
})
export class ContactEntryComponent {
    @Input() contact: User;
    constructor(public sSessionManager: UserSession,
                public sWindowManager: WindowManager,
                public sApiClient: ApiClient,
                public sAlienCrypto: AlienCrypto) {
    }
}
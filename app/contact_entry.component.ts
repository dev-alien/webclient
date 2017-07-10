import {
    Component, OnInit, ElementRef, Input, OnChanges, SimpleChange, AfterViewChecked, Output,
    EventEmitter
} from "@angular/core";
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
        <div class="contacts_entry">
            <div class="remove_icon" (click)="deleteContact(entry)"></div>
            <div class="contacts_icon">
                <div class="online_status green">
                </div>
            </div>
            <div class="contacts_content">
                <div class="contact_name">
                        <span class="contact_first_name" *ngIf="contact.info.first_name" >
                            {{ contact.info.first_name }}
                        </span>
                    <span class="contact_last_names" *ngIf="contact.info.first_name" >
                            {{ contact.info.last_name }}
                        </span>
                    @{{ contact.login }}
                </div>
                <div class="last_">

                </div>
            </div>
        </div>
    `,
    styles: [`
        .contacts_icon {
            position: absolute;
            margin-left: 5px;
            width: 32px;
            height: 32px;
            border: 2px solid black;
        }

        .contact_name {
            padding-top: 9px;
            padding-left: 50px;
            font-weight: bold;
        }

        .contacts_entry {
            background-color: white;
            margin-top: 5px;
            width: 300px;
            height: 40px;
            padding-top: 5px;
        }

        .contacts_entry:hover {
            background-color: lightgrey;
        }
    `]
})
export class ContactEntryComponent {
    @Input() contact: User;
    @Output() onContactDeleted: EventEmitter<User> = new EventEmitter<User>();
    constructor(public sSessionManager: UserSession,
                public sWindowManager: WindowManager,
                public sApiClient: ApiClient,
                public sAlienCrypto: AlienCrypto) {
    }

    public deleteContact(user: User) {
        this.onContactDeleted.emit(this.contact);
    }
}
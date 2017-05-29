import {Component, OnInit, ElementRef, PipeTransform, Pipe} from "@angular/core";
import {UserSession} from "./session.service";
import {WindowManager} from "./window_mgr.service";
import {ApiClient} from "./api_client.service";
import {AlienCrypto, RsaKeyPair} from "./alien_crypto.service";
import {ViewChild} from "@angular/core";
import {StatusWindowComponent} from "./status_window.component";
import {ReCaptchaBlockComponent} from "./recaptcha_overlay.component";
import {User} from "./models/user.model";
import {AddContactComponent} from "./contact_add.component";

declare var draggable_window: any;
declare var jQuery:any;

@Component({
    selector: 'contacts',
    templateUrl: './app/contacts.component.html',
    styleUrls: ['./app/contacts.component.css']
})
export class ContactsComponent implements OnInit {
    ngOnInit(): void {
        document.getElementById("defaultOpen").click();
    }

    @ViewChild('mainBlock') mainBlock: ElementRef;
    @ViewChild('contactsContainer') contactsContainer: ElementRef;
    @ViewChild('statusWindow') statusWindow: StatusWindowComponent;
    @ViewChild('recaptchaBlock') mRecaptchaBlock: ReCaptchaBlockComponent;
    @ViewChild('contactAdd') contactAdd: AddContactComponent;

    contacts: { [key: string]: User } = {};
    incomingRequests: { [key: string]: User } = {};
    outgoingRequests: { [key: string]: User } = {};

    private activetab: number = 1;

    openTab(evt: any, cityName: any, el: any): void {
        this.activetab = el;
        // Declare all variables
        var i: number, tabcontent: any, tablinks: any;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the link that opened the tab
        document.getElementById(cityName).style.display = "block";
        //evt.currentTarget.className += " active";
    }

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

        sSessionManager.contactsUpdated.subscribe(function () {
            self.contacts = self.sSessionManager.contacts;
        });

        sSessionManager.incomingRequestsUpdated.subscribe(function () {
            self.incomingRequests = self.sSessionManager.incomingRequests;
        });

        sSessionManager.outgoingRequestsUpdated.subscribe(function () {
            self.outgoingRequests = self.sSessionManager.outgoingRequests;
        });

        sWindowManager.subscribeOnGlobalEvent("openContacts", function (data: any) {
            self.isOpen = true;
            jQuery('#contacts_container').perfectScrollbar();
            draggable_window.showIt(self.mainBlock.nativeElement);
            var elWidth = parseInt(window.getComputedStyle(self.mainBlock.nativeElement).width, 10);
            var elHeight = 400;

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

    private deleteContact(contact: any) {
        this.sApiClient.deleteContact(contact.key);
    }

    private deleteRequest(user: any, isIncoming: boolean) {
        this.sApiClient.deleteRequest(user.key, isIncoming);
    }

    private acceptRequest(user: any) {
        this.sApiClient.acceptRequest(user.key);
    }

    private openAddContact(): void {
        this.sWindowManager.emitGlobalEvent("openAddContact");
    }

}
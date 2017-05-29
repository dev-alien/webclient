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
    selector: 'conversations',
    templateUrl: './app/conversations.component.html',
    styleUrls: ['./app/conversations.component.css']
})
export class ConversationsComponent implements OnInit {
    ngOnInit(): void {
        document.getElementById("defaultOpen").click();
    }

    @ViewChild('mainBlock') mainBlock: ElementRef;
    @ViewChild('contactsContainer') contactsContainer: ElementRef;
    @ViewChild('statusWindow') statusWindow: StatusWindowComponent;
    @ViewChild('recaptchaBlock') mRecaptchaBlock: ReCaptchaBlockComponent;
    @ViewChild('contactAdd') contactAdd: AddContactComponent;

    private isOpen: boolean = false;
    constructor(private sSessionManager: UserSession,
                private sWindowManager: WindowManager,
                private sApiClient: ApiClient,
                private sAlienCrypto: AlienCrypto) {
        var self = this;

        sWindowManager.subscribeOnGlobalEvent("openConversations", function (data: any) {
            self.isOpen = true;
            jQuery('#conversations_container').perfectScrollbar();
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

    private openCreateConversation(): void {
        this.sWindowManager.emitGlobalEvent("openCreateConversation");
    }

}
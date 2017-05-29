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
    selector: 'conversation',
    templateUrl: './app/conversation.component.html',
    styleUrls: ['./app/conversation.component.css']
})
export class ConversationComponent implements AfterViewChecked {
    @ViewChild('selfcb') mainBlock: ElementRef;
    @ViewChild('message_box') messageBox: ElementRef;
    @ViewChild('auto_fetch') autoFetchIndicator: ElementRef;
    @ViewChild('messages_container') messageContainer: ElementRef;
    @Input() conversation: Conversation;

    private isShown: boolean = false;
    private requestStarted: boolean = false;
    private showStatus: boolean = false;
    private status: string = "";
    private id: string = "";
    private fetchStatus: string = "";
    private messages: Message[] = [];

    constructor(private sSessionManager: UserSession,
                private sWindowManager: WindowManager,
                private sApiClient: ApiClient,
                private sAlienCrypto: AlienCrypto) {
        var self = this;

        setImmediate(function () {
            self.autoFetch();
            jQuery(self.messageContainer.nativeElement).perfectScrollbar();

            self.isShown = true;
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

    private keydown(event: any) {
        if(event.key === "Enter") {
            this.sendMessage();
            return false;
        }
    }

    private noMoreMessagesAvailable = false;
    private fetchStarted = false;
    private conversationWasEmpty = false;

    public fetchMore() {
        var self = this;

        if(this.conversationWasEmpty)
            return;

        if(this.noMoreMessagesAvailable) {
            self.fetchStatus = "No more messages available";
            return;
        }

        if(this.fetchStarted) {
            return;
        }


        let lastMessageId = this.conversation.lastMessageId();
        if(lastMessageId === -1) {
            this.conversationWasEmpty = true;
            self.fetchStatus = "";
            return;
        }

        this.fetchStarted = true;
        self.fetchStatus = "Fetching more messages...";

        this.sApiClient.getMessages(
            lastMessageId - 1,
            20, 
            this.conversation,
            function (errorCode: number, messages: Message[]) {
                if(errorCode === 200) {
                    self.fetchStarted = false;

                    if(messages.length === 0)
                        return self.noMoreMessagesAvailable = true;
                    self.fetchStatus = "";
                    self.conversation.insertMessages(messages);

                    //self.fetchMore();
                } else
                    return self.fetchStatus = "Unable to fetch more messages, click to retry";
            }
        )
    }

    private autoFetch() {
        const isVisible = isScrolledIntoView(this.autoFetchIndicator.nativeElement);
        if(isVisible)
            this.fetchMore();

        let self = this;
        if(this.conversation.isOpen) {
            setTimeout(() => self.autoFetch(), 500);
        }
    }

    private sendMessage(): void {
        let messageBlockContent = this.messageBox.nativeElement.innerHTML;
        let requestBody = {
            message: this.sAlienCrypto.encryptMessage(this.conversation.extConvId.id(), messageBlockContent)
        };

        if(!requestBody.message) {
            alert('Unable to find conversation key');
            return;
        }

        console.error(requestBody);

        this.sApiClient.sendMessage(requestBody, this.conversation, function (errorCode) {
            //Todo: resend message
        });
        this.messageBox.nativeElement.innerHTML = "";
    };

    private previousHeight: number = -1;
    private previousScrollTop: number = -1;

    public ngAfterViewChecked(): void {
        console.log(this.conversation.messages);

        let messageContainer = this.messageContainer.nativeElement;

        if(this.previousHeight === -1) {
            this.previousHeight = messageContainer.scrollHeight;
            this.previousScrollTop = messageContainer.scrollTop;
            return;
        }

        let currentHeight: number = messageContainer.scrollHeight;
        if(currentHeight != this.previousHeight) {
            let diff = currentHeight - this.previousHeight;
            messageContainer.scrollTop = this.previousScrollTop + diff;
            jQuery(this.messageContainer.nativeElement).perfectScrollbar('update');
        }

        this.previousScrollTop = messageContainer.scrollTop;
        this.previousHeight = currentHeight;
    }

    onInit() {
    }
}
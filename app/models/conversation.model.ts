import {Message} from './message.model'
import {ExtConvId} from "./ext_conv_id.model";
import {User} from "./user.model";
import {ExtUid} from "./ext_uid.model";
import {AlienCrypto} from "../alien_crypto.service";
import {Inject} from "@angular/core";

export class Conversation {
    public extConvId: ExtConvId;
    public messages: Message[] = [];
    public name: string;
    public isOpen: boolean = false;

    public constructor(private sAlienCrypto: AlienCrypto) {

    }

    public getLastMessageText(): string {
        if(this.messages.length === 0)
            return "There is no messages yet..";
        let lastMessage: Message = this.messages[this.messages.length - 1];
        if(lastMessage.type === 1)
            return lastMessage.message;
        return "<system message>"
    }

    private sortMessages() {
        this.messages = this.messages.sort((a, b) => a.message_id - b.message_id);
    }

    public lastMessageId() {
        if(this.messages.length === 0)
            return -1;

        return this.messages[0].message_id;
    }

    public insertMessages(messages: any[]) {
        var self = this;
        messages.forEach(function (message: any) {
            let existingMessage = self.messages.filter(
                (item: any) => item.message_id === message.message_id)[0];
            if(!existingMessage) {
                self.messages.push(message);
            }
        });
        this.sortMessages();
        this.incrementalDecryption();
    }

    public incrementalDecryption(): void {
        let self = this;
        console.log("ID");
        console.log(self);
        this.messages.map(function (message: Message) {
            if(!message.isDecrypted) {
                message.decryptedMessage = self.sAlienCrypto.decryptMessage(self.extConvId.id(), message.message);
                if(message.decryptedMessage)
                    message.isDecrypted = true;
            }
            return message;
        })
    }
}
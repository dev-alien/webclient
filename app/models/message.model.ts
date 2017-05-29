import {ExtUid} from "./ext_uid.model";
import {User} from "./user.model";
import {isUndefined} from "util";
import {MessageData} from "./message_data.model";

export class Message {
    public message_id: number;
    public type: number;
    public message: string;
    public sender: User = null;
    public decryptedMessage: string = null;
    public isDecrypted: boolean = false;
    public prerenderedMessage(): string {
        if(this.type === 1) {
            if(!this.isDecrypted)
                return "<UNABLE TO DECRYPT THE MESSAGE>";
            return this.decryptedMessage;
        }
        if(this.message.length === 0)
            return "<EMPTY MESSAGE>";

        return this.message;
    }
    public data: MessageData;
}
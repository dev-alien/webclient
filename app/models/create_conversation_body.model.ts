import {UserKeyPair} from "./user_key_pair.model";

export class CreateConversationBody {
    public name: string = "";
    public participants: UserKeyPair[] = [];
}
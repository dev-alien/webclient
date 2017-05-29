export type ConversationKey = string;

export class Keyring {
    public private_keys: string[] = [];
    public conversations: { [ convId: string]:ConversationKey } = {};

    public pushPrivateKey(private_key: string): number {
        var index = this.private_keys.push(private_key) - 1;
        return index;
    }
}
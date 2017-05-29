export class ExtUid {
    constructor(public stringVal: string) {    }
    public region(): string {
        return this.stringVal.split('_')[0];
    };
    public id(): string {
        return this.stringVal.split('_')[1];
    };
}
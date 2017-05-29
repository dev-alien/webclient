export class ExtConvId {
    constructor(public stringVal: string) {    }
    public region(): string {
        return this.stringVal.split('_')[0];
    };
    public csName(): string {
        return this.stringVal.split('_')[1];
    };
    public id(): string {
        return this.stringVal.split('_')[2];
    };
}
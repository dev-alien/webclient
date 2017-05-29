import {Injectable, EventEmitter} from '@angular/core'
import {RecaptchaComponent} from "ng2-recaptcha";
import {ReCaptchaBlockComponent} from "./recaptcha_overlay.component";

export class GlobalEvent {
    public name: string;
    public data: any;
    constructor(name: string, data: any) {
        this.name = name;
        this.data = data;
    }
}

declare type GlobalEventCallback = (data: any)=>void;

@Injectable()
export class WindowManager {
    public globalRecaptchaBlock: ReCaptchaBlockComponent;
    public globalEventEmmitter: EventEmitter<GlobalEvent> = new EventEmitter<GlobalEvent>();

    public isSignUpOpen: boolean = false;

    emitGlobalEvent(name: string, data?: any) {
        this.globalEventEmmitter.emit(new GlobalEvent(name, data));
    }

    subscribeOnGlobalEvent(evname: string, callback: GlobalEventCallback) {
        return this.globalEventEmmitter.subscribe(function(ev: GlobalEvent) {
            if(ev.name == evname) {
                callback(ev.data);
            }
        });
    }

    constructor() {    }
}
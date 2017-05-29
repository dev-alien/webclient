import {Component} from "@angular/core";
import {UserSession} from "./session.service";
import {WindowManager} from "./window_mgr.service";

@Component({
    selector: 'mheader',
    templateUrl: './app/header.component.html'
})
export class HeaderComponent {
    constructor(private sSessionManager: UserSession,
                private sWindowManager: WindowManager) {
        /* TODO: remove
        setInterval(function () {
            sSessionManager.isAuthorized = !sSessionManager.isAuthorized;
        }, 100);
         */
    }
    private openSignIn(): void {
        this.sWindowManager.emitGlobalEvent("signInOpen");
    }
    private openSignUp(): void {
        this.sWindowManager.emitGlobalEvent("openSignUp");
    }
    private openContacts(): void {
        this.sWindowManager.emitGlobalEvent("openContacts");
    }
    private openConversations(): void {
        this.sWindowManager.emitGlobalEvent("openConversations");
    }
    private logOut(): void {
        this.sSessionManager.logOut();
    }
}
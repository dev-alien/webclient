import {Component, OnInit, Inject, ViewChild} from "@angular/core";
import {UserSession} from "./session.service";
import {ApiClient} from "./api_client.service";
import {WindowManager} from "./window_mgr.service";
import {AlienCrypto} from "./alien_crypto.service";
import {CookieManager} from "./cookie_manager.service";
import {ReCaptchaBlockComponent} from "./recaptcha_overlay.component";
import {NotificationListener} from "./notification_listener.service";
import {KeyringPatcher} from "./keyring_patcher.service";

@Component({
    selector: 'app',
    templateUrl: './app/app.component.html',
    styleUrls: ['./app/app.component.css'],
    providers: [
        UserSession,
        ApiClient,
        WindowManager,
        AlienCrypto,
        CookieManager,
        NotificationListener,
        KeyringPatcher
    ]
})

export class AppComponent implements OnInit {
    @ViewChild('recaptchaBlock') recaptchaBlock: ReCaptchaBlockComponent;
    constructor(@Inject(CookieManager) private sCookieManager: CookieManager,
                @Inject(AlienCrypto) private sAlienCrypto: AlienCrypto,
                @Inject(UserSession) private sUserSession: UserSession,
                @Inject(ApiClient) private sApiClient: ApiClient,
                @Inject(WindowManager) private sWindowManager: WindowManager,
                @Inject(NotificationListener) private sNotificationListener: NotificationListener) {
    }
    ngOnInit(): void {
        this.sWindowManager.globalRecaptchaBlock = this.recaptchaBlock;
        var self = this;
        this.sUserSession.loadTokenFromCookies();
        self.sAlienCrypto.loadMasterKeyFromCookies();

        if(this.sUserSession.token) {
            this.sApiClient.authorizeWithToken(this.sUserSession.token,
              function (success: boolean) {
                  if(success) {
                  }
                  else {
                      this.sUserSession.logOut();
                  }
              }
            );
        }
    }
}
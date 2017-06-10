import {Component, OnInit, ElementRef} from "@angular/core";
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

declare var draggable_window: any;
declare var jQuery:any;

@Component({
    selector: 'sign-up',
    templateUrl: './app/sign_up.component.html',
    styleUrls: ['./app/sign_up.component.css']
})
export class SignUpComponent implements OnInit {
    @ViewChild('mainBlock') mainBlock: ElementRef;
    @ViewChild('recaptchaBlock') mRecaptchaBlock: ReCaptchaBlockComponent;
    @ViewChild('statusWindow') statusWindow: StatusWindowComponent;

    private isOpen: boolean = false;
    private mSignUpStarted: boolean = false;
    private mCloseAllowed: boolean = false;
    private mSignUpStatus: string = "";
    private requestBody: RegistrationRequestBody;
    private mPassword: string;
    private regions: any = [ { id: 0, name: "EU0", info: "EU0 - Amsterdam"} ];
    constructor(private sSessionManager: UserSession,
                private sWindowManager: WindowManager,
                private sApiClient: ApiClient,
                private sAlienCrypto: AlienCrypto) {
        this.requestBody = new RegistrationRequestBody();
        var self = this;
        sWindowManager.subscribeOnGlobalEvent("openSignUp", function (data: any) {
            self.isOpen = true;
            draggable_window.showIt(self.mainBlock.nativeElement);
            var elWidth = parseInt(window.getComputedStyle(self.mainBlock.nativeElement).width, 10);
            var elHeight = 450;

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

    private signInAfterRegistration(test_password_hash: string) {
        var self = this;

        this.mSignUpStarted = false;
        this.statusWindow.show();
        this.statusWindow.setCaption("Signing in...");

        this.sApiClient.authorizeWithoutToken(this.requestBody.login, this.mPassword,
            function (finished: boolean, status: string) {
                if(finished) {
                    setTimeout(function () {
                        self.isOpen = false;
                        self.statusWindow.close();
                    }, 1000);
                }
                self.statusWindow.setStatus(status);
            }, this.mRecaptchaBlock, false, test_password_hash);
    }

    private onSubmit(ev: any) {
        ev.preventDefault();
        this.performSignUp();
    }

    private performSignUp(): void {
        //Todo: make it dynamically chosen
        console.log(this.requestBody.login);
        this.mSignUpStarted = true;
        this.mSignUpStatus = "Generating RSA keypair...";
        var self = this;
        this.sAlienCrypto.generateKeyPair(function (rsaKeyPair: RsaKeyPair) {
            var initialKeyring = new Keyring();
            initialKeyring.pushPrivateKey(rsaKeyPair.private_key);
            self.requestBody.public_key = rsaKeyPair.public_key;

            var hashInfo = new HashInfo();
            hashInfo.alg = "pbkdf2/sha512";
            hashInfo.nIterations = self.sAlienCrypto.nPbkdf2Iterations;
            self.requestBody.hash_info = hashInfo;

            self.mSignUpStatus = "Computing the test password hash...";
            setTimeout(function () {
                self.requestBody.test_pwd_hash = self.sAlienCrypto
                    .get_test_pwd_hash(self.requestBody.login, self.mPassword, self.sAlienCrypto.nPbkdf2Iterations);
                self.mSignUpStatus = "Computing the master key and encrypting the keyring...";
                setImmediate(function () {
                    self.sAlienCrypto.generateMasterKey(self.requestBody.login, self.mPassword);
                    self.requestBody.keyring = self.sAlienCrypto.encryptKeyring(initialKeyring);
                    self.mSignUpStatus = "Waiting for a backend response...";
                    var body: string = JSON.stringify(self.requestBody.serialize());
                    self.sApiClient.registration(
                        body,
                        self.mRecaptchaBlock,
                        function (res: Response) {
                            var status = res.status;
                            self.mCloseAllowed = true;

                            switch (status) {
                                case 0:
                                    self.mSignUpStatus = "Unknown error, please contact the administration";
                                    break;
                                case 200:
                                    self.signInAfterRegistration(self.requestBody.test_pwd_hash);
                                    break;
                                case 412:
                                    self.mSignUpStatus = "Error: Login contains invalid characters";
                                    break;
                                case 413:
                                    self.mSignUpStatus = "Error: This login is already being used";
                                    break;
                            }
                        });
                });
            }, 0);
        });

        /*
                this.mRecaptchaBlock.show(function (err: boolean, token: string) {
                    if(err)
                        alert("err");
                    else
                        alert(token);
                });
        */
    };


    ngOnInit() {
        this.requestBody.region = this.regions[0];
        jQuery('#registration_form_container').perfectScrollbar();
    }
}
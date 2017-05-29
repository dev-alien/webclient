import {Injectable, Inject, EventEmitter} from '@angular/core'
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {ReCaptchaBlockComponent} from "./recaptcha_overlay.component";
import {RegistrationRequestBody} from "./models/registration_request_body.model";
import {Observable} from "rxjs";
import {UserSession} from "./session.service";
import {AlienCrypto} from "./alien_crypto.service";
import {CookieManager} from "./cookie_manager.service";
import {User} from "./models/user.model";
import {WindowManager} from "./window_mgr.service";
import {NotificationListener} from "./notification_listener.service";
import {Config} from './config';
import {Conversation} from "./models/conversation.model";
import {ExtConvId} from "./models/ext_conv_id.model";
import {Message} from "./models/message.model";
import {ExtUid} from "./models/ext_uid.model";
import {CreateConversationBody} from "./models/create_conversation_body.model";
import {UserKeyPair} from "./models/user_key_pair.model";
import {Patch} from "./models/patch.model";
import {PatchRequest} from "./models/patch_request.model";
import {KeyringPatcher} from "./keyring_patcher.service";

export type ResponseCallback = (res: Response) => any;
export type AuthorizationStatusCallback = (finished: boolean, message: string) => any;
export type SuccessOrFailCallback = (success: boolean) => any;
export type GetUsersCallback = (users: User[]) => any;
export type IdsArrayCallback = (ids: string[]) => any;
export type RequestArrayCallback = (request_array: any[]) => any;
export type GetPatchesCallback = (status: number, patches: any) => any;
export type ContactRequestCallback = (error_code: number) => any;
export type CreateConversationCallbacks = (error_code: number) => any;
export type GetConversationsCollaback = (users: Conversation[]) => any;
export type SendMessageCallback = (error_code: number) => any;
export type GetMessagesCallback = (error_code: number, messages: Message[]) => any;
export type ApplyPatchesCallback = (status: number) => any;

@Injectable()
export class ApiClient {
    public isCsMapFetched = false;
    public csMapFetched: EventEmitter<void> = new EventEmitter<void>();

    public storeSession: boolean = true;
    public static userInfoPossibleMembers =
        [
            "email",
            "first_name",
            "last_name",
            "birthday",
            "avatar"
        ];

    constructor(private http: Http,
                @Inject(UserSession) private sUserSession: UserSession,
                @Inject(AlienCrypto) private sAlienCrypto: AlienCrypto,
                @Inject(CookieManager) private sCookieManager: CookieManager,
                @Inject(WindowManager) private sWindowManager: WindowManager,
                @Inject(KeyringPatcher) private sKeyringPatcher: KeyringPatcher,
                @Inject(NotificationListener) private sNotificationListener: NotificationListener) {
        sUserSession.sApiClient = this;
        sKeyringPatcher.sApiClient = this;

        this.csMapFetched.subscribe(() => sUserSession.csMapReady());
        const self = this;
        self.fetchCsMap();
        setImmediate(function () {
            setInterval(() => self.fetchCsMap(), Config.cs_map_refresh_interval * 1000);
        });
    }

    private csMap = {};

    private fetchCsMap() {
        const self = this;
        const url = Config.api_entry_point + "static/cs_map.json";

        this.http.get(url)
            .map((res: Response) => {
                self.csMap = JSON.parse(res.text());
                if(!self.isCsMapFetched) {
                    self.isCsMapFetched = true;
                    self.csMapFetched.emit();
                }
            })
            .catch((err: Response | any): any => {
            })
            .subscribe(
                (data) => {  },
                (err) => {  });
    }

    public registration(body: string,
                        captcha: ReCaptchaBlockComponent,
                        callback: ResponseCallback, captchaToken?: string): void {
        const url = Config.api_entry_point + "registration";
        const headers = new Headers({'Content-Type': 'application/json'});
        if(captchaToken)
            headers.append('captcha', captchaToken);
        const options = new RequestOptions({headers: headers});
        const self = this;
        this.http.post(url, body, options)
            .map((res: Response) => {
                callback(res);
            })
            .catch((err: Response | any): any => {
                if(err.status == 460) {
                    captcha.show(function (captcha_err: boolean, token: string) {
                        if(captcha_err)
                            callback(err);
                        else {
                            self.registration(body, captcha, callback, token);
                        }
                    });
                    return;
                }
                callback(err);
            })
            .subscribe(
                (data) => {  },
                (err) => {  });
    }

    private useAuthResponseData(body: any) {
        const self = this;
        this.sUserSession.isAuthorized = true;

        self.sAlienCrypto.decryptKeyring(body.keyring);
        self.sUserSession.users_ids = [];
        self.sUserSession.users = {};

        self.sUserSession.contacts = {};
        self.sUserSession.contact_ids = [];

        self.sUserSession.conversationIds = body.conversations || [];

        body.contacts.forEach(function (contact: any) {
            self.sUserSession.contact_ids.push(contact['$oid']);
        });

        this.sUserSession.resolveContactsIncrementally();

        if(body['token'])
        this.sUserSession.token = body.token;

        this.sUserSession.profile.ext_uid = new ExtConvId(body.region + "_" + body['_id']['$oid']);
        this.sUserSession.profile.public_key = body.public_keys[body.public_keys.length - 1];

        this.sUserSession.fetchRequests();
        this.sUserSession.initNotificationHandlers();

        this.sUserSession.profile.info = body['info'];
        this.sNotificationListener.start();
        this.sKeyringPatcher.beginPatching();
        self.sUserSession.onAuthorized();
    }

    private finishAuthorization(login: string,
                                password: string,
                                res: Response,
                                callback: AuthorizationStatusCallback,
                                fullAuth:  boolean = true //Generate a master key during authorization
    ) {
        const self = this;

        const status = res.status;
        switch (status) {
            case 200:
                const body = JSON.parse(res.text());
                self.sUserSession.token = body['token'];
                if(fullAuth)
                    callback(false, "Computing the master key and decrypting the keyring");
                setTimeout(function () {
                    if(fullAuth) {
                        self.sAlienCrypto.generateMasterKey(login, password);
                        self.sAlienCrypto.decryptKeyring(body['keyring']);
                    }
                    if(self.storeSession) {
                        self.sAlienCrypto.saveMasterKeyInCookies();
                        self.sUserSession.saveTokenInCookies();
                    }
                    self.useAuthResponseData(body);
                    callback(true, "Welcome to the service!");
                }, 50);
                break;
            case 411:
                callback(false, "Authorization error: wrong login or password");
                break;
            default:
                callback(false, "Unknown authorization error: "+JSON.stringify(res));
        }
    }

    public authorizeWithoutToken(login: string,
                     password: string,
                     callback: AuthorizationStatusCallback,
                     captcha: ReCaptchaBlockComponent,
                     fullAuth: boolean  = true,
                     test_pwd_hash?: string,
                     captchaToken?: string) {
        const self = this;
        let generated_test_pwd_hash = test_pwd_hash;

        const afterTestPwdHashGenerated = function () {
            callback(false, "Waiting for a backend response...");
            const url = Config.api_entry_point + "auth?login=" + login + "&test_pwd_hash=" + encodeURIComponent(generated_test_pwd_hash);
            const headers = new Headers();
            if (captchaToken)
                headers.append('captcha', captchaToken);
            const options = new RequestOptions({headers: headers});
            self.http.get(url, options)
                .map((res: Response) => {
                    self.finishAuthorization(login, password, res, callback, fullAuth);
                })
                .catch((err: Response | any): any => {
                    if (err.status == 460) {
                        captcha.show(function (captcha_err: boolean, token: string) {
                            if (captcha_err)
                                callback(false, "Captcha is required to sing in");
                            else {
                                self.authorizeWithoutToken(login, password,
                                    callback, captcha, fullAuth, generated_test_pwd_hash, token);
                            }
                        });
                        return;
                    }
                    self.finishAuthorization(login, password, err, callback, fullAuth);
                })
                .subscribe(
                    (data) => {
                    },
                    (err) => {
                    });
        };

        if(!test_pwd_hash) {
            callback(false, "Computing the test password hash...");
            setTimeout(function () {
                generated_test_pwd_hash = self.sAlienCrypto
                    .get_test_pwd_hash(login, password, self.sAlienCrypto.nPbkdf2Iterations);
                afterTestPwdHashGenerated();
            }, 0);
            return;
        }
        afterTestPwdHashGenerated();
    }

    public authorizeWithToken(token: string, callback: SuccessOrFailCallback) {
        const self = this;

        const url = Config.api_entry_point + "auth";
        const headers = new Headers({'token': token});

        const options = new RequestOptions({headers: headers});
        this.http.get(url, options)
            .map((res: Response) => {
                const body = JSON.parse(res.text());
                self.useAuthResponseData(body);
                callback(true);
            })
            .catch((err: Response | any): any => {
                callback(false);
            })
            .subscribe(
                (data) => {  },
                (err) => {  });
    }

    public getUsers(ids: string[],
                    callback: GetUsersCallback,
                    captchaToken?: string): void {
        let idsString = "";
        let first = true;
        ids.forEach(function (user: string) {
            if(first)
                first = false;
            else
                idsString += ',';
            idsString += user;
        });
        const self = this;

        const url = Config.api_entry_point + "users?ids=" + idsString;
        const headers = new Headers({'token': this.sUserSession.token});

        const options = new RequestOptions({headers: headers});
        this.http.get(url, options)
            .map((res: Response) => {
                console.log(res.text());
                const body = JSON.parse(res.text());
                callback(body);
            })
            .catch((err: Response | any): any => {
                if(err.status === 460) {
                    self.sWindowManager.globalRecaptchaBlock.show(
                        function (success: boolean, token: string) {
                            if(success) {
                                self.getUsers(ids, callback, token);
                            }
                            else {
                                callback([]);
                            }
                        });
                    return;
                }
                callback([]);
            })
            .subscribe(
                (data) => {  },
                (err) => {  });
    }

    public createContactRequest(id_or_login: string,
                    callback: ContactRequestCallback,
                    captchaToken?: string): void {
        const self = this;

        const url = Config.api_entry_point + "contacts/request";
        const headers = new Headers({'token': this.sUserSession.token});

        const body = {
            id_or_login: id_or_login
        };

        const options = new RequestOptions({headers: headers});
        this.http.post(url, body, options)
            .map((res: Response) => {
                callback(200);
            })
            .catch((err: Response | any): any => {
                if(err.status === 460) {
                    self.sWindowManager.globalRecaptchaBlock.show(
                        function (success: boolean, token: string) {
                            if(success) {
                                self.createContactRequest(id_or_login, callback, token);
                            }
                            else {
                                callback(460);
                            }
                        });
                    return;
                }
                callback(err.status);
            })
            .subscribe(
                (data) => {  },
                (err) => {  });
    }

    public getRequests(type: string, //incoming or outgoing
                    callback: RequestArrayCallback,
                    captchaToken?: string): void {
        const self = this;
        const url = Config.api_entry_point + "/contacts/requests/" + type;
        const headers = new Headers({'token': this.sUserSession.token});

        const options = new RequestOptions({headers: headers});
        this.http.get(url, options)
            .map((res: Response) => {
                const body = JSON.parse(res.text());
                callback(body);
            })
            .catch((err: Response | any): any => {
                if(err.status === 460) {
                    self.sWindowManager.globalRecaptchaBlock.show(
                        function (success: boolean, token: string) {
                            if(success) {
                                self.getRequests(type, callback, token);
                            }
                            else {
                                callback([]);
                            }
                        });
                    return;
                }
                callback([]);
            })
            .subscribe(
                (data) => {  },
                (err) => {  });
    }

    public deleteContact(uid: string, captchaToken?: string) {
        const self = this;

        const url = Config.api_entry_point + "contacts?uid=" + uid;
        const headers = new Headers({'token': this.sUserSession.token});

        const options = new RequestOptions({headers: headers});
        this.http.delete(url, options)
            .map((res: Response) => {
            })
            .catch((err: Response | any): any => {
                if(err.status === 460) {
                    self.sWindowManager.globalRecaptchaBlock.show(
                        function (success: boolean, token: string) {
                            if(success) {
                                self.deleteContact(uid, token);
                            }
                        });
                    return;
                }
                console.log("Unable to execute delete contact request");
                console.log(err);
            })
            .subscribe(
                (data) => {  },
                (err) => {  });
    }

    public deleteRequest(uid: string, isIncoming: boolean, captchaToken?: string) {
        const self = this;

        const url = Config.api_entry_point + "contacts/request/" + (isIncoming ? "incoming" : "outgoing") + "/?uid=" + uid;
        const headers = new Headers({'token': this.sUserSession.token});

        const options = new RequestOptions({headers: headers});
        this.http.delete(url, options)
            .map((res: Response) => {
            })
            .catch((err: Response | any): any => {
                if(err.status === 460) {
                    self.sWindowManager.globalRecaptchaBlock.show(
                        function (success: boolean, token: string) {
                            if(success) {
                                self.deleteRequest(uid, isIncoming, token);
                            }
                        });
                    return;
                }
                console.log("Unable to execute a delete_contact_request request");
                console.log(err);
            })
            .subscribe(
                (data) => {  },
                (err) => {  });
    }

    public acceptRequest(uid: string, captchaToken?: string) {
        const self = this;

        const url = Config.api_entry_point + "contacts/request?uid=" + uid;
        const headers = new Headers({'token': this.sUserSession.token});

        const options = new RequestOptions({headers: headers});
        this.http.patch(url, "", options)
            .map((res: Response) => {
            })
            .catch((err: Response | any): any => {
                if(err.status === 460) {
                    self.sWindowManager.globalRecaptchaBlock.show(
                        function (success: boolean, token: string) {
                            if(success) {
                                self.acceptRequest(uid, token);
                            }
                        });
                    return;
                }
                console.log("Unable to execute a accept_contact_request request");
                console.log(err);
            })
            .subscribe(
                (data) => {  },
                (err) => {  });
    }


    public getConversations(requestData: any,
                    callback: GetConversationsCollaback,
                    captchaToken?: string): void {
        let idsString = "";
        let first = true;
        requestData.conversations.forEach(function (conversation: ExtConvId) {
            if(first)
                first = false;
            else
                idsString += ',';
            idsString += conversation.id();
        });

        const self = this;

        const myRegion = this.csMap[requestData.region];
        if(!myRegion) {
            console.error("Unable to locate target region");
            return callback([]);
        }

        const myCs = myRegion[requestData.csName];
        if(!myCs) {
            console.error("Unable to locate target conversation server");
            return callback([]);
        }

        const url = "https://" + myCs.host + ":" + myCs.port  + "/conversations?conv_ids=" + idsString;

        const headers = new Headers({'token': this.sUserSession.token});

        const options = new RequestOptions({headers: headers});
        this.http.get(url, options)
            .map((res: Response) => {
                const body = JSON.parse(res.text());
                body.map(function (conversation: any) {
                    let conv: Conversation = Object.assign(new Conversation(self.sAlienCrypto), conversation);
                    conv.extConvId = new ExtConvId(requestData.region+'_'+requestData.csName+ '_'+conversation.id);
                    conv.messages = self.sUserSession.buildMessages(conversation.messages);
                    conv.incrementalDecryption();
                    return conv;
                });
                callback(body);
            })
            .catch((err: Response | any): any => {
                if(err.status === 460) {
                    self.sWindowManager.globalRecaptchaBlock.show(
                        function (success: boolean, token: string) {
                            if(success) {
                                self.getConversations(requestData, callback, token);
                            }
                            else {
                                callback([]);
                            }
                        });
                    return;
                }
                callback([]);
            })
            .subscribe(
                (data) => {  },
                (err) => {  });
    }

    public sendMessage(body: any,
                       conversation: Conversation,
                       callback: ContactRequestCallback,
                       captchaToken?: string): void {
        const self = this;

        const myRegion = this.csMap[conversation.extConvId.region()];
        if(!myRegion) {
            console.error("Unable to locate target region");
            return callback(-1);
        }

        const myCs = myRegion[conversation.extConvId.csName()];
        if(!myCs) {
            console.error("Unable to locate target conversation server");
            return callback(-2);
        }

        const url = "https://" + myCs.host + ":" + myCs.port  + "/messages?conv_id=" + conversation.extConvId.id();


        const headers = new Headers({'token': this.sUserSession.token});

        const options = new RequestOptions({headers: headers});
        this.http.post(url, body, options)
            .map((res: Response) => {
                callback(200);
            })
            .catch((err: Response | any): any => {
                if(err.status === 460) {
                    self.sWindowManager.globalRecaptchaBlock.show(
                        function (success: boolean, token: string) {
                            if(success) {
                                self.sendMessage(body, conversation, callback, token);
                            }
                            else {
                                callback(460);
                            }
                        });
                    return;
                }
                callback(err.status);
            })
            .subscribe(
                (data) => {  },
                (err) => {  });
    }

    public getMessages(offset: number,
                       count: number,
                       conversation: Conversation,
                       callback: GetMessagesCallback,
                       captchaToken?: string): void {

        const self = this;

        const myRegion = this.csMap[conversation.extConvId.region()];
        if(!myRegion) {
            console.error("Unable to locate the target region");
            return callback(-1, []);
        }

        const myCs = myRegion[conversation.extConvId.csName()];
        if(!myCs) {
            console.error("Unable to locate the target conversation server");
            return callback(-2, []);
        }

        const url = "https://" + myCs.host + ":" + myCs.port
            + "/messages?conv_id=" + conversation.extConvId.id()
            + "&offset=" + offset
            + "&count=" + count;

        const headers = new Headers({'token': this.sUserSession.token});

        const options = new RequestOptions({headers: headers});
        this.http.get(url, options)
            .map((res: Response) => {
                let body = JSON.parse(res.text());
                callback(200, self.sUserSession.buildMessages(body));
            })
            .catch((err: Response | any): any => {
                if(err.status === 460) {
                    self.sWindowManager.globalRecaptchaBlock.show(
                        function (success: boolean, token: string) {
                            if(success)
                                self.getMessages(offset, count, conversation, callback, token);
                            else
                                callback(err.status, []);
                        });
                    return;
                }
                callback(err.status, []);
            })
            .subscribe(
                (data) => {  },
                (err) => {  });
    }

    public createConversation(body: CreateConversationBody,
                                callback: CreateConversationCallbacks,
                                captchaToken?: string): void {
        const self = this;

        const url = Config.api_entry_point + "conversations";
        const headers = new Headers({'token': this.sUserSession.token});

        let _body: any = {
            name: body.name,
            participants: body.participants.map(function (userKeyPair: UserKeyPair) {
                return  {
                    ext_uid: userKeyPair.user.ext_uid.stringVal,
                    conv_key: userKeyPair.key
                };
            })
        };

        console.log(_body);

        const options = new RequestOptions({headers: headers});
        this.http.post(url, _body, options)
            .map((res: Response) => {
                callback(200);
            })
            .catch((err: Response | any): any => {
                if(err.status === 460) {
                    self.sWindowManager.globalRecaptchaBlock.show(
                        function (success: boolean, token: string) {
                            if(success) {
                                self.createConversation(body, callback, token);
                            }
                            else {
                                callback(460);
                            }
                        });
                    return;
                }
                callback(err.status);
            })
            .subscribe(
                (data) => {  },
                (err) => {  });
    }

    public getPatches(callback: GetPatchesCallback,
                      captchaToken?: string): void {
        const self = this;
        const url = Config.api_entry_point + "/patches";
        const headers = new Headers({'token': this.sUserSession.token});

        const options = new RequestOptions({headers: headers});
        this.http.get(url, options)
            .map((res: Response) => {
                const body = JSON.parse(res.text());
                callback(200, body);
            })
            .catch((err: Response | any): any => {
                callback(err.status, null);
            })
            .subscribe(
                (data) => {  },
                (err) => {  });
    }

    public applyPatches(body: PatchRequest, callback: ApplyPatchesCallback,
                      captchaToken?: string): void {
        const self = this;
        const url = Config.api_entry_point + "/patches";
        const headers = new Headers({'token': this.sUserSession.token});

        const options = new RequestOptions({headers: headers});
        this.http.patch(url, body, options)
            .map((res: Response) => {
                const body = JSON.parse(res.text());
                callback(200);
            })
            .catch((err: Response | any): any => {
                callback(err.status);
            })
            .subscribe(
                (data) => {  },
                (err) => {  });
    }
}
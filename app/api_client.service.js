System.register(['@angular/core', "@angular/http", "./session.service", "./alien_crypto.service", "./cookie_manager.service", "./window_mgr.service", "./notification_listener.service", './config', "./models/conversation.model", "./models/ext_conv_id.model", "./keyring_patcher.service"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var core_1, http_1, session_service_1, alien_crypto_service_1, cookie_manager_service_1, window_mgr_service_1, notification_listener_service_1, config_1, conversation_model_1, ext_conv_id_model_1, keyring_patcher_service_1;
    var ApiClient;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (session_service_1_1) {
                session_service_1 = session_service_1_1;
            },
            function (alien_crypto_service_1_1) {
                alien_crypto_service_1 = alien_crypto_service_1_1;
            },
            function (cookie_manager_service_1_1) {
                cookie_manager_service_1 = cookie_manager_service_1_1;
            },
            function (window_mgr_service_1_1) {
                window_mgr_service_1 = window_mgr_service_1_1;
            },
            function (notification_listener_service_1_1) {
                notification_listener_service_1 = notification_listener_service_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (conversation_model_1_1) {
                conversation_model_1 = conversation_model_1_1;
            },
            function (ext_conv_id_model_1_1) {
                ext_conv_id_model_1 = ext_conv_id_model_1_1;
            },
            function (keyring_patcher_service_1_1) {
                keyring_patcher_service_1 = keyring_patcher_service_1_1;
            }],
        execute: function() {
            ApiClient = (function () {
                function ApiClient(http, sUserSession, sAlienCrypto, sCookieManager, sWindowManager, sKeyringPatcher, sNotificationListener) {
                    this.http = http;
                    this.sUserSession = sUserSession;
                    this.sAlienCrypto = sAlienCrypto;
                    this.sCookieManager = sCookieManager;
                    this.sWindowManager = sWindowManager;
                    this.sKeyringPatcher = sKeyringPatcher;
                    this.sNotificationListener = sNotificationListener;
                    this.isCsMapFetched = false;
                    this.csMapFetched = new core_1.EventEmitter();
                    this.storeSession = true;
                    this.csMap = {};
                    sUserSession.sApiClient = this;
                    sKeyringPatcher.sApiClient = this;
                    this.csMapFetched.subscribe(function () { return sUserSession.csMapReady(); });
                    var self = this;
                    self.fetchCsMap();
                    setImmediate(function () {
                        setInterval(function () { return self.fetchCsMap(); }, config_1.Config.cs_map_refresh_interval * 1000);
                    });
                }
                ApiClient.prototype.fetchCsMap = function () {
                    var self = this;
                    var url = config_1.Config.api_entry_point + "static/cs_map.json";
                    this.http.get(url)
                        .map(function (res) {
                        self.csMap = JSON.parse(res.text());
                        if (!self.isCsMapFetched) {
                            self.isCsMapFetched = true;
                            self.csMapFetched.emit();
                        }
                    })
                        .catch(function (err) {
                    })
                        .subscribe(function (data) { }, function (err) { });
                };
                ApiClient.prototype.registration = function (body, captcha, callback, captchaToken) {
                    var url = config_1.Config.api_entry_point + "registration";
                    var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                    if (captchaToken)
                        headers.append('captcha', captchaToken);
                    var options = new http_1.RequestOptions({ headers: headers });
                    var self = this;
                    this.http.post(url, body, options)
                        .map(function (res) {
                        callback(res);
                    })
                        .catch(function (err) {
                        if (err.status == 460) {
                            captcha.show(function (captcha_err, token) {
                                if (captcha_err)
                                    callback(err);
                                else {
                                    self.registration(body, captcha, callback, token);
                                }
                            });
                            return;
                        }
                        callback(err);
                    })
                        .subscribe(function (data) { }, function (err) { });
                };
                ApiClient.prototype.useAuthResponseData = function (body) {
                    var self = this;
                    this.sUserSession.isAuthorized = true;
                    self.sAlienCrypto.decryptKeyring(body.keyring);
                    self.sUserSession.users_ids = [];
                    self.sUserSession.users = {};
                    self.sUserSession.contacts = {};
                    self.sUserSession.contact_ids = [];
                    self.sUserSession.conversationIds = body.conversations || [];
                    body.contacts.forEach(function (contact) {
                        self.sUserSession.contact_ids.push(contact['$oid']);
                    });
                    this.sUserSession.resolveContactsIncrementally();
                    if (body['token'])
                        this.sUserSession.token = body.token;
                    this.sUserSession.profile.ext_uid = new ext_conv_id_model_1.ExtConvId(body.region + "_" + body['_id']['$oid']);
                    this.sUserSession.profile.public_key = body.public_keys[body.public_keys.length - 1];
                    this.sUserSession.fetchRequests();
                    this.sUserSession.initNotificationHandlers();
                    this.sUserSession.profile.info = body['info'];
                    this.sNotificationListener.start();
                    this.sKeyringPatcher.beginPatching();
                    self.sUserSession.onAuthorized();
                };
                ApiClient.prototype.finishAuthorization = function (login, password, res, callback, fullAuth //Generate a master key during authorization
                    ) {
                    if (fullAuth === void 0) { fullAuth = true; }
                    var self = this;
                    var status = res.status;
                    switch (status) {
                        case 200:
                            var body_1 = JSON.parse(res.text());
                            self.sUserSession.token = body_1['token'];
                            if (fullAuth)
                                callback(false, "Computing the master key and decrypting the keyring");
                            setTimeout(function () {
                                if (fullAuth) {
                                    self.sAlienCrypto.generateMasterKey(login, password);
                                    self.sAlienCrypto.decryptKeyring(body_1['keyring']);
                                }
                                if (self.storeSession) {
                                    self.sAlienCrypto.saveMasterKeyInCookies();
                                    self.sUserSession.saveTokenInCookies();
                                }
                                self.useAuthResponseData(body_1);
                                callback(true, "Welcome to the service!");
                            }, 50);
                            break;
                        case 411:
                            callback(false, "Authorization error: wrong login or password");
                            break;
                        default:
                            callback(false, "Unknown authorization error: " + JSON.stringify(res));
                    }
                };
                ApiClient.prototype.authorizeWithoutToken = function (login, password, callback, captcha, fullAuth, test_pwd_hash, captchaToken) {
                    if (fullAuth === void 0) { fullAuth = true; }
                    var self = this;
                    var generated_test_pwd_hash = test_pwd_hash;
                    var afterTestPwdHashGenerated = function () {
                        callback(false, "Waiting for a backend response...");
                        var url = config_1.Config.api_entry_point + "auth?login=" + login + "&test_pwd_hash=" + encodeURIComponent(generated_test_pwd_hash);
                        var headers = new http_1.Headers();
                        if (captchaToken)
                            headers.append('captcha', captchaToken);
                        var options = new http_1.RequestOptions({ headers: headers });
                        self.http.get(url, options)
                            .map(function (res) {
                            self.finishAuthorization(login, password, res, callback, fullAuth);
                        })
                            .catch(function (err) {
                            if (err.status == 460) {
                                captcha.show(function (captcha_err, token) {
                                    if (captcha_err)
                                        callback(false, "Captcha is required to sing in");
                                    else {
                                        self.authorizeWithoutToken(login, password, callback, captcha, fullAuth, generated_test_pwd_hash, token);
                                    }
                                });
                                return;
                            }
                            self.finishAuthorization(login, password, err, callback, fullAuth);
                        })
                            .subscribe(function (data) {
                        }, function (err) {
                        });
                    };
                    if (!test_pwd_hash) {
                        callback(false, "Computing the test password hash...");
                        setTimeout(function () {
                            generated_test_pwd_hash = self.sAlienCrypto
                                .get_test_pwd_hash(login, password, self.sAlienCrypto.nPbkdf2Iterations);
                            afterTestPwdHashGenerated();
                        }, 0);
                        return;
                    }
                    afterTestPwdHashGenerated();
                };
                ApiClient.prototype.authorizeWithToken = function (token, callback) {
                    var self = this;
                    var url = config_1.Config.api_entry_point + "auth";
                    var headers = new http_1.Headers({ 'token': token });
                    var options = new http_1.RequestOptions({ headers: headers });
                    this.http.get(url, options)
                        .map(function (res) {
                        var body = JSON.parse(res.text());
                        self.useAuthResponseData(body);
                        callback(true);
                    })
                        .catch(function (err) {
                        callback(false);
                    })
                        .subscribe(function (data) { }, function (err) { });
                };
                ApiClient.prototype.getUsers = function (ids, callback, captchaToken) {
                    var idsString = "";
                    var first = true;
                    ids.forEach(function (user) {
                        if (first)
                            first = false;
                        else
                            idsString += ',';
                        idsString += user;
                    });
                    var self = this;
                    var url = config_1.Config.api_entry_point + "users?ids=" + idsString;
                    var headers = new http_1.Headers({ 'token': this.sUserSession.token });
                    var options = new http_1.RequestOptions({ headers: headers });
                    this.http.get(url, options)
                        .map(function (res) {
                        console.log(res.text());
                        var body = JSON.parse(res.text());
                        callback(body);
                    })
                        .catch(function (err) {
                        if (err.status === 460) {
                            self.sWindowManager.globalRecaptchaBlock.show(function (success, token) {
                                if (success) {
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
                        .subscribe(function (data) { }, function (err) { });
                };
                ApiClient.prototype.createContactRequest = function (id_or_login, callback, captchaToken) {
                    var self = this;
                    var url = config_1.Config.api_entry_point + "contacts/request";
                    var headers = new http_1.Headers({ 'token': this.sUserSession.token });
                    var body = {
                        id_or_login: id_or_login
                    };
                    var options = new http_1.RequestOptions({ headers: headers });
                    this.http.post(url, body, options)
                        .map(function (res) {
                        callback(200);
                    })
                        .catch(function (err) {
                        if (err.status === 460) {
                            self.sWindowManager.globalRecaptchaBlock.show(function (success, token) {
                                if (success) {
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
                        .subscribe(function (data) { }, function (err) { });
                };
                ApiClient.prototype.getRequests = function (type, //incoming or outgoing
                    callback, captchaToken) {
                    var self = this;
                    var url = config_1.Config.api_entry_point + "/contacts/requests/" + type;
                    var headers = new http_1.Headers({ 'token': this.sUserSession.token });
                    var options = new http_1.RequestOptions({ headers: headers });
                    this.http.get(url, options)
                        .map(function (res) {
                        var body = JSON.parse(res.text());
                        callback(body);
                    })
                        .catch(function (err) {
                        if (err.status === 460) {
                            self.sWindowManager.globalRecaptchaBlock.show(function (success, token) {
                                if (success) {
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
                        .subscribe(function (data) { }, function (err) { });
                };
                ApiClient.prototype.deleteContact = function (uid, captchaToken) {
                    var self = this;
                    var url = config_1.Config.api_entry_point + "contacts?uid=" + uid;
                    var headers = new http_1.Headers({ 'token': this.sUserSession.token });
                    var options = new http_1.RequestOptions({ headers: headers });
                    this.http.delete(url, options)
                        .map(function (res) {
                    })
                        .catch(function (err) {
                        if (err.status === 460) {
                            self.sWindowManager.globalRecaptchaBlock.show(function (success, token) {
                                if (success) {
                                    self.deleteContact(uid, token);
                                }
                            });
                            return;
                        }
                        console.log("Unable to execute delete contact request");
                        console.log(err);
                    })
                        .subscribe(function (data) { }, function (err) { });
                };
                ApiClient.prototype.deleteRequest = function (uid, isIncoming, captchaToken) {
                    var self = this;
                    var url = config_1.Config.api_entry_point + "contacts/request/" + (isIncoming ? "incoming" : "outgoing") + "/?uid=" + uid;
                    var headers = new http_1.Headers({ 'token': this.sUserSession.token });
                    var options = new http_1.RequestOptions({ headers: headers });
                    this.http.delete(url, options)
                        .map(function (res) {
                    })
                        .catch(function (err) {
                        if (err.status === 460) {
                            self.sWindowManager.globalRecaptchaBlock.show(function (success, token) {
                                if (success) {
                                    self.deleteRequest(uid, isIncoming, token);
                                }
                            });
                            return;
                        }
                        console.log("Unable to execute a delete_contact_request request");
                        console.log(err);
                    })
                        .subscribe(function (data) { }, function (err) { });
                };
                ApiClient.prototype.acceptRequest = function (uid, captchaToken) {
                    var self = this;
                    var url = config_1.Config.api_entry_point + "contacts/request?uid=" + uid;
                    var headers = new http_1.Headers({ 'token': this.sUserSession.token });
                    var options = new http_1.RequestOptions({ headers: headers });
                    this.http.patch(url, "", options)
                        .map(function (res) {
                    })
                        .catch(function (err) {
                        if (err.status === 460) {
                            self.sWindowManager.globalRecaptchaBlock.show(function (success, token) {
                                if (success) {
                                    self.acceptRequest(uid, token);
                                }
                            });
                            return;
                        }
                        console.log("Unable to execute a accept_contact_request request");
                        console.log(err);
                    })
                        .subscribe(function (data) { }, function (err) { });
                };
                ApiClient.prototype.getConversations = function (requestData, callback, captchaToken) {
                    var idsString = "";
                    var first = true;
                    requestData.conversations.forEach(function (conversation) {
                        if (first)
                            first = false;
                        else
                            idsString += ',';
                        idsString += conversation.id();
                    });
                    var self = this;
                    var myRegion = this.csMap[requestData.region];
                    if (!myRegion) {
                        console.error("Unable to locate target region");
                        return callback([]);
                    }
                    var myCs = myRegion[requestData.csName];
                    if (!myCs) {
                        console.error("Unable to locate target conversation server");
                        return callback([]);
                    }
                    var url = "https://" + myCs.host + ":" + myCs.port + "/conversations?conv_ids=" + idsString;
                    var headers = new http_1.Headers({ 'token': this.sUserSession.token });
                    var options = new http_1.RequestOptions({ headers: headers });
                    this.http.get(url, options)
                        .map(function (res) {
                        var body = JSON.parse(res.text());
                        body.map(function (conversation) {
                            var conv = Object.assign(new conversation_model_1.Conversation(self.sAlienCrypto), conversation);
                            conv.extConvId = new ext_conv_id_model_1.ExtConvId(requestData.region + '_' + requestData.csName + '_' + conversation.id);
                            conv.messages = self.sUserSession.buildMessages(conversation.messages);
                            conv.incrementalDecryption();
                            return conv;
                        });
                        callback(body);
                    })
                        .catch(function (err) {
                        if (err.status === 460) {
                            self.sWindowManager.globalRecaptchaBlock.show(function (success, token) {
                                if (success) {
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
                        .subscribe(function (data) { }, function (err) { });
                };
                ApiClient.prototype.sendMessage = function (body, conversation, callback, captchaToken) {
                    var self = this;
                    var myRegion = this.csMap[conversation.extConvId.region()];
                    if (!myRegion) {
                        console.error("Unable to locate target region");
                        return callback(-1);
                    }
                    var myCs = myRegion[conversation.extConvId.csName()];
                    if (!myCs) {
                        console.error("Unable to locate target conversation server");
                        return callback(-2);
                    }
                    var url = "https://" + myCs.host + ":" + myCs.port + "/messages?conv_id=" + conversation.extConvId.id();
                    var headers = new http_1.Headers({ 'token': this.sUserSession.token });
                    var options = new http_1.RequestOptions({ headers: headers });
                    this.http.post(url, body, options)
                        .map(function (res) {
                        callback(200);
                    })
                        .catch(function (err) {
                        if (err.status === 460) {
                            self.sWindowManager.globalRecaptchaBlock.show(function (success, token) {
                                if (success) {
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
                        .subscribe(function (data) { }, function (err) { });
                };
                ApiClient.prototype.getMessages = function (offset, count, conversation, callback, captchaToken) {
                    var self = this;
                    var myRegion = this.csMap[conversation.extConvId.region()];
                    if (!myRegion) {
                        console.error("Unable to locate the target region");
                        return callback(-1, []);
                    }
                    var myCs = myRegion[conversation.extConvId.csName()];
                    if (!myCs) {
                        console.error("Unable to locate the target conversation server");
                        return callback(-2, []);
                    }
                    var url = "https://" + myCs.host + ":" + myCs.port
                        + "/messages?conv_id=" + conversation.extConvId.id()
                        + "&offset=" + offset
                        + "&count=" + count;
                    var headers = new http_1.Headers({ 'token': this.sUserSession.token });
                    var options = new http_1.RequestOptions({ headers: headers });
                    this.http.get(url, options)
                        .map(function (res) {
                        var body = JSON.parse(res.text());
                        callback(200, self.sUserSession.buildMessages(body));
                    })
                        .catch(function (err) {
                        if (err.status === 460) {
                            self.sWindowManager.globalRecaptchaBlock.show(function (success, token) {
                                if (success)
                                    self.getMessages(offset, count, conversation, callback, token);
                                else
                                    callback(err.status, []);
                            });
                            return;
                        }
                        callback(err.status, []);
                    })
                        .subscribe(function (data) { }, function (err) { });
                };
                ApiClient.prototype.createConversation = function (body, callback, captchaToken) {
                    var self = this;
                    var url = config_1.Config.api_entry_point + "conversations";
                    var headers = new http_1.Headers({ 'token': this.sUserSession.token });
                    var _body = {
                        name: body.name,
                        participants: body.participants.map(function (userKeyPair) {
                            return {
                                ext_uid: userKeyPair.user.ext_uid.stringVal,
                                conv_key: userKeyPair.key
                            };
                        })
                    };
                    console.log(_body);
                    var options = new http_1.RequestOptions({ headers: headers });
                    this.http.post(url, _body, options)
                        .map(function (res) {
                        callback(200);
                    })
                        .catch(function (err) {
                        if (err.status === 460) {
                            self.sWindowManager.globalRecaptchaBlock.show(function (success, token) {
                                if (success) {
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
                        .subscribe(function (data) { }, function (err) { });
                };
                ApiClient.prototype.getPatches = function (callback, captchaToken) {
                    var self = this;
                    var url = config_1.Config.api_entry_point + "/patches";
                    var headers = new http_1.Headers({ 'token': this.sUserSession.token });
                    var options = new http_1.RequestOptions({ headers: headers });
                    this.http.get(url, options)
                        .map(function (res) {
                        var body = JSON.parse(res.text());
                        callback(200, body);
                    })
                        .catch(function (err) {
                        callback(err.status, null);
                    })
                        .subscribe(function (data) { }, function (err) { });
                };
                ApiClient.prototype.applyPatches = function (body, callback, captchaToken) {
                    var self = this;
                    var url = config_1.Config.api_entry_point + "/patches";
                    var headers = new http_1.Headers({ 'token': this.sUserSession.token });
                    var options = new http_1.RequestOptions({ headers: headers });
                    this.http.patch(url, body, options)
                        .map(function (res) {
                        var body = JSON.parse(res.text());
                        callback(200);
                    })
                        .catch(function (err) {
                        callback(err.status);
                    })
                        .subscribe(function (data) { }, function (err) { });
                };
                ApiClient.userInfoPossibleMembers = [
                    "email",
                    "first_name",
                    "last_name",
                    "birthday",
                    "avatar"
                ];
                ApiClient = __decorate([
                    core_1.Injectable(),
                    __param(1, core_1.Inject(session_service_1.UserSession)),
                    __param(2, core_1.Inject(alien_crypto_service_1.AlienCrypto)),
                    __param(3, core_1.Inject(cookie_manager_service_1.CookieManager)),
                    __param(4, core_1.Inject(window_mgr_service_1.WindowManager)),
                    __param(5, core_1.Inject(keyring_patcher_service_1.KeyringPatcher)),
                    __param(6, core_1.Inject(notification_listener_service_1.NotificationListener)), 
                    __metadata('design:paramtypes', [http_1.Http, session_service_1.UserSession, alien_crypto_service_1.AlienCrypto, cookie_manager_service_1.CookieManager, window_mgr_service_1.WindowManager, keyring_patcher_service_1.KeyringPatcher, notification_listener_service_1.NotificationListener])
                ], ApiClient);
                return ApiClient;
            }());
            exports_1("ApiClient", ApiClient);
        }
    }
});
//# sourceMappingURL=api_client.service.js.map
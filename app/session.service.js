System.register(['@angular/core', "./cookie_manager.service", "./models/user.model", "./helpers/object_array_to_string_array", "./models/conversation.model", "./models/ext_conv_id.model", 'rxjs/Observable', "./models/ext_uid.model", "./models/message.model", "./keyring_patcher.service", "./alien_crypto.service"], function(exports_1, context_1) {
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
    var core_1, cookie_manager_service_1, user_model_1, object_array_to_string_array_1, conversation_model_1, ext_conv_id_model_1, Observable_1, ext_uid_model_1, message_model_1, keyring_patcher_service_1, alien_crypto_service_1;
    var UsersFetchTask, UserSession;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (cookie_manager_service_1_1) {
                cookie_manager_service_1 = cookie_manager_service_1_1;
            },
            function (user_model_1_1) {
                user_model_1 = user_model_1_1;
            },
            function (object_array_to_string_array_1_1) {
                object_array_to_string_array_1 = object_array_to_string_array_1_1;
            },
            function (conversation_model_1_1) {
                conversation_model_1 = conversation_model_1_1;
            },
            function (ext_conv_id_model_1_1) {
                ext_conv_id_model_1 = ext_conv_id_model_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (ext_uid_model_1_1) {
                ext_uid_model_1 = ext_uid_model_1_1;
            },
            function (message_model_1_1) {
                message_model_1 = message_model_1_1;
            },
            function (keyring_patcher_service_1_1) {
                keyring_patcher_service_1 = keyring_patcher_service_1_1;
            },
            function (alien_crypto_service_1_1) {
                alien_crypto_service_1 = alien_crypto_service_1_1;
            }],
        execute: function() {
            UsersFetchTask = (function () {
                function UsersFetchTask() {
                }
                return UsersFetchTask;
            }());
            UserSession = (function () {
                function UserSession(sCookieManager, sKeyringPatcher, sAlienCrypto) {
                    this.sCookieManager = sCookieManager;
                    this.sKeyringPatcher = sKeyringPatcher;
                    this.sAlienCrypto = sAlienCrypto;
                    this.profile = new user_model_1.User();
                    this.incomingRequestsIds = [];
                    this.incomingRequests = {};
                    this.incomingRequestsUpdated = new core_1.EventEmitter();
                    this.outgoingRequestsIds = [];
                    this.outgoingRequests = {};
                    this.outgoingRequestsUpdated = new core_1.EventEmitter();
                    this.contact_ids = [];
                    this.users_ids = [];
                    this.users = {};
                    this.contacts = {};
                    this.contactsUpdated = new core_1.EventEmitter();
                    this.conversationIds = [];
                    this.conversations = [];
                    this.sNotificationListener = null;
                    this.pendingUsersFetchTasks = [];
                    this.fetchStarted = false;
                    this.conversationsResolveStarted = false;
                    this.isAuthorized = false;
                }
                UserSession.prototype.contactsArray = function () {
                    var res = [];
                    for (var key in this.contacts) {
                        res.push(this.contacts[key]);
                    }
                    return res;
                };
                UserSession.prototype.resolveUsersIncrementally = function (callback) {
                    var self = this;
                    var missingIds = [];
                    this.users_ids.forEach(function (contactId) {
                        if (!self.users[contactId])
                            missingIds.push(contactId);
                    });
                    if (missingIds.length == 0) {
                        callback();
                        return;
                    }
                    this.sApiClient.getUsers(missingIds, function (users) {
                        users.forEach(function (user) {
                            user.ext_uid = new ext_uid_model_1.ExtUid(user.ext_uid);
                            self.users[user.ext_uid.id()] = user;
                        });
                        callback();
                    });
                };
                UserSession.prototype.getUsers = function (ids, callback) {
                    if (ids && callback) {
                        var newTask = new UsersFetchTask();
                        newTask.ids = ids;
                        newTask.callback = callback;
                        this.pendingUsersFetchTasks.push(newTask);
                    }
                    if (!this.fetchStarted && this.pendingUsersFetchTasks.length > 0) {
                        this.fetchStarted = true;
                        var tasks_1 = this.pendingUsersFetchTasks;
                        this.pendingUsersFetchTasks = [];
                        var self_1 = this;
                        tasks_1.forEach(function (task) {
                            var ids = task.ids;
                            ids.forEach(function (id) {
                                var foundId = self_1.users_ids.filter(function (item) { return item === id; })[0];
                                if (!foundId)
                                    self_1.users_ids.push(id);
                            });
                        });
                        this.resolveUsersIncrementally(function () {
                            tasks_1.forEach(function (task) {
                                var ids = task.ids;
                                var fetchedUsers = [];
                                ids.forEach(function (id) {
                                    var foundUser = self_1.users[id];
                                    if (foundUser)
                                        fetchedUsers.push(foundUser);
                                });
                                task.callback(fetchedUsers);
                            });
                            self_1.fetchStarted = false;
                            self_1.getUsers();
                        });
                    }
                };
                UserSession.prototype.resolveIdsIncrementally = function (ids_array, target_array_name, finish_callback) {
                    var self = this;
                    ids_array.forEach(function (contact_id) {
                        var found = false;
                        self.users_ids.forEach(function (user_id) {
                            if (contact_id === user_id) {
                                found = true;
                            }
                        });
                        if (!found) {
                            self.users_ids.push(contact_id);
                        }
                    });
                    this.resolveUsersIncrementally(function () {
                        self[target_array_name] = [];
                        ids_array.forEach(function (contact_id) {
                            self[target_array_name][contact_id] = self.users[contact_id];
                        });
                        finish_callback();
                    });
                };
                UserSession.prototype.resolveContactsIncrementally = function () {
                    var self = this;
                    this.resolveIdsIncrementally(this.contact_ids, "contacts", function () {
                        self.contactsUpdated.emit();
                    });
                };
                UserSession.prototype.resolveIncomingRequestsIncrementally = function () {
                    var self = this;
                    this.resolveIdsIncrementally(this.incomingRequestsIds, "incomingRequests", function () {
                        self.incomingRequestsUpdated.emit();
                    });
                };
                UserSession.prototype.resolveOutgoingRequestsIncrementally = function () {
                    var self = this;
                    this.resolveIdsIncrementally(this.outgoingRequestsIds, "outgoingRequests", function () {
                        self.outgoingRequestsUpdated.emit();
                    });
                };
                UserSession.prototype.saveTokenInCookies = function () {
                    this.sCookieManager.setCookie("t", this.token, 30, "s");
                };
                UserSession.prototype.loadTokenFromCookies = function () {
                    this.token = this.sCookieManager.getCookie("t");
                };
                UserSession.prototype.logOut = function () {
                    this.sCookieManager.deleteCookie("mk");
                    this.sCookieManager.deleteCookie("t");
                    this.isAuthorized = false;
                };
                UserSession.prototype.fetchRequests = function () {
                    console.log("fs");
                    var self = this;
                    this.sApiClient.getRequests("outgoing", function (request_array) {
                        self.outgoingRequestsIds = object_array_to_string_array_1.object_array_to_string_array(request_array, "requestee");
                        self.resolveOutgoingRequestsIncrementally();
                    });
                    this.sApiClient.getRequests("incoming", function (request_array) {
                        self.incomingRequestsIds = object_array_to_string_array_1.object_array_to_string_array(request_array, "requester");
                        self.resolveIncomingRequestsIncrementally();
                    });
                };
                UserSession.prototype.initNotificationHandlers = function () {
                    var self = this;
                    this.sNotificationListener.subscribe("contact_deleted", function (data) {
                        var index = self.contact_ids.indexOf(data.uid);
                        if (index == -1)
                            return;
                        self.contact_ids.splice(index, 1);
                        self.resolveContactsIncrementally();
                    });
                    this.sNotificationListener.subscribe("new_incoming_contact_request", function (data) {
                        var index = self.incomingRequestsIds.indexOf(data.uid);
                        if (index == -1)
                            self.incomingRequestsIds.push(data.uid);
                        self.resolveIncomingRequestsIncrementally();
                    });
                    this.sNotificationListener.subscribe("new_outgoing_contact_request", function (data) {
                        var index = self.outgoingRequestsIds.indexOf(data.uid);
                        if (index == -1)
                            self.outgoingRequestsIds.push(data.uid);
                        console.log(self.outgoingRequestsIds);
                        self.resolveOutgoingRequestsIncrementally();
                    });
                    this.sNotificationListener.subscribe("incoming_request_deleted", function (data) {
                        var index = self.incomingRequestsIds.indexOf(data.uid);
                        if (index == -1)
                            return;
                        self.incomingRequestsIds.splice(index, 1);
                        self.resolveIncomingRequestsIncrementally();
                    });
                    this.sNotificationListener.subscribe("outgoing_request_deleted", function (data) {
                        var index = self.outgoingRequestsIds.indexOf(data.uid);
                        if (index == -1)
                            return;
                        self.outgoingRequestsIds.splice(index, 1);
                        self.resolveOutgoingRequestsIncrementally();
                    });
                    this.sNotificationListener.subscribe("incoming_request_accepted", function (data) {
                        var index = self.incomingRequestsIds.indexOf(data.uid);
                        if (index == -1)
                            return;
                        var c_index = self.contact_ids.indexOf(data.uid);
                        if (c_index == -1)
                            self.contact_ids.push(data.uid);
                        self.incomingRequestsIds.splice(index, 1);
                        self.resolveIncomingRequestsIncrementally();
                        self.resolveContactsIncrementally();
                    });
                    this.sNotificationListener.subscribe("outgoing_request_accepted", function (data) {
                        var index = self.outgoingRequestsIds.indexOf(data.uid);
                        if (index == -1)
                            return;
                        var c_index = self.contact_ids.indexOf(data.uid);
                        if (c_index == -1)
                            self.contact_ids.push(data.uid);
                        self.outgoingRequestsIds.splice(index, 1);
                        self.resolveOutgoingRequestsIncrementally();
                        self.resolveContactsIncrementally();
                    });
                    this.sNotificationListener.subscribe("new_message", function (data) {
                        var targetConversation = self.conversations.filter(function (item) { return item.extConvId.id() == data.conv_id; })[0];
                        if (!targetConversation)
                            return console.error("Impossible: unable to found" +
                                " the target conversation for new message!");
                        targetConversation.insertMessages(self.buildMessages([data.message]));
                    });
                    this.sNotificationListener.subscribe("new_conversation", function (data) {
                        self.conversationIds.push(data.conv_id);
                        self.resolveConversationsIncrementally(function () {
                        });
                    });
                    this.sNotificationListener.subscribe("patch_available", function (data) {
                        self.sKeyringPatcher.beginPatching();
                    });
                    this.sNotificationListener.subscribe("keyring_update", function (data) {
                        self.sAlienCrypto.decryptKeyring(data.keyring);
                    });
                };
                UserSession.prototype.resolveConversationsIncrementally = function (callback) {
                    var self = this;
                    var missingIds = [];
                    this.conversationIds.forEach(function (conversationId) {
                        if (!self.conversations.filter(function (item) { return item.extConvId.stringVal === conversationId; })[0])
                            missingIds.push(conversationId);
                    });
                    if (missingIds.length == 0) {
                        callback();
                        return;
                    }
                    var servers = [];
                    //Group by servers
                    missingIds.forEach(function (extConvId) {
                        var newConversation = new conversation_model_1.Conversation(self.sAlienCrypto);
                        newConversation.extConvId = new ext_conv_id_model_1.ExtConvId(extConvId);
                        self.conversations.push(newConversation);
                        var targetServer = servers.filter(function (item) { return (item.region === newConversation.extConvId.region()) &&
                            (item.csName === newConversation.extConvId.csName()); })[0];
                        if (!targetServer) {
                            targetServer = {
                                region: newConversation.extConvId.region(),
                                csName: newConversation.extConvId.csName(),
                                conversations: []
                            };
                            servers.push(targetServer);
                        }
                        targetServer.conversations.push(newConversation.extConvId);
                    });
                    Observable_1.Observable.forkJoin(servers.map(function (server) {
                        return new Observable_1.Observable(function (observer) {
                            self.sApiClient.getConversations(server, function (convArray) {
                                convArray.forEach(function (currentConv) {
                                    var foundConversations = self.conversations.filter(function (item) { return item.extConvId.id() === currentConv.id; });
                                    var myConv = foundConversations[0];
                                    if (myConv) {
                                        currentConv.messages.forEach(function (message) {
                                            myConv.insertMessages([Object.assign(new message_model_1.Message(), message)]);
                                        });
                                        myConv.name = currentConv.name;
                                    }
                                });
                                observer.next(convArray);
                                observer.complete();
                            });
                        });
                    }))
                        .subscribe(function (t) {
                        callback();
                    });
                };
                UserSession.prototype.csMapReady = function () {
                    var _this = this;
                    if (!this.conversationsResolveStarted && this.isAuthorized) {
                        this.conversationsResolveStarted = true;
                        this.resolveConversationsIncrementally(function () { return _this.onConversationsFetched(); });
                    }
                };
                UserSession.prototype.onAuthorized = function () {
                    var _this = this;
                    if (!this.conversationsResolveStarted && this.sApiClient.isCsMapFetched) {
                        this.conversationsResolveStarted = true;
                        this.resolveConversationsIncrementally(function () { return _this.onConversationsFetched(); });
                    }
                };
                UserSession.prototype.onConversationsFetched = function () {
                    console.log("Every conversation has been fetched successfully!");
                    console.log(this.conversations);
                };
                UserSession.prototype.buildMessages = function (response) {
                    var self = this;
                    response = response.map(function (message) {
                        var assignedMessage = Object.assign(new message_model_1.Message(), message);
                        //Fetch sender info
                        if (assignedMessage.sender) {
                            var senderExtUid = new ext_uid_model_1.ExtUid(assignedMessage.sender);
                            self.getUsers([senderExtUid.id()], function (users) {
                                assignedMessage.sender = users[0];
                            });
                        }
                        //Fetch extra information for system messages
                        if (assignedMessage.type === 0) {
                            //Fetch participants if required
                            if (assignedMessage.data.participants) {
                                var participantsIds = assignedMessage.data.participants.map(function (participant) {
                                    return (new ext_uid_model_1.ExtUid(participant)).id();
                                });
                                self.getUsers(participantsIds, function (users) {
                                    assignedMessage.data.fetched_participants = users;
                                });
                            }
                        }
                        return assignedMessage;
                    });
                    return response;
                };
                UserSession = __decorate([
                    core_1.Injectable(),
                    __param(0, core_1.Inject(cookie_manager_service_1.CookieManager)),
                    __param(1, core_1.Inject(keyring_patcher_service_1.KeyringPatcher)),
                    __param(2, core_1.Inject(alien_crypto_service_1.AlienCrypto)), 
                    __metadata('design:paramtypes', [cookie_manager_service_1.CookieManager, keyring_patcher_service_1.KeyringPatcher, alien_crypto_service_1.AlienCrypto])
                ], UserSession);
                return UserSession;
            }());
            exports_1("UserSession", UserSession);
        }
    }
});
//# sourceMappingURL=session.service.js.map
import {Injectable, Inject, OnInit, EventEmitter} from '@angular/core'
import {CookieManager} from "./cookie_manager.service";
import {UserInfo} from "./models/user_info.model";
import {User} from "./models/user.model";
import {ApiClient} from "./api_client.service";
import {object_array_to_string_array} from "./helpers/object_array_to_string_array";
import {NotificationListener} from "./notification_listener.service";
import {Conversation} from "./models/conversation.model";
import {ExtConvId} from "./models/ext_conv_id.model";
import {Observable} from 'rxjs/Observable'
import {ExtUid} from "./models/ext_uid.model";
import {Message} from "./models/message.model";
import {KeyringPatcher} from "./keyring_patcher.service";
import {AlienCrypto} from "./alien_crypto.service";

declare var aesjs: any;

type ResolveUsersCallback = () => any;
type GetUsersCallback = (users: User[]) => any;

class UsersFetchTask {
    public ids: string[];
    callback: GetUsersCallback;
}

@Injectable()
export class UserSession {
    public isAuthorized: boolean;
    public profile: User = new User();

    token : string;
    accId: string;
    region: string;

    incomingRequestsIds: string[] = [];
    incomingRequests: { [key: string]: User } = {};
    incomingRequestsUpdated: EventEmitter<void> = new EventEmitter<void>();

    outgoingRequestsIds: string[] = [];
    outgoingRequests: { [key: string]: User } = {};
    outgoingRequestsUpdated: EventEmitter<void> = new EventEmitter<void>();

    contact_ids: string[] = [];
    users_ids: string[] = [];

    users: { [key: string]: User } = {};

    contacts: { [key: string]: User } = {};
    contactsUpdated: EventEmitter<void> = new EventEmitter<void>();

    public contactsArray(): User[] {
        let res: User[] = [];
        for(let key in this.contacts) {
            res.push(this.contacts[key]);
        }
        return res;
    }

    sApiClient: ApiClient;

    conversationIds: string[] = [];
    conversations: Conversation[] = [];

    sNotificationListener: NotificationListener = null;
    constructor(@Inject(CookieManager) private sCookieManager: CookieManager,
                @Inject(KeyringPatcher) private sKeyringPatcher: KeyringPatcher,
                @Inject(AlienCrypto) private sAlienCrypto: AlienCrypto) {
        this.isAuthorized = false;
    }

    public resolveUsersIncrementally(callback: ResolveUsersCallback) {
        var self = this;
        var missingIds: string[] = [];
        this.users_ids.forEach(function (contactId) {
            if(!self.users[contactId])
                missingIds.push(contactId);
        });

        if(missingIds.length == 0) {
            callback();
            return;
        }

        this.sApiClient.getUsers(missingIds, function (users: any[]) {
            users.forEach(function (user) {
                user.ext_uid = new ExtUid(user.ext_uid);
                self.users[user.ext_uid.id()] = user;
            });
            callback();
        });
    }

    private pendingUsersFetchTasks: UsersFetchTask[] = [];
    private fetchStarted: boolean = false;
    public getUsers(ids?: string[], callback?: GetUsersCallback) {
        if(ids && callback) {
            let newTask: UsersFetchTask = new UsersFetchTask();
            newTask.ids = ids;
            newTask.callback = callback;
            this.pendingUsersFetchTasks.push(newTask);
        }

        if(!this.fetchStarted && this.pendingUsersFetchTasks.length > 0) {
            this.fetchStarted = true;
            let tasks = this.pendingUsersFetchTasks;
            this.pendingUsersFetchTasks = [];

            const self = this;
            tasks.forEach(function (task) {
                let ids: string[] = task.ids;
                ids.forEach(function (id) {
                   let foundId = self.users_ids.filter((item) => item === id)[0];
                   if(!foundId)
                       self.users_ids.push(id);
                });
            });

            this.resolveUsersIncrementally(function () {
                tasks.forEach(function (task) {
                    let ids: string[] = task.ids;
                    let fetchedUsers: User[] = [];
                    ids.forEach(function (id) {
                        let foundUser = self.users[id];
                        if(foundUser)
                            fetchedUsers.push(foundUser);
                    });
                    task.callback(fetchedUsers);
                });

                self.fetchStarted = false;
                self.getUsers();
            });
        }
    }

    public resolveIdsIncrementally(ids_array: any, target_array_name: string, finish_callback: any) {
        var self = this;
        ids_array.forEach(function (contact_id: string) {
            var found = false;
            self.users_ids.forEach(function (user_id: string) {
                if(contact_id === user_id) {
                    found = true;
                }
            });
            if(!found) {
                self.users_ids.push(contact_id);
            }
        });
        this.resolveUsersIncrementally(function () {
            self[target_array_name] = [];
            ids_array.forEach(function(contact_id: string) {
                self[target_array_name][contact_id] = self.users[contact_id];
            });
            finish_callback();
        });
    }

    public resolveContactsIncrementally() {
        var self = this;
        this.resolveIdsIncrementally(this.contact_ids, "contacts", function () {
            self.contactsUpdated.emit();
        })
    }

    public resolveIncomingRequestsIncrementally() {
        var self = this;
        this.resolveIdsIncrementally(this.incomingRequestsIds, "incomingRequests", function () {
            self.incomingRequestsUpdated.emit();
        })
    }

    public resolveOutgoingRequestsIncrementally() {
        var self = this;
        this.resolveIdsIncrementally(this.outgoingRequestsIds, "outgoingRequests", function () {
            self.outgoingRequestsUpdated.emit();
        })
    }

    public saveTokenInCookies(): void {
        this.sCookieManager.setCookie("t", this.token, 30, "s");
    }

    public loadTokenFromCookies(): void {
        this.token = this.sCookieManager.getCookie("t");
    }

    public logOut() {
        this.sCookieManager.deleteCookie("mk");
        this.sCookieManager.deleteCookie("t");
        this.isAuthorized = false;
    }

    public fetchRequests() {
        console.log("fs");
        var self = this;
        this.sApiClient.getRequests("outgoing", function (request_array: any[]) {
            self.outgoingRequestsIds = object_array_to_string_array(request_array, "requestee");
            self.resolveOutgoingRequestsIncrementally();
        });
        this.sApiClient.getRequests("incoming", function (request_array: any[]) {
            self.incomingRequestsIds = object_array_to_string_array(request_array, "requester");
            self.resolveIncomingRequestsIncrementally();
        });
    }

    public initNotificationHandlers() {
        var self = this;
        this.sNotificationListener.subscribe("contact_deleted", function (data) {
            var index = self.contact_ids.indexOf(data.uid);
            if(index == -1)
                return;

            self.contact_ids.splice(index, 1);
            self.resolveContactsIncrementally();
        });

        this.sNotificationListener.subscribe("new_incoming_contact_request", function (data) {
            var index = self.incomingRequestsIds.indexOf(data.uid);
            if(index == -1)
                self.incomingRequestsIds.push(data.uid);

            self.resolveIncomingRequestsIncrementally();
        });

        this.sNotificationListener.subscribe("new_outgoing_contact_request", function (data) {
            var index = self.outgoingRequestsIds.indexOf(data.uid);
            if(index == -1)
                self.outgoingRequestsIds.push(data.uid);
            console.log(self.outgoingRequestsIds);

            self.resolveOutgoingRequestsIncrementally();
        });

        this.sNotificationListener.subscribe("incoming_request_deleted", function (data) {
            var index = self.incomingRequestsIds.indexOf(data.uid);
            if(index == -1)
                return;

            self.incomingRequestsIds.splice(index, 1);
            self.resolveIncomingRequestsIncrementally();
        });

        this.sNotificationListener.subscribe("outgoing_request_deleted", function (data) {
            var index = self.outgoingRequestsIds.indexOf(data.uid);
            if(index == -1)
                return;

            self.outgoingRequestsIds.splice(index, 1);
            self.resolveOutgoingRequestsIncrementally();
        });

        this.sNotificationListener.subscribe("incoming_request_accepted", function (data) {
            var index = self.incomingRequestsIds.indexOf(data.uid);
            if(index == -1)
                return;

            var c_index = self.contact_ids.indexOf(data.uid);
            if(c_index == -1)
                self.contact_ids.push(data.uid);

            self.incomingRequestsIds.splice(index, 1);
            self.resolveIncomingRequestsIncrementally();
            self.resolveContactsIncrementally();
        });

        this.sNotificationListener.subscribe("outgoing_request_accepted", function (data) {
            var index = self.outgoingRequestsIds.indexOf(data.uid);
            if(index == -1)
                return;

            var c_index = self.contact_ids.indexOf(data.uid);
            if(c_index == -1)
                self.contact_ids.push(data.uid);

            self.outgoingRequestsIds.splice(index, 1);
            self.resolveOutgoingRequestsIncrementally();
            self.resolveContactsIncrementally();
        });

        this.sNotificationListener.subscribe("new_message", function (data) {
            let targetConversation = self.conversations.filter((item) => item.extConvId.id() == data.conv_id)[0];
            if(!targetConversation)
                return console.error("Impossible: unable to found" +
                    " the target conversation for new message!");
            targetConversation.insertMessages(self.buildMessages([data.message]));
        });

        this.sNotificationListener.subscribe("new_conversation", function (data: any) {
            self.conversationIds.push(data.conv_id);
            self.resolveConversationsIncrementally(function () {

            });
        });

        this.sNotificationListener.subscribe("patch_available", function (data: any) {
            self.sKeyringPatcher.beginPatching();
        });

        this.sNotificationListener.subscribe("keyring_update", function (data: any) {
            self.sAlienCrypto.decryptKeyring(data.keyring);
        });
    }

    private resolveConversationsIncrementally(callback: any) {
        var self = this;
        var missingIds: string[] = [];
        this.conversationIds.forEach(function (conversationId) {
            if(!self.conversations.filter(item => item.extConvId.stringVal === conversationId)[0])
                missingIds.push(conversationId);
        });

        if(missingIds.length == 0) {
            callback();
            return;
        }

        let servers: any[] = [];

        //Group by servers
        missingIds.forEach(function (extConvId) {
            let newConversation: Conversation = new Conversation(self.sAlienCrypto);
            newConversation.extConvId = new ExtConvId(extConvId);
            self.conversations.push(newConversation);
            let targetServer = servers.filter((item) => (item.region === newConversation.extConvId.region()) &&
                (item.csName === newConversation.extConvId.csName()))[0];
            if(!targetServer) {
                targetServer = {
                    region: newConversation.extConvId.region(),
                    csName: newConversation.extConvId.csName(),
                    conversations: []
                };
                servers.push(targetServer);
            }
            targetServer.conversations.push(newConversation.extConvId);
        });

        Observable.forkJoin(servers.map(function (server) {
            return new Observable(function(observer: any) {
                self.sApiClient.getConversations(server, function (convArray) {
                    convArray.forEach(function (currentConv: any) {
                        const foundConversations = self.conversations.filter(item => item.extConvId.id() === currentConv.id);
                        let myConv = foundConversations[0];
                        if(myConv) {
                            currentConv.messages.forEach(function (message: any) {
                                myConv.insertMessages([Object.assign(new Message(), message)]);
                            });
                            myConv.name = currentConv.name;
                        }
                    });
                    observer.next(convArray);
                    observer.complete();
                });
            })
        }))
        .subscribe(t => {
            callback();
        });
    }

    private conversationsResolveStarted: boolean = false;

    public csMapReady() {
        if(!this.conversationsResolveStarted && this.isAuthorized) {
            this.conversationsResolveStarted = true;
            this.resolveConversationsIncrementally(() => this.onConversationsFetched());
        }
    }

    public onAuthorized() {
        if(!this.conversationsResolveStarted && this.sApiClient.isCsMapFetched) {
            this.conversationsResolveStarted = true;
            this.resolveConversationsIncrementally(() => this.onConversationsFetched());
        }
    }

    public onConversationsFetched() {
        console.log("Every conversation has been fetched successfully!");
        console.log(this.conversations);
    }

    public buildMessages(response: any[]): Message[] {
        var self = this;

        response = response.map(function (message: any) {
            let assignedMessage: Message = Object.assign(new Message(), message);

            //Fetch sender info
            if(assignedMessage.sender) {
                let senderExtUid: ExtUid =  new ExtUid((<any>assignedMessage).sender);
                self.getUsers([senderExtUid.id()], function (users: User[]) {
                    assignedMessage.sender = users[0];
                })
            }

            //Fetch extra information for system messages
            if(assignedMessage.type === 0) {
                //Fetch participants if required
                if(assignedMessage.data.participants) {

                    let participantsIds = assignedMessage.data.participants.map(function (participant) {
                        return (new ExtUid(participant)).id();
                    });

                    self.getUsers(participantsIds, function (users: User[]) {
                        assignedMessage.data.fetched_participants = users;
                    })
                }
            }

            return assignedMessage;
        });

        return <Message[]>response;
    }
}
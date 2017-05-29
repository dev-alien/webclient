System.register(['@angular/core', "@angular/http", "./session.service"], function(exports_1, context_1) {
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
    var core_1, http_1, session_service_1;
    var NSConnection, ServerNotification, NotificationListener;
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
            }],
        execute: function() {
            NSConnection = (function () {
                function NSConnection(listener, host, port, token) {
                    this.listener = listener;
                    this.host = host;
                    this.port = port;
                    this.token = token;
                    this.timerStarted = false;
                    var url = "wss://" + host + ":" + port + "/sub?token=" + token;
                    console.log("Connecting to " + url + " notification server");
                    this.socket = new WebSocket(url);
                    this.socket.onmessage = function (ev) {
                        var data;
                        try {
                            data = JSON.parse(ev.data);
                        }
                        catch (e) {
                            console.log("Unable to parse incoming event");
                            console.log(ev);
                            return;
                        }
                        if (!data['type']) {
                            console.log("The event hasn't type property!");
                            return console.log(ev);
                        }
                        console.log(ev);
                        listener.serverNotificationEmitter.emit(new ServerNotification(data['type'], data['data']));
                    };
                    /*
                    alert("connect");
                    this.socket.onopen = function() {
                        alert("open");
                    };
                    this.socket.onerror = function() {
                        alert("err");
                    };
                    this.socket.onclose = function() {
                        alert("close");
                    };
                    */
                }
                NSConnection.prototype.startDisconnectTimer = function (connections, deadLine) {
                    var self = this;
                    if (!this.timerStarted) {
                        this.timerStarted = true;
                        setTimeout(function () {
                            self.listener.removeConnectionFromList(self);
                            self.socket.close();
                        }, deadLine * 1000);
                    }
                };
                return NSConnection;
            }());
            exports_1("NSConnection", NSConnection);
            ServerNotification = (function () {
                function ServerNotification(name, data) {
                    this.type = name;
                    this.data = data;
                }
                return ServerNotification;
            }());
            exports_1("ServerNotification", ServerNotification);
            NotificationListener = (function () {
                function NotificationListener(http, sUserSession) {
                    this.http = http;
                    this.sUserSession = sUserSession;
                    this.backed_map_path = "https://api.alien.pm/static/pub_backend_map.json";
                    this.resolveTimeout = 30000;
                    this.connections = [];
                    this.serverNotificationEmitter = new core_1.EventEmitter();
                    sUserSession.sNotificationListener = this;
                }
                NotificationListener.prototype.findConnection = function (host, port) {
                    var res = null;
                    this.connections.forEach(function (conn) {
                        if ((conn.host === host) && (conn.port === port))
                            res = conn;
                    });
                    return res;
                };
                NotificationListener.prototype.removeConnectionFromList = function (conn) {
                    for (var index = 0; index < this.connections.length; ++index) {
                        var currConnection = this.connections[index];
                        if ((currConnection.host === conn.host) && (currConnection.port === conn.port)) {
                            this.connections.splice(index, 1);
                        }
                    }
                };
                NotificationListener.prototype.subscribe = function (evname, callback) {
                    this.serverNotificationEmitter.subscribe(function (ev) {
                        if (ev.type == evname) {
                            callback(ev.data);
                        }
                    });
                };
                NotificationListener.prototype.offsetFromAccId = function (accId) {
                    var offset = 0;
                    var index = accId.length - 1;
                    var character = 0;
                    while ((index >= 0) && character < 4) {
                        var c = accId.charCodeAt(index);
                        var val = 0;
                        if ((c >= 'a'.charCodeAt(0)) && (c <= 'z'.charCodeAt(0)))
                            val = c - 'a'.charCodeAt(0);
                        if ((c >= '0'.charCodeAt(0)) && (c <= '9'.charCodeAt(0)))
                            val = c - '0'.charCodeAt(0) + ('z'.charCodeAt(0) - 'a'.charCodeAt(0)) + 1;
                        offset += val * Math.pow(36, character);
                        --index;
                        ++character;
                    }
                    return offset;
                };
                NotificationListener.prototype.endPointFromMap = function (configuration, accId, region) {
                    var nBuckets = configuration['buckets'];
                    var regions = configuration['regions'];
                    var myBucket = this.offsetFromAccId(accId) % nBuckets;
                    var myRegion;
                    regions.forEach(function (r) {
                        if (r.name == region)
                            myRegion = r;
                    });
                    var servers = myRegion['servers'];
                    var totalWeight = 0.0;
                    servers.forEach(function (server) {
                        totalWeight += server.weight;
                    });
                    var bucketWidth = totalWeight / nBuckets;
                    var point = bucketWidth * myBucket;
                    var currDist = 0.0;
                    var myServer;
                    servers.forEach(function (s) {
                        var serverLimit = s.weight + currDist;
                        if ((point >= currDist) && (point < serverLimit))
                            myServer = s;
                        currDist += s.weight;
                    });
                    return myServer;
                };
                NotificationListener.prototype.removeFromConnectioList = function (conn) {
                    var index = this.connections.indexOf(conn);
                    if (index > -1) {
                        this.connections.splice(index, 1);
                        console.log("removed");
                    }
                    else {
                        console.log("remove error");
                    }
                };
                NotificationListener.prototype.updateConfig = function (backendMap) {
                    console.log("update");
                    var self = this;
                    var token = this.sUserSession.token;
                    var n_server = this.endPointFromMap(backendMap.n, token, this.sUserSession.profile.ext_uid.region());
                    if (backendMap.o) {
                        var o_server = this.endPointFromMap(backendMap.o, token, this.sUserSession.profile.ext_uid.region());
                        if ((o_server.host == n_server.host) && ((o_server.port == n_server.port))) {
                            return;
                        }
                        this.connections.forEach(function (conn) {
                            if (!((conn.host == o_server.host) && (conn.port == o_server.port)) &&
                                !((conn.host == n_server.host) && (conn.port == n_server.port))) {
                                console.log("force remove");
                                conn.startDisconnectTimer(this.connections, 0);
                                self.removeFromConnectioList(conn);
                            }
                        });
                        var old_conn = this.findConnection(o_server.host, o_server.port);
                        if (old_conn) {
                            old_conn.startDisconnectTimer(this.connections, 60);
                        }
                        else {
                            var newConn = new NSConnection(this, o_server.host, o_server.port, token);
                            newConn.startDisconnectTimer(this.connections, 60);
                            this.connections.push(newConn);
                        }
                    }
                    else {
                        this.connections.forEach(function (conn) {
                            if (!((conn.host == n_server.host) && (conn.port == n_server.port))) {
                                console.log("force remove");
                                conn.startDisconnectTimer(this.connections, 0);
                                self.removeFromConnectioList(conn);
                            }
                        });
                    }
                    if (!this.findConnection(n_server.host, n_server.port)) {
                        var newConn = new NSConnection(this, n_server.host, n_server.port, token);
                        this.connections.push(newConn);
                    }
                };
                NotificationListener.prototype.resolveConfig = function () {
                    var _this = this;
                    var self = this;
                    this.http.get(this.backed_map_path)
                        .map(function (res) {
                        self.updateConfig(JSON.parse(res.text()));
                        setTimeout(function () {
                            self.resolveConfig();
                        }, _this.resolveTimeout);
                    })
                        .catch(function (err) {
                        setTimeout(function () {
                            self.resolveConfig();
                        }, _this.resolveTimeout);
                    })
                        .subscribe(function (data) { }, function (err) { });
                };
                NotificationListener.prototype.start = function () {
                    console.log("[i] Notification listener started!");
                    this.resolveConfig();
                };
                NotificationListener = __decorate([
                    core_1.Injectable(),
                    __param(1, core_1.Inject(session_service_1.UserSession)), 
                    __metadata('design:paramtypes', [http_1.Http, session_service_1.UserSession])
                ], NotificationListener);
                return NotificationListener;
            }());
            exports_1("NotificationListener", NotificationListener);
        }
    }
});
//# sourceMappingURL=notification_listener.service.js.map
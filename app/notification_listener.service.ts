import {Injectable, Inject, OnInit, EventEmitter} from '@angular/core'
import {Connection, Http, Response} from "@angular/http";
import {UserSession} from "./session.service";

declare var aesjs: any;

export type NotificationHandler = (ev: MessageEvent) => any;

export class NSConnection {
    private socket: WebSocket;
    private timerStarted: boolean = false;

    constructor(private listener: NotificationListener,
                public host: string,
                public port: number,
                private token: string) {
        var url = "wss://"+host+":"+port+"/sub?token="+token;
        console.log("Connecting to " + url + " notification server");
        this.socket = new WebSocket(url);
        this.socket.onmessage = function(ev: MessageEvent): any {
            var data: any;
            try {
                data = JSON.parse(ev.data);
            }
            catch (e) {
                console.log("Unable to parse incoming event");
                console.log(ev);
                return;
            }

            if(!data['type']) {
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

    public startDisconnectTimer(connections: NSConnection[], deadLine: number) {
        var self = this;
        if(!this.timerStarted) {
            this.timerStarted = true;
            setTimeout(function () {
                self.listener.removeConnectionFromList(self);
                self.socket.close();
            }, deadLine*1000);
        }
    }
}

export class ServerNotification {
    public type: string;
    public data: any;
    constructor(name: string, data: any) {
        this.type = name;
        this.data = data;
    }
}

declare type ServerNotificationCallback = (data: any)=>void;

@Injectable()
export class NotificationListener {
    backed_map_path: string = "https://api.alien.pm/static/pub_backend_map.json";
    private resolveTimeout: number = 30000;
    socket: WebSocket;
    private connections: NSConnection[] = [];

    private findConnection(host: string, port: number): NSConnection {
        var res: NSConnection = null;
        this.connections.forEach(function(conn: NSConnection) {
            if((conn.host === host) && (conn.port === port))
                res = conn;
        });
        return res;
    }

    removeConnectionFromList(conn: NSConnection): void {
        for(var index = 0; index < this.connections.length; ++index) {
            var currConnection = this.connections[index];
            if((currConnection.host === conn.host) && (currConnection.port === conn.port)) {
                this.connections.splice(index, 1);
            }
        }
    }

    public serverNotificationEmitter: EventEmitter<ServerNotification>;
    public subscribe(evname: string, callback: ServerNotificationCallback) {
        this.serverNotificationEmitter.subscribe(function(ev: ServerNotification) {
            if(ev.type == evname) {
                callback(ev.data);
            }
        });
    }

    private offsetFromAccId(accId: string): number {
        var offset: number = 0;
        var index = accId.length - 1;
        var character = 0;

        while((index >= 0) && character < 4)
        {
            var c: number = accId.charCodeAt(index);
            var val: number = 0;
            if((c >= 'a'.charCodeAt(0)) && (c <= 'z'.charCodeAt(0)))
                val = c - 'a'.charCodeAt(0);
            if((c >= '0'.charCodeAt(0)) && (c <= '9'.charCodeAt(0)))
                val = c - '0'.charCodeAt(0) + ('z'.charCodeAt(0) - 'a'.charCodeAt(0)) + 1;
            offset += val*Math.pow(36, character);
            --index;
            ++character;
        }
        return offset;
    }

    private endPointFromMap(configuration: any, accId: string, region: string)  {
        var nBuckets = configuration['buckets'];
        var regions = configuration['regions'];
        var myBucket = this.offsetFromAccId(accId) % nBuckets;

        var myRegion: any;
        regions.forEach(function (r: any) {
            if(r.name == region)
                myRegion = r;
        });
        var servers = myRegion['servers'];

        var totalWeight: number = 0.0;

        servers.forEach(function (server: any) {
            totalWeight += server.weight;
        });

        var bucketWidth = totalWeight / nBuckets;
        var point: number = bucketWidth * myBucket;

        var currDist: number = 0.0;
        var myServer: any;

        servers.forEach(function (s: any) {
            var serverLimit = s.weight + currDist;

            if((point >= currDist) && (point < serverLimit))
                myServer = s;

            currDist += s.weight;
        });
        return myServer;
    }

    private removeFromConnectioList(conn: any) {
        var index = this.connections.indexOf(conn);
        if (index > -1) {
            this.connections.splice(index, 1);
            console.log("removed");
        } else {
            console.log("remove error");
        }
    }

    private updateConfig(backendMap: any): void {
        console.log("update");

        var self = this;

        var token = this.sUserSession.token;

        var n_server = this.endPointFromMap(backendMap.n, token, this.sUserSession.profile.ext_uid.region());
        if(backendMap.o) {
            var o_server = this.endPointFromMap(backendMap.o, token, this.sUserSession.profile.ext_uid.region());

            if((o_server.host == n_server.host) && ((o_server.port == n_server.port))) {
                return;
            }

            this.connections.forEach(function (conn: NSConnection) {
                if(!((conn.host == o_server.host) && (conn.port == o_server.port)) &&
                    !((conn.host == n_server.host) && (conn.port == n_server.port))) {
                    console.log("force remove");
                    conn.startDisconnectTimer(this.connections, 0);
                    self.removeFromConnectioList(conn);
                }
            });

            var old_conn = this.findConnection(o_server.host, o_server.port);
            if(old_conn) {
                old_conn.startDisconnectTimer(this.connections, 60);
            }
            else {
                var newConn = new NSConnection(this,
                    o_server.host, o_server.port, token);
                newConn.startDisconnectTimer(this.connections, 60);
                this.connections.push(newConn);
            }
        }
        else {
            this.connections.forEach(function (conn: NSConnection) {
                if(!((conn.host == n_server.host) && (conn.port == n_server.port))) {
                    console.log("force remove");
                    conn.startDisconnectTimer(this.connections, 0);
                    self.removeFromConnectioList(conn);
                }
            });
        }
        if(!this.findConnection(n_server.host, n_server.port)) {
            var newConn = new NSConnection(this,
                n_server.host, n_server.port, token);
            this.connections.push(newConn);
        }
    }

    private resolveConfig(): void {
        var self = this;
        this.http.get(this.backed_map_path)
            .map((res: Response) => {
                self.updateConfig(JSON.parse(res.text()));
                setTimeout(function () {
                    self.resolveConfig();
                }, this.resolveTimeout);
            })
            .catch((err: Response | any): any => {
                setTimeout(function () {
                    self.resolveConfig();
                }, this.resolveTimeout);
            })
            .subscribe(
                (data) => {  },
                (err) => {  });
    }

    constructor(private http: Http,
                @Inject(UserSession) private sUserSession: UserSession) {
        this.serverNotificationEmitter = new EventEmitter<ServerNotification>();
        sUserSession.sNotificationListener = this;
    }

    start(): void {
        console.log("[i] Notification listener started!");
        this.resolveConfig();
    }
}

import {Injectable} from "@angular/core";

@Injectable()
export class CookieManager {
    public getCookie(name: string) {
        name += '=';
        let ca: Array<string> = document.cookie.split(';');
        let res = '';
        ca.forEach(function (cookieString) {
            cookieString = cookieString.trim();
            let cName = cookieString.substr(0, name.length);
            if(cName === name)
                res = cookieString.substr(name.length);
        });
        return res;
    }

    public deleteCookie(name: string) {
        this.setCookie(name, "", -1);
    }

    public setCookie(name: string, value: string, expireDays: number, path: string = "") {
        let d:Date = new Date();
        d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
        let expires:string = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + "; " + expires + (path.length > 0 ? "; path=" + path : "");
    }
}
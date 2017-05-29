import {UserInfo} from "./user_info.model";
import {ExtUid} from "./ext_uid.model";

export class User {
    ext_uid: ExtUid;
    login: string;
    info: UserInfo;
    public_key: string;
}
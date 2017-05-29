import {HashInfo} from "./hash_info.model";
import {PublicKey} from "./public_key.model";
import {Keyring} from "./keyring.model";
import {UserInfo} from "./user_info.model";

export class RegistrationRequestBody {
    login: string = "";
    test_pwd_hash: string = "";
    hash_info: HashInfo;
    public_key: string;
    keyring: string;
    region: any = null;
    info: UserInfo = new UserInfo();

    public serialize(): any {
        var obj: any = this;
        obj.region = this.region.name;
        obj.hash_info = JSON.stringify(this.hash_info);
        return obj;
    }
}
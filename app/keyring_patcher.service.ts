import {Injectable, EventEmitter, Inject} from '@angular/core'
import {RecaptchaComponent} from "ng2-recaptcha";
import {ReCaptchaBlockComponent} from "./recaptcha_overlay.component";
import {ApiClient, ApplyPatchesCallback} from "./api_client.service";
import {Keyring} from "./models/keyring.model";
import {Patch} from "./models/patch.model";
import {AlienCrypto} from "./alien_crypto.service";
import {ExtConvId} from "./models/ext_conv_id.model";
import {PatchRequest} from "./models/patch_request.model";

@Injectable()
export class KeyringPatcher {

    public sApiClient: ApiClient = null;
    constructor(@Inject(AlienCrypto) private sAlienCrypto: AlienCrypto) {

    }

    private patchAgain: boolean = false;
    private fetchStarted: boolean = false;

    public beginPatching(): void {
        let self = this;

        if(this.fetchStarted) {
            this.patchAgain = true;
            return;
        }

        let die = function () {
            self.fetchStarted = false;
            if(self.patchAgain)
                self.beginPatching();
        };

        this.fetchStarted = true;
        this.sApiClient.getPatches(function (status: number, body: any) {
            if(status && status === 200) {
                let key = body.key;
                if(key === -1 || body.patches.length === 0)
                    return die();

                let keyringDump: Keyring = self.sAlienCrypto.dumpKeyring();

                let patchIds: string[] = [];

                let patches = body.patches;
                patches.forEach(function (patch: Patch) {
                    if(patch.type === 'new_convkey_insert') {
                        keyringDump.conversations[new ExtConvId(patch.conv_id).id()] =
                            self.sAlienCrypto.decryptWithPrivateKey(patch.key);
                        patchIds.push(patch['_id']['$oid']);
                    }
                });
                console.error(keyringDump);

                let request: PatchRequest = new PatchRequest();
                request.key = key;
                request.patches = patchIds;
                request.keyring = self.sAlienCrypto.encryptKeyring(keyringDump);

                self.sApiClient.applyPatches(request, function (status: number) {
                    console.log("ApplyPatches status code: " + status);
                    return die();
                });
            }
            if(status && status === 419)
                setTimeout(function(){
                    self.beginPatching();
                }, 2000*1000);
        });
    }
}
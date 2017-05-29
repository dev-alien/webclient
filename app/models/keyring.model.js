System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Keyring;
    return {
        setters:[],
        execute: function() {
            Keyring = (function () {
                function Keyring() {
                    this.private_keys = [];
                    this.conversations = {};
                }
                Keyring.prototype.pushPrivateKey = function (private_key) {
                    var index = this.private_keys.push(private_key) - 1;
                    return index;
                };
                return Keyring;
            }());
            exports_1("Keyring", Keyring);
        }
    }
});
//# sourceMappingURL=keyring.model.js.map
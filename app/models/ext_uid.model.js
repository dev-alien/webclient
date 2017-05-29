System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ExtUid;
    return {
        setters:[],
        execute: function() {
            ExtUid = (function () {
                function ExtUid(stringVal) {
                    this.stringVal = stringVal;
                }
                ExtUid.prototype.region = function () {
                    return this.stringVal.split('_')[0];
                };
                ;
                ExtUid.prototype.id = function () {
                    return this.stringVal.split('_')[1];
                };
                ;
                return ExtUid;
            }());
            exports_1("ExtUid", ExtUid);
        }
    }
});
//# sourceMappingURL=ext_uid.model.js.map
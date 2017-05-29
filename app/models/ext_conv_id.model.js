System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ExtConvId;
    return {
        setters:[],
        execute: function() {
            ExtConvId = (function () {
                function ExtConvId(stringVal) {
                    this.stringVal = stringVal;
                }
                ExtConvId.prototype.region = function () {
                    return this.stringVal.split('_')[0];
                };
                ;
                ExtConvId.prototype.csName = function () {
                    return this.stringVal.split('_')[1];
                };
                ;
                ExtConvId.prototype.id = function () {
                    return this.stringVal.split('_')[2];
                };
                ;
                return ExtConvId;
            }());
            exports_1("ExtConvId", ExtConvId);
        }
    }
});
//# sourceMappingURL=ext_conv_id.model.js.map
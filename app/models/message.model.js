System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Message;
    return {
        setters:[],
        execute: function() {
            Message = (function () {
                function Message() {
                    this.sender = null;
                    this.decryptedMessage = null;
                    this.isDecrypted = false;
                }
                Message.prototype.prerenderedMessage = function () {
                    if (this.type === 1) {
                        if (!this.isDecrypted)
                            return "<UNABLE TO DECRYPT THE MESSAGE>";
                        return this.decryptedMessage;
                    }
                    if (this.message.length === 0)
                        return "<EMPTY MESSAGE>";
                    return this.message;
                };
                return Message;
            }());
            exports_1("Message", Message);
        }
    }
});
//# sourceMappingURL=message.model.js.map
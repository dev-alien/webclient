System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Conversation;
    return {
        setters:[],
        execute: function() {
            Conversation = (function () {
                function Conversation(sAlienCrypto) {
                    this.sAlienCrypto = sAlienCrypto;
                    this.messages = [];
                    this.isOpen = false;
                }
                Conversation.prototype.getLastMessageText = function () {
                    if (this.messages.length === 0)
                        return "There is no messages yet..";
                    var lastMessage = this.messages[this.messages.length - 1];
                    if (lastMessage.type === 1)
                        return lastMessage.message;
                    return "<system message>";
                };
                Conversation.prototype.sortMessages = function () {
                    this.messages = this.messages.sort(function (a, b) { return a.message_id - b.message_id; });
                };
                Conversation.prototype.lastMessageId = function () {
                    if (this.messages.length === 0)
                        return -1;
                    return this.messages[0].message_id;
                };
                Conversation.prototype.insertMessages = function (messages) {
                    var self = this;
                    messages.forEach(function (message) {
                        var existingMessage = self.messages.filter(function (item) { return item.message_id === message.message_id; })[0];
                        if (!existingMessage) {
                            self.messages.push(message);
                        }
                    });
                    this.sortMessages();
                    this.incrementalDecryption();
                };
                Conversation.prototype.incrementalDecryption = function () {
                    var self = this;
                    console.log("ID");
                    console.log(self);
                    this.messages.map(function (message) {
                        if (!message.isDecrypted) {
                            message.decryptedMessage = self.sAlienCrypto.decryptMessage(self.extConvId.id(), message.message);
                            if (message.decryptedMessage)
                                message.isDecrypted = true;
                        }
                        return message;
                    });
                };
                return Conversation;
            }());
            exports_1("Conversation", Conversation);
        }
    }
});
//# sourceMappingURL=conversation.model.js.map
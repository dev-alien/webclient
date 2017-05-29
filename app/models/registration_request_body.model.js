System.register(["./user_info.model"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var user_info_model_1;
    var RegistrationRequestBody;
    return {
        setters:[
            function (user_info_model_1_1) {
                user_info_model_1 = user_info_model_1_1;
            }],
        execute: function() {
            RegistrationRequestBody = (function () {
                function RegistrationRequestBody() {
                    this.login = "";
                    this.test_pwd_hash = "";
                    this.region = null;
                    this.info = new user_info_model_1.UserInfo();
                }
                RegistrationRequestBody.prototype.serialize = function () {
                    var obj = this;
                    obj.region = this.region.name;
                    obj.hash_info = JSON.stringify(this.hash_info);
                    return obj;
                };
                return RegistrationRequestBody;
            }());
            exports_1("RegistrationRequestBody", RegistrationRequestBody);
        }
    }
});
//# sourceMappingURL=registration_request_body.model.js.map
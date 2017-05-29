System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function object_array_to_string_array(object_array, key) {
        var res = [];
        object_array.forEach(function (object) {
            res.push(object[key]);
        });
        return res;
    }
    exports_1("object_array_to_string_array", object_array_to_string_array);
    return {
        setters:[],
        execute: function() {
            ;
        }
    }
});
//# sourceMappingURL=object_array_to_string_array.js.map
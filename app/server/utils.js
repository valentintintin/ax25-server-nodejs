"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = (function () {
    function Utils() {
    }
    Utils.deleteInArray = function (array, findMethod) {
        var index = array.findIndex(findMethod);
        if (index !== -1) {
            array.splice(index, 1);
        }
        return index !== -1;
    };
    Utils.isNumber = function (text) {
        return !isNaN(parseInt(text, 10));
    };
    return Utils;
}());
exports.Utils = Utils;

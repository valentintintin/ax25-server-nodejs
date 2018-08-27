"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var User = (function () {
    function User(callsign, ssid) {
        this.callsign = callsign;
        this.ssid = ssid;
    }
    User.createFromPacket = function (packet) {
        return new User(packet.sourceCallsign.trim(), (utils_1.Utils.isNumber(packet.sourceSSID) ? +packet.sourceSSID : 0));
    };
    Object.defineProperty(User.prototype, "name", {
        get: function () {
            switch (this.callsign.toLowerCase()) {
                case "f4hvv":
                    return "Valentin";
                case "f1ijp":
                case "f1jky":
                    return "Christophe";
                case "f5kga":
                    return "ADRI 38";
                case "f5lgj":
                    return "Olivier";
                case "f4hdg":
                    return "Loic";
                case "f4dvg":
                    return "Alain";
                case "f4hvx":
                    return "Julien";
                default:
                    return null;
            }
        },
        enumerable: true,
        configurable: true
    });
    User.prototype.toString = function (withName) {
        if (withName === void 0) { withName = true; }
        return this.callsign + (this.ssid ? "-" + this.ssid : "") + (this.name && withName ? " (" + this.name + ")" : "");
    };
    User.prototype.equals = function (user) {
        return this.callsign === user.callsign && this.ssid === user.ssid;
    };
    return User;
}());
exports.User = User;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ax25_1 = require("ax25");
var user_1 = require("./user");
var connection_1 = require("./connection");
var utils_1 = require("./utils");
var ON_DEATH = require("death");
var Ax25Server = (function () {
    function Ax25Server(callsign, ssid, config, serialPort, baudRate) {
        if (serialPort === void 0) { serialPort = "/dev/soundmodem0"; }
        if (baudRate === void 0) { baudRate = 9600; }
        var _this = this;
        this.callsign = callsign;
        this.ssid = ssid;
        this.config = Ax25Server.defaultConfig;
        this.startedDate = new Date();
        this.connections = [];
        this.visited = [];
        this.heard = [];
        Object.assign(this.config, config);
        this.tnc = new ax25_1.kissTNC({
            serialPort: serialPort,
            baudRate: baudRate
        });
        this.tnc.on("error", function (err) { return console.error(err); });
        this.tnc.on("opened", function () {
            if (_this.config.log) {
                console.log("Node ax25 demarre ! Acces par : " + _this.callsign + (_this.ssid ? "-" + _this.ssid : ""));
            }
            if (_this.config.beaconMessage) {
                setInterval(function () { return _this.sendBeacon(); }, _this.config.beaconTime * 1000);
                setTimeout(function () { return _this.sendBeacon(); }, 3000);
            }
            _this.tnc.on("frame", function (frame) { return _this.receive(frame); });
        });
        ON_DEATH(function (signal, err) {
            var sec = 0;
            for (var _i = 0, _a = _this.connections.filter(function (c) { return c.connected; }); _i < _a.length; _i++) {
                var connection = _a[_i];
                connection.sendString("Fermeture du node !");
                connection.disconnect();
                sec += 10;
            }
            console.log("Le node se fermera dans " + sec + " secondes !");
            setTimeout(function () { return process.exit(); }, sec * 1000);
        });
    }
    Ax25Server.prototype.receive = function (frame) {
        try {
            var packet = new ax25_1.Packet();
            packet.disassemble(frame);
            var user_2 = user_1.User.createFromPacket(packet);
            if (this.config.log && this.isPacketForMe(packet, true)) {
                console.log("RX : " + new Date().toLocaleString() + " : " + packet.log());
            }
            if (this.isPacketForMe(packet)) {
                var connection = this.getConnectionFromUser(user_2);
                if (!connection) {
                    connection = new connection_1.Connection(user_2, this);
                    this.connections.push(connection);
                }
                connection.receive(packet);
                if (connection.wantConnection) {
                    connection.open();
                }
                else if (connection.wantDisconnection && packet.type === ax25_1.Defs.S_FRAME_RR) {
                    connection.disconnect();
                }
                utils_1.Utils.deleteInArray(this.visited, function (v) { return v.user.equals(user_2); });
                this.visited.unshift({
                    user: user_2, date: new Date()
                });
            }
            utils_1.Utils.deleteInArray(this.heard, function (v) { return v.user.equals(user_2); });
            this.heard.unshift({
                user: user_2, date: new Date()
            });
        }
        catch (err) {
            console.error(err);
        }
    };
    Ax25Server.prototype.sendToAll = function (text, fromConnection, withMe, connectionsToSend) {
        if (withMe === void 0) { withMe = true; }
        if (connectionsToSend === void 0) { connectionsToSend = null; }
        var connections;
        var str = "<";
        if (!connectionsToSend) {
            str = "*";
        }
        str += fromConnection.user;
        if (!connectionsToSend) {
            str += "*";
            connections = this.connections.filter(function (c) { return c.connected && !c.equals(fromConnection); });
        }
        else {
            connections = connectionsToSend.filter(function (c) { return !c.equals(fromConnection); });
            if (this.config.sendAllWithDate) {
                str += " " + new Date().toLocaleTimeString();
            }
            str += ">";
        }
        str += " " + text;
        for (var _i = 0, connections_1 = connections; _i < connections_1.length; _i++) {
            var c = connections_1[_i];
            c.sendString(str);
        }
        if (withMe) {
            fromConnection.sendString(str);
        }
    };
    Ax25Server.prototype.isPacketForMe = function (packet, fromMe) {
        if (fromMe === void 0) { fromMe = false; }
        return (packet.destinationCallsign.trim() === this.callsign && +packet.destinationSSID === +this.ssid)
            || (fromMe && (packet.sourceCallsign.trim() === this.callsign && +packet.sourceSSID === +this.ssid));
    };
    Ax25Server.prototype.sendBeacon = function () {
        var packet = new ax25_1.Packet({
            sourceCallsign: this.callsign,
            sourceSSID: this.ssid,
            destinationCallsign: this.config.beaconCallsign,
            type: ax25_1.Defs.U_FRAME_UI,
            infoString: this.config.beaconMessage
        });
        this.sendPacket(packet);
    };
    Ax25Server.prototype.sendPacket = function (packet) {
        try {
            if (this.config.log && packet.destinationCallsign !== this.config.beaconCallsign) {
                console.log("TX : " + new Date().toLocaleString() + " : " + packet.log());
            }
            this.tnc.send(packet.assemble());
        }
        catch (e) {
            console.error(e);
        }
    };
    Ax25Server.prototype.getConnectionFromUser = function (user) {
        return this.connections.find(function (c) { return c.user.equals(user); });
    };
    Ax25Server.prototype.removeConnectionFromConnection = function (connection) {
        utils_1.Utils.deleteInArray(this.connections, function (c) { return c.equals(connection); });
    };
    Ax25Server.defaultConfig = {
        log: true,
        sendAllWithDate: true,
        sendAllAction: true,
        endPrompt: "=>",
        endOfLine: "\r\n",
    };
    return Ax25Server;
}());
exports.Ax25Server = Ax25Server;

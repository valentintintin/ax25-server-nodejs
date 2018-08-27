"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ax25_1 = require("ax25");
var page_base_1 = require("../pages/page-base");
var Connection = (function () {
    function Connection(user, server) {
        var _this = this;
        this.user = user;
        this.server = server;
        this.date = new Date();
        this.wantDisconnection = false;
        this.wantConnection = false;
        this.pages = [];
        this.session = new ax25_1.Session({
            remoteCallsign: user.callsign,
            remoteSSID: user.ssid,
            localCallsign: server.callsign,
            localSSID: server.ssid,
        });
        this.session.on("error", function (err) { return console.error(err); });
        this.session.on("packet", function (packet) { return _this.server.sendPacket(packet); });
        this.session.on("data", function (data) {
            if (_this.pages.length) {
                var dataString = ax25_1.Utils.byteArrayToString(data).replace(/(\r\n|\n|\r)/gm, "").trim();
                _this.currentPage.receive(dataString, _this.getCommandWithParams(dataString));
            }
        });
        this.session.on("connection", function (state) {
            if (state) {
                _this.wantConnection = true;
            }
            else {
                _this.close();
            }
        });
    }
    Connection.prototype.setPage = function (page) {
        if (page === void 0) { page = null; }
        if (!page) {
            if (this.pages.length) {
                this.pages.pop();
                this.currentPage = this.pages[this.pages.length - 1];
            }
            else {
                this.sendString("Vous etes deja sur la premiere page");
            }
        }
        else {
            this.pages.push(page);
            this.currentPage = page;
        }
        var str = "== " + this.currentPage.title + " ==\n\n";
        str += this.currentPage.welcome ? this.currentPage.welcome : this.currentPage.getStringListCommand();
        this.sendString(str, 1);
    };
    Connection.prototype.backPage = function () {
        this.setPage();
    };
    Connection.prototype.addPage = function (page) {
        this.setPage(page);
    };
    Connection.prototype.sendString = function (text, nbLinesBreakStart) {
        if (nbLinesBreakStart === void 0) { nbLinesBreakStart = 1; }
        var str = "";
        for (var i = 0; i < nbLinesBreakStart; i++) {
            str += "\n";
        }
        str += text;
        try {
            str += (text.endsWith("\n") ? "" : "\n");
        }
        catch (e) { }
        str += this.server.config.endPrompt;
        try {
            str = str.replace(/(\r\n|\n|\r)/gm, this.server.config.endOfLine);
        }
        catch (e) { }
        this.session.sendString(str);
    };
    Connection.prototype.receive = function (packet) {
        this.session.receive(packet);
    };
    Connection.prototype.open = function () {
        this.wantConnection = false;
        this.pages.length = 0;
        this.addPage(new page_base_1.PageBase(this));
        if (this.server.config.sendAllAction) {
            this.server.sendToAll("connecte au node", this, false);
        }
    };
    Connection.prototype.close = function () {
        if (this.server.config.sendAllAction) {
            this.server.sendToAll("deconnecte du node", this, false);
        }
        if (this.server.config.byeMessage) {
            this.wantDisconnection = true;
            this.session.sendString(this.server.config.byeMessage);
        }
        else {
            this.disconnect();
        }
    };
    Object.defineProperty(Connection.prototype, "connected", {
        get: function () {
            return this.session.connected;
        },
        enumerable: true,
        configurable: true
    });
    Connection.prototype.disconnect = function () {
        this.session.disconnect();
        this.pages.length = 0;
        this.wantConnection = false;
        this.wantDisconnection = false;
    };
    Connection.prototype.equals = function (connection) {
        return this.user.equals(connection.user) && this.date === connection.date;
    };
    Connection.prototype.getCommandWithParams = function (text) {
        return text.toLowerCase().split(" ");
    };
    return Connection;
}());
exports.Connection = Connection;

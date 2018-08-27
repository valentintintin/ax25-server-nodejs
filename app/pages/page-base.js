"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var page_1 = require("../server/page");
var page_conversation_1 = require("./page-conversation");
var page_jeux_1 = require("./jeux/page-jeux");
var PageBase = (function (_super) {
    __extends(PageBase, _super);
    function PageBase(connection) {
        var _this = _super.call(this, connection, "Page d'acceuil") || this;
        _this.welcome = "Bienvenu(e) sur mon node experimental demarre le " + _this.connection.server.startedDate.toLocaleString() + "."
            + "\n" + _this.getStringListCommand();
        return _this;
    }
    PageBase.prototype.getListCommand = function () {
        return [
            { command: "j", info: "Jeux" },
            { command: "c", info: "Mode conversation" },
            { command: "sl 1", info: "Saut de ligne CR" },
            { command: "sl 2", info: "Saut de ligne CR + LF" },
            { command: "sl 3", info: "Saut de ligne LF" },
        ].concat(_super.prototype.getListCommand.call(this));
    };
    PageBase.prototype.receive = function (text, command) {
        if (!_super.prototype.receive.call(this, text, command)) {
            switch (command[0]) {
                case "j":
                    this.nextPage(new page_jeux_1.PageJeux(this.connection));
                    return true;
                case "c":
                    this.nextPage(new page_conversation_1.PageConversation(this.connection));
                    return true;
                case "sl":
                    if (command[1] === "1") {
                        this.connection.server.config.endOfLine = "\r";
                        this.sendString("Saut de ligne mode CR");
                        return true;
                    }
                    else if (command[1] === "2") {
                        this.connection.server.config.endOfLine = "\r\n";
                        this.sendString("Saut de ligne mode CR + LF");
                        return true;
                    }
                    else if (command[1] === "3") {
                        this.connection.server.config.endOfLine = "\n";
                        this.sendString("Saut de ligne mode LF");
                        return true;
                    }
                default:
                    this.unknownCommand(text);
                    return true;
            }
        }
        return false;
    };
    PageBase.prototype.onClose = function () {
    };
    return PageBase;
}(page_1.Page));
exports.PageBase = PageBase;

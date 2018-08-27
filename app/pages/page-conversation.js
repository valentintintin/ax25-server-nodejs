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
var utils_1 = require("../server/utils");
var PageConversation = (function (_super) {
    __extends(PageConversation, _super);
    function PageConversation(connection) {
        var _this = _super.call(this, connection, "Conversation") || this;
        PageConversation.connectionsOnPage.push(_this.connection);
        _this.welcome = _this.getStringListCommand() + "\n\n" + PageConversation.getStringConnected();
        _this.sendToAll("rentre dans la conversation", false);
        return _this;
    }
    PageConversation.removeConnection = function (connection) {
        utils_1.Utils.deleteInArray(PageConversation.connectionsOnPage, function (c) { return c.equals(connection); });
    };
    PageConversation.prototype.getListCommand = function () {
        return [
            { command: "/u", info: "Utilisateurs dans la conversation" },
            { command: "/q", info: "Retour" },
        ];
    };
    PageConversation.getStringConnected = function () {
        return "Utilisateurs dans la conversation :\n"
            + PageConversation.connectionsOnPage.map(function (c) { return "\t - " + c.user; }).join("\n");
    };
    PageConversation.prototype.receive = function (text, command) {
        if (!_super.prototype.receive.call(this, text, command)) {
            switch (command[0]) {
                case "/u":
                    this.sendString(PageConversation.getStringConnected());
                    return true;
                case "/q":
                    PageConversation.removeConnection(this.connection);
                    this.sendToAll("quitte la conversation", false);
                    this.goBack();
                    return true;
                default:
                    this.sendToAll(text, true, PageConversation.connectionsOnPage);
                    return true;
            }
        }
        return false;
    };
    PageConversation.prototype.onClose = function () {
        PageConversation.removeConnection(this.connection);
    };
    PageConversation.connectionsOnPage = [];
    return PageConversation;
}(page_1.Page));
exports.PageConversation = PageConversation;

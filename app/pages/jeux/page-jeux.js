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
var page_1 = require("../../server/page");
var page_jeu_plus_moins_1 = require("./page-jeu-plus-moins");
var page_jeu_morpion_1 = require("./page-jeu-morpion");
var PageJeux = (function (_super) {
    __extends(PageJeux, _super);
    function PageJeux(connection) {
        return _super.call(this, connection, "Page des jeux") || this;
    }
    PageJeux.prototype.getListCommand = function () {
        return [
            { command: "p", info: "Jeu du + et du -" },
            { command: "m", info: "Jeu du Morpion" },
            { command: "/q", info: "Retour" }
        ];
    };
    PageJeux.prototype.receive = function (text, command) {
        if (!_super.prototype.receive.call(this, text, command)) {
            switch (command[0]) {
                case "p":
                    this.nextPage(new page_jeu_plus_moins_1.PageJeuPlusMoins(this.connection));
                    return true;
                case "m":
                    this.nextPage(new page_jeu_morpion_1.PageJeuMorpion(this.connection));
                    return true;
                case "/q":
                    this.goBack();
                    return true;
                default:
                    this.unknownCommand(text);
                    return true;
            }
        }
        return false;
    };
    PageJeux.prototype.onClose = function () {
    };
    return PageJeux;
}(page_1.Page));
exports.PageJeux = PageJeux;

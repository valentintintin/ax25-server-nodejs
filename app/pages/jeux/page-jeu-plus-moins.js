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
var jeu_plus_moins_1 = require("../../models/jeux/jeu-plus-moins");
var utils_1 = require("../../server/utils");
var PageJeuPlusMoins = (function (_super) {
    __extends(PageJeuPlusMoins, _super);
    function PageJeuPlusMoins(connection) {
        var _this = _super.call(this, connection, "Jeu du + et du -") || this;
        _this.max = 10;
        _this.createGame();
        _this.welcome = _this.getStringListCommand() + "\n" + _this.createGame();
        return _this;
    }
    PageJeuPlusMoins.prototype.getListCommand = function () {
        return [
            { command: "m XX", info: "Regler max a XX" },
            { command: "s", info: "Reponse" },
            { command: "r", info: "Recommencer" },
            { command: "h", info: "Aide" },
            { command: "/q", info: "Retour" }
        ];
    };
    PageJeuPlusMoins.prototype.createGame = function () {
        this.jeu = new jeu_plus_moins_1.JeuPlusMoins(this.max);
        return "Le jeu a commence ! Trouvez un nombre entre 0 et " + this.max + " :)";
    };
    PageJeuPlusMoins.prototype.receive = function (text, command) {
        if (!_super.prototype.receive.call(this, text, command)) {
            switch (command[0]) {
                case "/q":
                    this.goBack();
                    return true;
                case "m":
                    if (utils_1.Utils.isNumber(command[1])) {
                        this.max = +command[1];
                        if (this.max < 5) {
                            this.max = 5;
                        }
                        this.sendString(this.createGame());
                    }
                    else {
                        this.unknownCommand(text);
                    }
                    break;
                case "s":
                    this.sendString("Reponse : " + this.jeu.choosen);
                    return true;
                case "r":
                    this.sendString(this.createGame());
                    return true;
                default:
                    if (utils_1.Utils.isNumber(text)) {
                        var result = this.jeu.giveNumber(+text);
                        if (result === 0) {
                            this.sendString("Vous avez trouve le bon nombre en " + this.jeu.coup + " coup(s) !" + "\n\n" + this.createGame());
                        }
                        else {
                            this.sendString("Plus " + (result < 0 ? "petit" : "grand") + " !");
                        }
                    }
                    else {
                        this.unknownCommand(text);
                    }
                    return true;
            }
        }
    };
    PageJeuPlusMoins.prototype.onClose = function () {
    };
    return PageJeuPlusMoins;
}(page_1.Page));
exports.PageJeuPlusMoins = PageJeuPlusMoins;

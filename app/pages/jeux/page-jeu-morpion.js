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
var jeu_morpion_1 = require("../../models/jeux/jeu-morpion");
var utils_1 = require("../../server/utils");
var PageJeuMorpion = (function (_super) {
    __extends(PageJeuMorpion, _super);
    function PageJeuMorpion(connection) {
        var _this = _super.call(this, connection, "Jeu du Morpion") || this;
        _this.tailleGrille = 3;
        _this.createGame();
        _this.welcome = _this.getStringListCommand() + "\n\n" + _this.createGame();
        return _this;
    }
    PageJeuMorpion.prototype.getListCommand = function () {
        return [
            { command: "p X Y", info: "Placer un marqueur a X, Y" },
            { command: "g XX", info: "Regler la grille a XX cases" },
            { command: "r", info: "Recommencer" },
            { command: "h", info: "Aide" },
            { command: "/q", info: "Retour" }
        ];
    };
    PageJeuMorpion.prototype.createGame = function () {
        this.jeu = new jeu_morpion_1.JeuMorpion(this.tailleGrille);
        return "Le jeu a commence !" + "\n" + this.getPlateauString();
    };
    PageJeuMorpion.prototype.receive = function (text, command) {
        if (!_super.prototype.receive.call(this, text, command)) {
            switch (command[0]) {
                case "/q":
                    this.goBack();
                    return true;
                case "g":
                    if (utils_1.Utils.isNumber(command[1])) {
                        this.tailleGrille = +command[1];
                        if (this.tailleGrille > 10) {
                            this.tailleGrille = 10;
                        }
                        else if (this.tailleGrille < 3) {
                            this.tailleGrille = 3;
                        }
                        this.sendString(this.createGame());
                    }
                    else {
                        this.unknownCommand(text);
                    }
                    break;
                case "p":
                    if (!this.jeu.finished) {
                        if (utils_1.Utils.isNumber(command[1]) && utils_1.Utils.isNumber(command[2])) {
                            try {
                                this.jeu.putMarker(0, +command[1], +command[2]);
                                this.jeu.playRandom(1);
                                this.sendString(this.getPlateauString());
                            }
                            catch (e) {
                                this.sendString(e);
                            }
                        }
                        else {
                            this.unknownCommand(text);
                        }
                    }
                    else {
                        this.sendString("Leu jeu est fini !" + "\n\n" + "R : recommencer");
                    }
                    break;
                case "r":
                    this.sendString(this.createGame());
                    return true;
                default:
                    this.unknownCommand(text);
                    return true;
            }
        }
    };
    PageJeuMorpion.prototype.getPlateauString = function () {
        var str = "  ";
        for (var x = 0; x < this.tailleGrille; x++) {
            str += "|" + x;
        }
        str += "|";
        for (var y = 0; y < this.tailleGrille; y++) {
            str += "\n|" + y;
            for (var x = 0; x < this.tailleGrille; x++) {
                str += "|" + this.getPionFromNumber(this.jeu.plateau[x][y]);
            }
            str += "|";
        }
        str += "\n\n";
        var win = this.jeu.getWin();
        if (win !== -1) {
            return str + "Vous avez gagne !\n\n" + this.getStringListCommand();
        }
        else {
            return str + "C'est votre tour ! Vous etes les X";
        }
    };
    PageJeuMorpion.prototype.getPionFromNumber = function (nb) {
        if (nb === -1) {
            return " ";
        }
        else {
            return nb === 0 ? "X" : "O";
        }
    };
    PageJeuMorpion.prototype.onClose = function () {
    };
    return PageJeuMorpion;
}(page_1.Page));
exports.PageJeuMorpion = PageJeuMorpion;

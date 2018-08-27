"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Page = (function () {
    function Page(connection, title, welcome) {
        if (welcome === void 0) { welcome = null; }
        this.connection = connection;
        this.title = title;
        this.welcome = welcome;
        this.commands = [];
        if (this.commandConfigIsEnable("c")) {
            this.commands.push({ command: "c MESSAGE", info: "Envoie un message a tous" });
        }
        if (this.commandConfigIsEnable("i")) {
            this.commands.push({ command: "i", info: "Informations" });
        }
        if (this.commandConfigIsEnable("u")) {
            this.commands.push({ command: "u", info: "Utilisateurs connectes" });
        }
        if (this.commandConfigIsEnable("l")) {
            this.commands.push({ command: "l", info: "Historique des connections" });
        }
        if (this.commandConfigIsEnable("mh")) {
            this.commands.push({ command: "mh", info: "Stations entendues" });
        }
        this.commands.push({ command: "h", info: "Aide" });
        this.commands.push({ command: "q", info: "Quitter" });
    }
    Page.prototype.getStringListCommand = function () {
        return "Liste des commandes :\n"
            + this.getListCommand().map(function (c) { return c.command + " : " + c.info; }).join("\n");
    };
    Page.prototype.getListCommand = function () {
        return this.commands;
    };
    Page.prototype.receive = function (text, command) {
        var listStations;
        switch (command[0]) {
            case "h":
                this.sendString(this.getStringListCommand());
                return true;
            case "q":
                this.onClose();
                this.connection.close();
                return true;
            case "c":
                if (this.commandConfigIsEnable("c") && command[1]) {
                    this.sendToAll(text.substr(2), true);
                    return true;
                }
                else {
                    return false;
                }
            case "l":
                if (this.commandConfigIsEnable("l")) {
                    listStations = this.connection.server.visited.map(function (v) { return "\t - " + v.user + " le " + v.date.toLocaleString(); });
                    this.sendString("Listes des stations venues sur le node :\n" + listStations.join("\n"));
                    return true;
                }
                else {
                    return false;
                }
            case "mh":
                if (this.commandConfigIsEnable("mh")) {
                    listStations = this.connection.server.heard.map(function (v) { return "\t - " + v.user.toString(false) + " le " + v.date.toLocaleString(); });
                    this.sendString("Listes des stations entendues :\n" + listStations.join("\n"));
                    return true;
                }
                else {
                    return false;
                }
            case "i":
                if (this.commandConfigIsEnable("i") && this.connection.server.config.infoCommandMessage) {
                    this.sendString(this.connection.server.config.infoCommandMessage);
                    return true;
                }
                else {
                    return false;
                }
            case "u":
                if (this.commandConfigIsEnable("u")) {
                    listStations = this.connection.server.connections
                        .filter(function (c) { return c.connected; })
                        .map(function (c) { return "\t - " + c.user; });
                    this.sendString("Listes des stations connectees sur le node :\n" + listStations.join("\n"));
                    return true;
                }
                else {
                    return false;
                }
        }
        return false;
    };
    Page.prototype.unknownCommand = function (text) {
        this.connection.sendString("Commande \"" + text + "\" inconnue !");
    };
    Page.prototype.sendString = function (text, nbLinesBreakStart) {
        if (nbLinesBreakStart === void 0) { nbLinesBreakStart = 1; }
        this.connection.sendString(text, nbLinesBreakStart);
    };
    Page.prototype.goBack = function () {
        this.connection.backPage();
    };
    Page.prototype.nextPage = function (page) {
        this.connection.addPage(page);
    };
    Page.prototype.sendToAll = function (text, withMe, all) {
        if (withMe === void 0) { withMe = false; }
        if (all === void 0) { all = null; }
        this.connection.server.sendToAll(text, this.connection, withMe, (all ? all : null));
    };
    Page.prototype.commandConfigIsEnable = function (command) {
        if (!this.connection.server.config.commandDefaultDisable || !this.connection.server.config.commandDefaultDisable.length) {
            return true;
        }
        else {
            return this.connection.server.config.commandDefaultDisable.find(function (c) { return c === command; }) == null;
        }
    };
    return Page;
}());
exports.Page = Page;

import {Connection} from './connection';
import {Visited} from './ax25-server';

export abstract class Page {

    private commands: Command[] = [];

    constructor(
        protected connection: Connection, public title: string, public welcome: string = null
    ) {
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

    public getStringListCommand(): string {
        return "Liste des commandes :\n"
            + this.getListCommand().map((c: Command) => c.command + " : " + c.info).join("\n");
    }

    protected getListCommand(): Command[] {
        return this.commands;
    }

    public receive(text: string, command: string[]): boolean {
        let listStations: string[];

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
                } else {
                    return false;
                }

            case "l":
                if (this.commandConfigIsEnable("l")) {
                    listStations = this.connection.server.visited.map((v: Visited) => "\t - " + v.user + " le " + v.date.toLocaleString());
                    this.sendString("Listes des stations venues sur le node :\n" + listStations.join("\n"));
                    return true;
                } else {
                    return false;
                }

            case "mh":
                if (this.commandConfigIsEnable("mh")) {
                    listStations = this.connection.server.heard.map((v: Visited) => "\t - " + v.user.toString(false) + " le " + v.date.toLocaleString());
                    this.sendString("Listes des stations entendues :\n" + listStations.join("\n"));
                    return true;
                } else {
                    return false;
                }

            case "i":
                if (this.commandConfigIsEnable("i") && this.connection.server.config.infoCommandMessage) {
                    this.sendString(this.connection.server.config.infoCommandMessage);
                    return true;
                } else {
                    return false;
                }

            case "u":
                if (this.commandConfigIsEnable("u")) {
                    listStations = this.connection.server.connections
                        .filter((c: Connection) => c.connected)
                        .map((c: Connection) => "\t - " + c.user);
                    this.sendString("Listes des stations connectees sur le node :\n" + listStations.join("\n"));

                    return true;
                } else {
                    return false;
                }
        }

        return false;
    }

    protected abstract onClose(): void;

    protected unknownCommand(text: string): void {
        this.connection.sendString("Commande \"" + text + "\" inconnue !");
    }

    protected sendString(text: string, nbLinesBreakStart = 1): void {
        this.connection.sendString(text, nbLinesBreakStart);
    }

    protected goBack(): void {
        this.connection.backPage();
    }

    protected nextPage(page: Page): void {
        this.connection.addPage(page);
    }

    protected sendToAll(text: string, withMe: boolean = false, all: Connection[] = null): void {
        this.connection.server.sendToAll(text, this.connection, withMe, (all ? all : null));
    }

    private commandConfigIsEnable(command: string): boolean {
        if (!this.connection.server.config.commandDefaultDisable || !this.connection.server.config.commandDefaultDisable.length) {
            return true;
        } else {
            return this.connection.server.config.commandDefaultDisable.find((c: string) => c === command) == null;
        }
    }
}

export interface Command {
    command: string;
    info: string;
}

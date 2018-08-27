import {Command, Page} from "../../server/page";
import {Connection} from "../../server/connection";
import {PageJeuPlusMoins} from "./page-jeu-plus-moins";
import {PageJeuMorpion} from "./page-jeu-morpion";
import {PageBase} from "../page-base";

export class PageJeux extends Page {

    constructor(connection: Connection) {
        super(connection, "Page des jeux");
    }

    protected getListCommand(): Command[] {
        return [
            { command: "p", info: "Jeu du + et du -" },
            { command: "m", info: "Jeu du Morpion" },
            { command: "/q", info: "Retour" }
        ];
    }

    public receive(text: string, command: string[]): boolean {
        if (!super.receive(text, command)) {
            switch (command[0]) {
                case "p":
                    this.nextPage(new PageJeuPlusMoins(this.connection));
                    return true;

                case "m":
                    this.nextPage(new PageJeuMorpion(this.connection));
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
    }

    protected onClose(): void {
    }
}

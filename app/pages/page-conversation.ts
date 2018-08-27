import {Command, Page} from '../server/page';
import {Connection} from '../server/connection';
import {Utils} from '../server/utils';

export class PageConversation extends Page {

    private static connectionsOnPage: Connection[] = [];

    private static removeConnection(connection: Connection): void {
        Utils.deleteInArray(PageConversation.connectionsOnPage, (c: Connection) => c.equals(connection));
    }

    constructor(connection: Connection) {
        super(connection, "Conversation");

        PageConversation.connectionsOnPage.push(this.connection);

        this.welcome = this.getStringListCommand() + "\n\n" + PageConversation.getStringConnected();

        this.sendToAll("rentre dans la conversation", false);
    }

    protected getListCommand(): Command[] {
        return [
            { command: "/u", info: "Utilisateurs dans la conversation" },
            { command: "/q", info: "Retour" },
        ];
    }

    private static getStringConnected(): string {
        return "Utilisateurs dans la conversation :\n"
            + PageConversation.connectionsOnPage.map((c: Connection) => "\t - " + c.user).join("\n");
    }

    public receive(text: string, command: string[]): boolean {
        if (!super.receive(text, command)) {
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
    }

    protected onClose(): void {
        PageConversation.removeConnection(this.connection);
    }
}

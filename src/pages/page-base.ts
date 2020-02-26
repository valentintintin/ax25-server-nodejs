import { Command, Page } from '../server/page';
import { Connection } from '../server/connection';
import { PageConversation } from './page-conversation';
import { PageJeux } from './jeux/page-jeux';

export class PageBase extends Page {

    constructor(connection: Connection) {
        super(connection, 'Page d\'acceuil');

        this.welcome = 'Bienvenu(e) sur mon node experimental demarre le ' + this.connection.server.startedDate.toLocaleString() + '.'
            + '\n' + this.getStringListCommand();
    }

    protected getListCommand(): Command[] {
        return [
            { command: 'j', info: 'Jeux' },
            { command: 'c', info: 'Mode conversation' },
            { command: 'sl 1', info: 'Saut de ligne CR' },
            { command: 'sl 2', info: 'Saut de ligne CR + LF' },
            { command: 'sl 3', info: 'Saut de ligne LF' },
        ].concat(super.getListCommand());
    }

    public receive(text: string, command: string[]): boolean {
        if (!super.receive(text, command)) {
            switch (command[0]) {
                case 'j':
                    this.nextPage(new PageJeux(this.connection));
                    return true;

                case 'c':
                    this.nextPage(new PageConversation(this.connection));
                    return true;

                case 'sl':
                    if (command[1] === '1') {
                        this.connection.server.config.endOfLine = '\r';
                        this.sendString('Saut de ligne mode CR');
                        return true;
                    } else if (command[1] === '2') {
                        this.connection.server.config.endOfLine = '\r\n';
                        this.sendString('Saut de ligne mode CR + LF');
                        return true;
                    } else if (command[1] === '3') {
                        this.connection.server.config.endOfLine = '\n';
                        this.sendString('Saut de ligne mode LF');
                        return true;
                    }
                    this.unknownCommand(text);
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

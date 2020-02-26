import { Command, Page } from '../../server/page';
import { Connection } from '../../server/connection';
import { JeuPlusMoins } from '../../models/jeux/jeu-plus-moins';
import { Utils } from '../../server/utils';

export class PageJeuPlusMoins extends Page {

    private jeu: JeuPlusMoins;
    private max = 10;

    constructor(connection: Connection) {
        super(connection, 'Jeu du + et du -');

        this.createGame();

        this.welcome = this.getStringListCommand() + '\n' + this.createGame();
    }

    protected getListCommand(): Command[] {
        return [
            { command: 'm XX', info: 'Regler max a XX' },
            { command: 's', info: 'Reponse' },
            { command: 'r', info: 'Recommencer' },
            { command: 'h', info: 'Aide' },
            { command: '/q', info: 'Retour' }
        ];
    }

    private createGame(): string {
        this.jeu = new JeuPlusMoins(this.max);

        return 'Le jeu a commence ! Trouvez un nombre entre 0 et ' + this.max + ' :)';
    }

    public receive(text: string, command: string[]): boolean {
        if (!super.receive(text, command)) {
            switch (command[0]) {
                case '/q':
                    this.goBack();
                    return true;

                case 'm':
                    if (Utils.isNumber(command[1])) {
                        this.max = +command[1];
                        if (this.max < 5) {
                            this.max = 5;
                        }
                        this.sendString(this.createGame());
                    } else {
                        this.unknownCommand(text);
                    }
                    break;

                case 's':
                    this.sendString('Reponse : ' + this.jeu.choosen);
                    return true;

                case 'r':
                    this.sendString(this.createGame());
                    return true;

                default:
                    if (Utils.isNumber(text)) {
                        const result = this.jeu.giveNumber(+text);
                        if (result === 0) {
                            this.sendString('Vous avez trouve le bon nombre en ' + this.jeu.coup + ' coup(s) !' + '\n\n' + this.createGame());
                        } else {
                            this.sendString('Plus ' + (result < 0 ? 'petit' : 'grand') + ' !');
                        }
                    } else {
                        this.unknownCommand(text);
                    }
                    return true;
            }
        }
    }

    protected onClose(): void {
    }
}

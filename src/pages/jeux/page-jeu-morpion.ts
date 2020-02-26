import { Command, Page } from '../../server/page';
import { Connection } from '../../server/connection';
import { JeuMorpion } from '../../models/jeux/jeu-morpion';
import { Utils } from '../../server/utils';

export class PageJeuMorpion extends Page {

    private jeu: JeuMorpion;
    private tailleGrille = 3;

    constructor(connection: Connection) {
        super(connection, 'Jeu du Morpion');

        this.createGame();

        this.welcome = this.getStringListCommand() + '\n\n' + this.createGame();
    }

    protected getListCommand(): Command[] {
        return [
            { command: 'p X Y', info: 'Placer un marqueur a X, Y' },
            { command: 'g XX', info: 'Regler la grille a XX cases' },
            { command: 'r', info: 'Recommencer' },
            { command: 'h', info: 'Aide' },
            { command: '/q', info: 'Retour' }
        ];
    }

    private createGame(): string {
        this.jeu = new JeuMorpion(this.tailleGrille);

        return 'Le jeu a commence !' + '\n' + this.getPlateauString();
    }

    public receive(text: string, command: string[]): boolean {
        if (!super.receive(text, command)) {
            switch (command[0]) {
                case '/q':
                    this.goBack();
                    return true;

                case 'g':
                    if (Utils.isNumber(command[1])) {
                        this.tailleGrille = +command[1];
                        if (this.tailleGrille > 10) {
                            this.tailleGrille = 10;
                        } else if (this.tailleGrille < 3) {
                            this.tailleGrille = 3;
                        }
                        this.sendString(this.createGame());
                    } else {
                        this.unknownCommand(text);
                    }
                    break;

                case 'p':
                    if (!this.jeu.finished) {
                        if (Utils.isNumber(command[1]) && Utils.isNumber(command[2])) {
                            try {
                                this.jeu.putMarker(0, +command[1], +command[2]);
                                this.jeu.playRandom(1);
                                this.sendString(this.getPlateauString());
                            } catch (e) {
                                this.sendString(e);
                            }
                        } else {
                            this.unknownCommand(text);
                        }
                    } else {
                        this.sendString('Leu jeu est fini !' + '\n\n' + 'R : recommencer');
                    }
                    break;

                case 'r':
                    this.sendString(this.createGame());
                    return true;

                default:
                    this.unknownCommand(text);
                    return true;
            }
        }
    }

    private getPlateauString(): string {
        let str = '  ';

        for (let x = 0; x < this.tailleGrille; x++) {
            str += '|' + x;
        }

        str += '|';

        for (let y = 0; y < this.tailleGrille; y++) {
            str += '\n|' + y;

            for (let x = 0; x < this.tailleGrille; x++) {
                str += '|' + this.getPionFromNumber(this.jeu.plateau[x][y]);
            }

            str += '|';
        }

        str += '\n\n';

        const win: number = this.jeu.getWin();

        if (win !== -1) {
            // return str + "\r\n\r\nJoueur " + (win + 1) + " a gagne !";
            return str + 'Vous avez gagne !\n\n' + this.getStringListCommand();

        } else {
            // return str + "\r\n\r\nJoueur " + (this.jeu.whoMustPlayed + 1) + " c'est votre tour !";
            return str + "C'est votre tour ! Vous etes les X";
        }
    }

    private getPionFromNumber(nb: number): string {
        if (nb === -1) {
            return ' ';
        } else {
            return nb === 0 ? 'X' : 'O';
        }
    }

    protected onClose(): void {
    }
}

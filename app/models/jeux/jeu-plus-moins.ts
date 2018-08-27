export class JeuPlusMoins {

    public choosen: number;
    public coup = 0;

    constructor(private max: number) {
        this.choosen = Math.round(Math.random() * this.max);
    }

    public giveNumber(nb: number): number {
        this.coup++;

        if (nb == this.choosen) {
            return 0;
        } else {
            return nb > this.choosen ? -1 : 1;
        }
    }
}
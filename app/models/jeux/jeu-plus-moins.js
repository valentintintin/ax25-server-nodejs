"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JeuPlusMoins = (function () {
    function JeuPlusMoins(max) {
        this.max = max;
        this.coup = 0;
        this.choosen = Math.round(Math.random() * this.max);
    }
    JeuPlusMoins.prototype.giveNumber = function (nb) {
        this.coup++;
        if (nb == this.choosen) {
            return 0;
        }
        else {
            return nb > this.choosen ? -1 : 1;
        }
    };
    return JeuPlusMoins;
}());
exports.JeuPlusMoins = JeuPlusMoins;

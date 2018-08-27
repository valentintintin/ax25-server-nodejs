"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JeuMorpion = (function () {
    function JeuMorpion(tailleGrille) {
        this.tailleGrille = tailleGrille;
        this.whoMustPlayed = 0;
        this.finished = false;
        this.plateau = [];
        for (var x = 0; x < this.tailleGrille; x++) {
            this.plateau[x] = [];
            for (var y = 0; y < this.tailleGrille; y++) {
                this.plateau[x][y] = -1;
            }
        }
    }
    JeuMorpion.prototype.putMarker = function (player, x, y) {
        if (player === this.whoMustPlayed) {
            if (x >= 0 && x < this.tailleGrille && y >= 0 && y < this.tailleGrille) {
                if (this.plateau[x][y] === -1) {
                    this.plateau[x][y] = player;
                    this.whoMustPlayed = (this.whoMustPlayed + 1) % 2;
                    this.finished = this.getWin() !== -1;
                }
                else {
                    throw new Error("Case deja cochee !");
                }
            }
            else {
                throw new Error("Mauvaises coordonnes !");
            }
        }
        else {
            throw new Error("Ce n'est pas votre tour !");
        }
    };
    JeuMorpion.prototype.getWin = function () {
        var x = 0;
        var y = 0;
        var last = -1;
        while (last === -1 && x < this.tailleGrille) {
            y = 0;
            if (this.plateau[x][y] !== -1) {
                last = this.plateau[x][y++];
                while (y < this.tailleGrille && this.plateau[x][y] === last) {
                    y++;
                }
                if (y === this.tailleGrille) {
                    return last;
                }
            }
            x++;
        }
        last = -1;
        x = y = 0;
        while (last === -1 && y < this.tailleGrille) {
            x = 0;
            if (this.plateau[x][y] !== -1) {
                last = this.plateau[x++][y];
                while (x < this.tailleGrille && this.plateau[x][y] === last) {
                    x++;
                }
                if (x === this.tailleGrille) {
                    return last;
                }
            }
            y++;
        }
        last = -1;
        x = 0;
        if (last === -1 && this.plateau[x][x] !== -1) {
            last = this.plateau[x][x++];
            while (last !== -1 && x < this.tailleGrille && this.plateau[x][x] === last) {
                x++;
            }
            if (x === this.tailleGrille) {
                return last;
            }
        }
        return -1;
    };
    JeuMorpion.prototype.playRandom = function (player) {
        if (!this.finished) {
            var possible = [];
            for (var x = 0; x < this.tailleGrille; x++) {
                for (var y = 0; y < this.tailleGrille; y++) {
                    if (this.plateau[x][y] === -1) {
                        possible.push([x, y]);
                    }
                }
            }
            var pos = possible[Math.round(Math.random() * possible.length)];
            this.putMarker(player, pos[0], pos[1]);
        }
    };
    return JeuMorpion;
}());
exports.JeuMorpion = JeuMorpion;

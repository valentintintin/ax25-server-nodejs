import {Ax25Server} from "./app/server/ax25-server";

// const server = new Ax25Server("F5LGJ", 5, {
//     infoCommandMessage: "Merci de vous interesse a mon petit projet :)\n\nCe node appartient a F4HVV (Valentin - Grenoble Gare).\nIl est \"fait maison\" en Javascript (NodeJs) grace a une bibliotheque OpenSource modifiee : https://github.com/valentintintin/node-ax25.\nIl tourne sur un Raspberry Pi + Yaesu FT-857D 2W + GP.",
//     beaconMessage: "Node experimental en test sur F4HVV-2",
//     beaconCallsign: "PUB",
//     beaconTime: 2 * 60,
//     byeMessage: "Merci d'etre passe !",
//     endOfLine: "\r",
// });
const server = new Ax25Server("F5LGJ", 5, {
    endOfLine: "\r",
});

import { Ax25Server } from './src/server/ax25-server';

const server = new Ax25Server('F4HVV', 0, {
    infoCommandMessage: 'Ce node appartient a F4HVV Valentin.\nIl est "fait maison" en Javascript (NodeJs).\nIl tourne sur un Raspberry Pi autonome en ernergie + ICOM HT-16 et antenne boudin.',
    // beaconMessage: 'Node experimental en test sur F4HVV',
    // beaconCallsign: 'APFD38',
    // beaconTime: 2 * 60,
    byeMessage: 'Merci d\'etre passe !',
    endOfLine: '\r',
});

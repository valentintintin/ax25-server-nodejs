import { Packet } from 'ax25';
import { Utils } from './utils';

export class User {

    public static createFromPacket(packet: Packet): User {
        return new User(
            packet.sourceCallsign.trim(),
            (Utils.isNumber(packet.sourceSSID) ? +packet.sourceSSID : 0)
        );
    }

    constructor(public callsign: string, public ssid: number) {}

    public get name(): string {
        switch (this.callsign.toLowerCase()) {
            case 'f4hvv':
                return 'Valentin';

            case 'f1ijp':
            case 'f1jky':
                return 'Christophe';

            case 'f5kga':
                return 'ADRI38';

            case 'f5lgj':
                return 'Olivier';

            case 'f4hdg':
                return 'Loic';

            case 'f4dvg':
                return 'Alain';

            case 'f4hvx':
                return 'Julien';

            case 'f4hka':
                return 'Jeremy';

            default:
                return null;
        }
    }

    public toString(withName = true): string {
        return this.callsign + (this.ssid ? '-' + this.ssid : '') + (this.name && withName ? ' (' + this.name + ')' : '');
    }
    
    public equals(user: User): boolean {
        return this.callsign === user.callsign && this.ssid === user.ssid;
    }
}

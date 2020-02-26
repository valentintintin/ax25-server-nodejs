import { Defs, kissTNCTcp, Packet } from 'ax25';
import { User } from './user';
import { Connection } from './connection';
import { Utils } from './utils';

const ON_DEATH = require('death');

export class Ax25Server {

    private static defaultConfig: ServerConfig = {
        log: true,

        sendAllWithDate: true,
        sendAllAction: true,

        endPrompt: '=>',
        endOfLine: '\r\n',
    };

    public config: ServerConfig = Ax25Server.defaultConfig;

    public startedDate = new Date();
    public connections: Connection[] = [];
    public visited: Visited[] = [];
    public heard: Visited[] = [];

    private tnc: kissTNCTcp;
    private signalDeath: boolean;

    constructor(
        public callsign: string, public ssid: number, config: ServerConfig,
        ip = '127.0.0.1', port = 8001
    ) {
        Object.assign(this.config, config);

        this.tnc = new kissTNCTcp({
            ip,
            port
        });

        this.tnc.on('error', (err: any) => console.error(err));

        this.tnc.on('opened', () => {
            console.log('Node ax25 demarre ! Acces par : ' + this.callsign + (this.ssid ? '-' + this.ssid : ''));

            if (this.config.beaconMessage) {
                setInterval(() => this.sendBeacon(), this.config.beaconTime * 1000);
                setTimeout(() => this.sendBeacon(), 3000);
            }

            this.tnc.on('frame', (frame: any) => this.receive(frame));
        });

        ON_DEATH((signal: any, err: any) => {
            if (!this.signalDeath && this.connections.length > 0) {
                this.signalDeath = true;
                console.log('Le node se fermera quand les ' + this.connections.length + ' utilisateurs seront deconnectes');

                for (const connection of this.connections.filter((c: Connection) => c.connected)) {
                    connection.sendString('Fermeture du node !');
                    this.config.sendAllAction = false;
                    connection.close();
                    setTimeout(() => {
                        console.log(this.connections.length + ' utilisateurs connectes');
                        if (this.connections.length === 0) {
                            console.log('Arret du node');
                            process.exit();
                        }
                    }, 10000);
                }
            } else {
                process.exit();
            }
        });
    }

    private receive(frame: any): void {
        try {
            const packet = new Packet();
            packet.disassemble(frame);

            const user = User.createFromPacket(packet);

            if (this.isPacketForMe(packet)) {
                if (this.config.log) {
                    console.log('RX : ' + new Date().toLocaleString() + ' : ' + packet.log());
                }

                let connection: Connection = this.getConnectionFromUser(user);

                if (!connection) {
                    connection = new Connection(user, this);
                    this.connections.push(connection);
                }

                connection.receive(packet);

                if (connection.wantConnection) {
                    connection.open();
                } else if (connection.wantDisconnection && packet.type === Defs.S_FRAME_RR) {
                    connection.disconnect();
                }

                Utils.deleteInArray(this.visited, (v: Visited) => v.user.equals(user));
                this.visited.unshift({
                    user, date: new Date()
                });
            }

            Utils.deleteInArray(this.heard, (v: Visited) => v.user.equals(user));
            this.heard.unshift({
                user, date: new Date()
            });
        } catch (err) {
            console.error(err);
        }
    }

    public sendToAll(text: string, fromConnection: Connection, withMe = true, connectionsToSend: Connection[] = null): void {
        let connections: Connection[];

        let str = '<';

        if (!connectionsToSend) {
            str = '*';
        }

        str += fromConnection.user;

        if (!connectionsToSend) {
            str += '*';
            connections = this.connections.filter((c: Connection) => c.connected && !c.equals(fromConnection));
        } else {
            connections = connectionsToSend.filter((c: Connection) => !c.equals(fromConnection));

            if (this.config.sendAllWithDate) {
                str += ' ' + new Date().toLocaleTimeString();
            }

            str += '>';
        }

        str += ' ' + text;

        for (const c of connections) {
            c.sendString(str);
        }

        if (withMe) {
            fromConnection.sendString(str);
        }
    }

    private isPacketForMe(packet: Packet, fromMe = false): boolean {
        return (packet.destinationCallsign.trim() === this.callsign && +packet.destinationSSID === +this.ssid)
            || (fromMe && (packet.sourceCallsign.trim() === this.callsign && +packet.sourceSSID === +this.ssid));
    }

    private sendBeacon(): void {
        const packet = new Packet({
            sourceCallsign : this.callsign,
            sourceSSID: this.ssid,
            destinationCallsign : this.config.beaconCallsign,
            type : Defs.U_FRAME_UI,
            infoString : this.config.beaconMessage
        });
        this.sendPacket(packet);
    }

    public sendPacket(packet: Packet): void {
        try {
            if (this.config.log && this.isPacketForMe(packet, true)) {
                console.log('TX : ' + new Date().toLocaleString() + ' : ' + packet.log());
            }

            this.tnc.send(packet.assemble());
        } catch (e) {
            console.error(e);
        }
    }

    private getConnectionFromUser(user: User): Connection {
        return this.connections.find((c: Connection) => c.user.equals(user));
    }

    public removeConnectionFromConnections(connection: Connection): void {
        console.log('Suppression de ' + connection.user);
        Utils.deleteInArray(this.connections, (c: Connection) => c.equals(connection));
    }
}

export interface Visited {
    user: User;
    date: Date;
}

export interface ServerConfig {
    log?: boolean;

    byeMessage?: string;
    infoCommandMessage?: string;

    sendAllWithDate?: boolean;
    sendAllAction?: boolean;

    endPrompt?: string;
    endOfLine?: string;

    beaconMessage?: string;
    beaconCallsign?: string;
    beaconTime?: number;

    commandDefaultDisable?: string[];
}

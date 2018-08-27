import {Packet, Session, Utils} from "ax25";
import {User} from "./user";
import {Page} from "./page";
import {PageBase} from "../pages/page-base";
import {Ax25Server} from "./ax25-server";

export class Connection {

    public date = new Date();
    public wantDisconnection = false;
    public wantConnection = false;

    private session: Session;
    private pages: Page[] = [];
    private currentPage: Page;

    constructor(public user: User, public server: Ax25Server) {
        this.session = new Session({
            remoteCallsign: user.callsign,
            remoteSSID: user.ssid,
            localCallsign: server.callsign,
            localSSID: server.ssid,
        });

        this.session.on("error", (err: any) => console.error(err));

        this.session.on("packet", (packet: Packet) => this.server.sendPacket(packet));

        this.session.on("data", (data: number[]) => {
            if (this.pages.length) {
                const dataString: string = Utils.byteArrayToString(data).replace(/(\r\n|\n|\r)/gm, "").trim();

                this.currentPage.receive(dataString, this.getCommandWithParams(dataString));
            }
        });

        this.session.on("connection", (state: boolean) => {
            if (state) {
                this.wantConnection = true;
            } else {
                this.close();
            }
        });
    }

    private setPage(page: Page = null): void {
        if (!page) {
            if (this.pages.length) {
                this.pages.pop();
                this.currentPage = this.pages[this.pages.length - 1];
            } else {
                this.sendString("Vous etes deja sur la premiere page");
            }
        } else {
            this.pages.push(page);
            this.currentPage = page;
        }

        let str: string = "== " + this.currentPage.title + " ==\n\n";

        str += this.currentPage.welcome ? this.currentPage.welcome : this.currentPage.getStringListCommand();

        this.sendString(str, 1);
    }

    public backPage(): void {
        this.setPage();
    }

    public addPage(page: Page): void {
        this.setPage(page);
    }

    public sendString(text: string, nbLinesBreakStart = 1) {
        let str = "";

        for (let i = 0; i < nbLinesBreakStart; i++) {
            str += "\n";
        }

        str += text;

        try {
            str += (text.endsWith("\n") ? "" : "\n");
        } catch (e) {}

        str += this.server.config.endPrompt;

        try {
            str = str.replace(/(\r\n|\n|\r)/gm, this.server.config.endOfLine);
        } catch (e) {}

        this.session.sendString(str);
    }

    public receive(packet: Packet) {
        this.session.receive(packet);
    }

    public open(): void {
        this.wantConnection = false;
        this.pages.length = 0;
        this.addPage(new PageBase(this));

        if (this.server.config.sendAllAction) {
            this.server.sendToAll("connecte au node", this, false);
        }
    }

    public close(): void {
        if (this.server.config.sendAllAction) {
            this.server.sendToAll("deconnecte du node", this, false);
        }

        if (this.server.config.byeMessage) {
            this.wantDisconnection = true;

            this.session.sendString(this.server.config.byeMessage);
        } else {
            this.disconnect();
        }
    }

    public get connected(): boolean {
        return this.session.connected;
    }

    public disconnect(): void {
        this.session.disconnect();

        this.pages.length = 0;
        this.wantConnection = false;
        this.wantDisconnection = false;
    }

    public equals(connection: Connection): boolean {
        return this.user.equals(connection.user) && this.date === connection.date;
    }

    private getCommandWithParams(text: string): string[] {
        return text.toLowerCase().split(" ");
    }
}

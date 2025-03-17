import { SrtcpContext } from "./context/srtcp";
import { type Config, Session } from "./session";
export declare class SrtcpSession extends Session<SrtcpContext> {
    config: Config;
    constructor(config: Config);
    decrypt: (buf: Buffer) => Buffer;
    encrypt(rawRtcp: Buffer): Buffer;
}

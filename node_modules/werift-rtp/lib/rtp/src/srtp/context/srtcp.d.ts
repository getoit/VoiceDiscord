import type { RtcpHeader } from "../../rtcp/header";
import type { Profile } from "../const";
import { Context } from "./context";
export declare class SrtcpContext extends Context {
    constructor(masterKey: Buffer, masterSalt: Buffer, profile: Profile);
    encryptRTCP(rawRtcp: Buffer): Buffer;
    decryptRTCP(encrypted: Buffer): [Buffer, RtcpHeader];
}

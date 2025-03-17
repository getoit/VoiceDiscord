import { RtpHeader } from "../../rtp/rtp";
import type { Profile } from "../const";
import { Context } from "./context";
export declare class SrtpContext extends Context {
    constructor(masterKey: Buffer, masterSalt: Buffer, profile: Profile);
    encryptRtp(payload: Buffer, header: RtpHeader): Buffer;
    decryptRtp(cipherText: Buffer): [Buffer, RtpHeader];
}

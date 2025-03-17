import { type Hmac } from "crypto";
import type { CipherAesBase } from "../cipher";
import { type Profile } from "../const";
export declare class Context {
    masterKey: Buffer;
    masterSalt: Buffer;
    profile: Profile;
    srtpSSRCStates: {
        [ssrc: number]: SrtpSsrcState;
    };
    srtpSessionKey: Buffer;
    srtpSessionSalt: Buffer;
    srtpSessionAuthTag: Buffer;
    srtpSessionAuth: Hmac;
    srtcpSSRCStates: {
        [ssrc: number]: SrtcpSSRCState;
    };
    srtcpSessionKey: Buffer;
    srtcpSessionSalt: Buffer;
    srtcpSessionAuthTag: Buffer;
    srtcpSessionAuth: Hmac;
    cipher: CipherAesBase;
    constructor(masterKey: Buffer, masterSalt: Buffer, profile: Profile);
    generateSessionKey(label: number): Buffer;
    generateSessionSalt(label: number): Buffer;
    generateSessionAuthTag(label: number): Buffer;
    getSrtpSsrcState(ssrc: number): SrtpSsrcState;
    getSrtcpSsrcState(ssrc: number): SrtcpSSRCState;
    updateRolloverCount(sequenceNumber: number, s: SrtpSsrcState): void;
    generateSrtpAuthTag(buf: Buffer, roc: number): Buffer;
    index(ssrc: number): number;
    setIndex(ssrc: number, index: number): void;
}
export interface SrtpSsrcState {
    ssrc: number;
    rolloverCounter: number;
    rolloverHasProcessed?: boolean;
    lastSequenceNumber: number;
}
export type SrtcpSSRCState = {
    srtcpIndex: number;
    ssrc: number;
};

import * as EBML from "./ebml";
export declare class WEBMContainer {
    readonly ebmlHeader: Uint8Array;
    trackEntries: EBML.EBMLData[];
    private trackIvs;
    trackKeyIds: {
        [trackNumber: number]: Buffer;
    };
    encryptionKey?: Buffer;
    readonly encryptionKeyID: Buffer;
    constructor(tracks: {
        width?: number;
        height?: number;
        roll?: number;
        kind: "audio" | "video";
        codec: SupportedCodec;
        trackNumber: number;
    }[], encryptionKey?: Buffer);
    createTrackEntry(kind: string, trackNumber: number, codec: string, { width, height, roll, }?: Partial<{
        kind: string;
        width: number;
        roll: number;
        height: number;
    }>): EBML.EBMLData;
    createSegment(
    /**ms */
    duration?: number): Uint8Array;
    createDuration(
    /**ms */
    duration: number): Uint8Array;
    createCuePoint(relativeTimestamp: number, trackNumber: number, clusterPosition: number, blockNumber: number): EBML.EBMLData;
    createCues(cuePoints: EBML.EBMLData[]): Uint8Array;
    createCluster(timecode: number): Uint8Array;
    createSimpleBlock(frame: Buffer, isKeyframe: boolean, trackNumber: number, relativeTimestamp: number): Buffer;
}
export declare const supportedCodecs: readonly ["MPEG4/ISO/AVC", "VP8", "VP9", "AV1", "OPUS"];
export type SupportedCodec = (typeof supportedCodecs)[number];

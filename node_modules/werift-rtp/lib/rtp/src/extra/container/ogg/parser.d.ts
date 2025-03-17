export interface Page {
    granulePosition: number;
    segments: Buffer[];
    segmentTable: number[];
}
export declare class OggParser {
    pages: Page[];
    private checkSegments;
    exportSegments(): Buffer[];
    read(buf: Buffer): this;
}

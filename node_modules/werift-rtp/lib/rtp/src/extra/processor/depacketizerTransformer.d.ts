import { TransformStream } from "stream/web";
import type { DepacketizerCodec } from "../../codec";
import { type DepacketizerInput, type DepacketizerOptions, type DepacketizerOutput } from "./depacketizer";
export declare const depacketizeTransformer: (codec: DepacketizerCodec, options?: DepacketizerOptions | undefined) => TransformStream<DepacketizerInput, DepacketizerOutput>;

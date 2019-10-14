declare module 'parse-hdr' {

    export default function parseHdr(buffer: ArrayBuffer): HdrImageResult;

    export interface HdrImageResult {
        shape: [number, number];
        exposure: number;
        gamma: number;
        data: Float32Array;
    }

}

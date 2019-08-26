import { Gl } from '../Gl';

export enum BufferObjectUsage {
    STREAM_DRAW,
    STREAM_COPY,
    STREAM_READ,
    STATIC_DRAW,
    STATIC_COPY,
    STATIC_READ,
    DYNAMIC_DRAW,
    DYNAMIC_COPY,
    DYNAMIC_READ,
}

export class BufferObjectUsageResolver {

    public static enumToGl(bufferObjectUsage: BufferObjectUsage): number {
        const gl = Gl.gl;
        switch (bufferObjectUsage) {
            case BufferObjectUsage.STREAM_DRAW: return gl.STREAM_DRAW;
            case BufferObjectUsage.STREAM_COPY: return gl.STATIC_COPY;
            case BufferObjectUsage.STREAM_READ: return gl.STREAM_READ;
            case BufferObjectUsage.STATIC_DRAW: return gl.STATIC_DRAW;
            case BufferObjectUsage.STATIC_COPY: return gl.STATIC_COPY;
            case BufferObjectUsage.STATIC_READ: return gl.STATIC_READ;
            case BufferObjectUsage.DYNAMIC_DRAW: return gl.DYNAMIC_DRAW;
            case BufferObjectUsage.DYNAMIC_COPY: return gl.DYNAMIC_COPY;
            case BufferObjectUsage.DYNAMIC_READ: return gl.DYNAMIC_READ;
            default: throw new Error('Invalid enum BufferObjectUsage');
        }
    }

}
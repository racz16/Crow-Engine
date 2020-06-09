import { Gl } from '../Gl';

export enum GlBufferObjectUsage {
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

export class GlBufferObjectUsageResolver {

    public static enumToGl(bufferObjectUsage: GlBufferObjectUsage): number {
        const gl = Gl.gl;
        switch (bufferObjectUsage) {
            case GlBufferObjectUsage.STREAM_DRAW: return gl.STREAM_DRAW;
            case GlBufferObjectUsage.STREAM_COPY: return gl.STATIC_COPY;
            case GlBufferObjectUsage.STREAM_READ: return gl.STREAM_READ;
            case GlBufferObjectUsage.STATIC_DRAW: return gl.STATIC_DRAW;
            case GlBufferObjectUsage.STATIC_COPY: return gl.STATIC_COPY;
            case GlBufferObjectUsage.STATIC_READ: return gl.STATIC_READ;
            case GlBufferObjectUsage.DYNAMIC_DRAW: return gl.DYNAMIC_DRAW;
            case GlBufferObjectUsage.DYNAMIC_COPY: return gl.DYNAMIC_COPY;
            case GlBufferObjectUsage.DYNAMIC_READ: return gl.DYNAMIC_READ;
            default: throw new Error('Invalid enum GlBufferObjectUsage');
        }
    }

}
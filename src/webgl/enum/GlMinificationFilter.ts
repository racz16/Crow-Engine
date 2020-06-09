import { Gl } from '../Gl';

export enum GlMinificationFilter {
    NEAREST,
    LINEAR,
    NEAREST_MIPMAP_NEAREST,
    NEAREST_MIPMAP_LINEAR,
    LINEAR_MIPMAP_NEAREST,
    LINEAR_MIPMAP_LINEAR,
}

export class GlMinificationFilterResolver {

    public static enumToGl(minificationFilter: GlMinificationFilter): number {
        const gl = Gl.gl;
        switch (minificationFilter) {
            case GlMinificationFilter.NEAREST: return gl.NEAREST;
            case GlMinificationFilter.LINEAR: return gl.LINEAR;
            case GlMinificationFilter.NEAREST_MIPMAP_NEAREST: return gl.NEAREST_MIPMAP_NEAREST;
            case GlMinificationFilter.NEAREST_MIPMAP_LINEAR: return gl.NEAREST_MIPMAP_LINEAR;
            case GlMinificationFilter.LINEAR_MIPMAP_NEAREST: return gl.LINEAR_MIPMAP_NEAREST;
            case GlMinificationFilter.LINEAR_MIPMAP_LINEAR: return gl.LINEAR_MIPMAP_LINEAR;
            default: throw new Error('Invalid enum GlMinificationFilter');
        }
    }

}
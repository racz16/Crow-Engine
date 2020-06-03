import { Gl } from '../Gl';

export enum MinificationFilter {
    NEAREST,
    LINEAR,
    NEAREST_MIPMAP_NEAREST,
    NEAREST_MIPMAP_LINEAR,
    LINEAR_MIPMAP_NEAREST,
    LINEAR_MIPMAP_LINEAR,
}

export class MinificationFilterResolver {

    public static enumToGl(minificationFilter: MinificationFilter): number {
        const gl = Gl.gl;
        switch (minificationFilter) {
            case MinificationFilter.NEAREST: return gl.NEAREST;
            case MinificationFilter.LINEAR: return gl.LINEAR;
            case MinificationFilter.NEAREST_MIPMAP_NEAREST: return gl.NEAREST_MIPMAP_NEAREST;
            case MinificationFilter.NEAREST_MIPMAP_LINEAR: return gl.NEAREST_MIPMAP_LINEAR;
            case MinificationFilter.LINEAR_MIPMAP_NEAREST: return gl.LINEAR_MIPMAP_NEAREST;
            case MinificationFilter.LINEAR_MIPMAP_LINEAR: return gl.LINEAR_MIPMAP_LINEAR;
            default: throw new Error('Invalid enum MinificationFilter');
        }
    }

}
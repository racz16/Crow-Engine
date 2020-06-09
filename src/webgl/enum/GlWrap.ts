import { Gl } from '../Gl';

export enum GlWrap {
    REPEAT,
    MIRRORED_REPEAT,
    CLAMP_TO_EDGE,
}

export class GlWrapResolver {

    public static enumToGl(wrap: GlWrap): number {
        const gl = Gl.gl;
        switch (wrap) {
            case GlWrap.REPEAT: return gl.REPEAT;
            case GlWrap.MIRRORED_REPEAT: return gl.MIRRORED_REPEAT;
            case GlWrap.CLAMP_TO_EDGE: return gl.CLAMP_TO_EDGE;
            default: throw new Error('Invalid enum GlWrap');
        }
    }

}
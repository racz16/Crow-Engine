import { Gl } from '../Gl';

export enum GlCullFace {
    BACK,
    FRONT,
    FRONT_AND_BACK,
}

export class GlCullFaceResolver {

    public static enumToGl(cullFace: GlCullFace): number {
        const gl = Gl.gl;
        switch (cullFace) {
            case GlCullFace.BACK: return gl.BACK;
            case GlCullFace.FRONT: return gl.FRONT;
            case GlCullFace.FRONT_AND_BACK: return gl.FRONT_AND_BACK;
            default: throw new Error('Invalid enum GlCullFace');
        }
    }

    public static glToEnum(cullFace: number): GlCullFace {
        const gl = Gl.gl;
        switch (cullFace) {
            case gl.BACK: return GlCullFace.BACK;
            case gl.FRONT: return GlCullFace.FRONT;
            case gl.FRONT_AND_BACK: return GlCullFace.FRONT_AND_BACK;
            default: throw new Error('Invalid WebGL cull face');
        }
    }

}
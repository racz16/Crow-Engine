import { Gl } from "../Gl";

export enum CullFace {
    BACK,
    FRONT,
    FRONT_AND_BACK,
}

export class CullFaceResolver {

    public static enumToGl(cullFace: CullFace): number {
        const gl = Gl.gl;
        switch (cullFace) {
            case CullFace.BACK: return gl.BACK;
            case CullFace.FRONT: return gl.FRONT;
            case CullFace.FRONT_AND_BACK: return gl.FRONT_AND_BACK;
            default: throw new Error('Invalid enum CullFace');
        }
    }

    public static glToEnum(cullFace: number): CullFace {
        const gl = Gl.gl;
        switch (cullFace) {
            case gl.BACK: return CullFace.BACK;
            case gl.FRONT: return CullFace.FRONT;
            case gl.FRONT_AND_BACK: return CullFace.FRONT_AND_BACK;
            default: throw new Error('Invalid WebGL cull face');
        }
    }

}
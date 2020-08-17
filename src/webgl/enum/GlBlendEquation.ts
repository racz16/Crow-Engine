import { Gl } from '../Gl';

export enum GlBlendEquation {
    FUNC_ADD,
    FUNC_SUBTRACT,
    FUNC_REVERSE_SUBTRACT,
    MIN,
    MAX
}

export class GlBlendEquationResolver {

    public static enumToGl(blendEquation: GlBlendEquation): number {
        const gl = Gl.gl;
        switch (blendEquation) {
            case GlBlendEquation.FUNC_ADD: return gl.FUNC_ADD;
            case GlBlendEquation.FUNC_SUBTRACT: return gl.FUNC_SUBTRACT;
            case GlBlendEquation.FUNC_REVERSE_SUBTRACT: return gl.FUNC_REVERSE_SUBTRACT;
            case GlBlendEquation.MIN: return gl.MIN;
            case GlBlendEquation.MAX: return gl.MAX;
            default: throw new Error('Invalid enum GlBlendEquation');
        }
    }

    public static glToEnum(blendEquation: number): GlBlendEquation {
        const gl = Gl.gl;
        switch (blendEquation) {
            case gl.FUNC_ADD: return GlBlendEquation.FUNC_ADD;
            case gl.FUNC_SUBTRACT: return GlBlendEquation.FUNC_SUBTRACT;
            case gl.FUNC_REVERSE_SUBTRACT: return GlBlendEquation.FUNC_REVERSE_SUBTRACT;
            case gl.MIN: return GlBlendEquation.MIN;
            case gl.MAX: return GlBlendEquation.MAX;
            default: throw new Error('Invalid WebGL blend equation');
        }
    }

}
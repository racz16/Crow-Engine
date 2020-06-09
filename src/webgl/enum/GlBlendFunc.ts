import { Gl } from '../Gl';

export enum GlBlendFunc {
    ZERO,
    ONE,
    SRC_COLOR,
    ONE_MINUS_SRC_COLOR,
    DST_COLOR,
    ONE_MINUS_DST_COLOR,
    SRC_ALPHA,
    ONE_MINUS_SRC_ALPHA,
    DST_ALPHA,
    ONE_MINUS_DST_ALPHA,
    CONSTANT_COLOR,
    ONE_MINUS_CONSTANT_COLOR,
    CONSTANT_ALPHA,
    ONE_MINUS_CONSTANT_ALPHA,
    SRC_ALPHA_SATURATE
}

export class GlBlendFuncResolver {

    public static enumToGl(blendFunc: GlBlendFunc): number {
        const gl = Gl.gl;
        switch (blendFunc) {
            case GlBlendFunc.ZERO: return gl.ZERO;
            case GlBlendFunc.ONE: return gl.ONE;
            case GlBlendFunc.SRC_COLOR: return gl.SRC_COLOR;
            case GlBlendFunc.ONE_MINUS_SRC_COLOR: return gl.ONE_MINUS_SRC_COLOR;
            case GlBlendFunc.DST_COLOR: return gl.DST_COLOR;
            case GlBlendFunc.ONE_MINUS_DST_COLOR: return gl.ONE_MINUS_DST_COLOR;
            case GlBlendFunc.SRC_ALPHA: return gl.SRC_ALPHA;
            case GlBlendFunc.ONE_MINUS_SRC_ALPHA: return gl.ONE_MINUS_SRC_ALPHA;
            case GlBlendFunc.DST_ALPHA: return gl.DST_ALPHA;
            case GlBlendFunc.ONE_MINUS_DST_ALPHA: return gl.ONE_MINUS_DST_ALPHA;
            case GlBlendFunc.CONSTANT_COLOR: return gl.CONSTANT_COLOR;
            case GlBlendFunc.ONE_MINUS_CONSTANT_COLOR: return gl.ONE_MINUS_CONSTANT_COLOR;
            case GlBlendFunc.CONSTANT_ALPHA: return gl.CONSTANT_ALPHA;
            case GlBlendFunc.ONE_MINUS_CONSTANT_ALPHA: return gl.ONE_MINUS_CONSTANT_ALPHA;
            case GlBlendFunc.SRC_ALPHA_SATURATE: return gl.SRC_ALPHA_SATURATE;
            default: throw new Error('Invalid enum GlBlendFunc');
        }
    }

    public static glToEnum(blendFunc: number): GlBlendFunc {
        const gl = Gl.gl;
        switch (blendFunc) {
            case gl.ZERO: return GlBlendFunc.ZERO;
            case gl.ONE: return GlBlendFunc.ONE;
            case gl.SRC_COLOR: return GlBlendFunc.SRC_COLOR;
            case gl.ONE_MINUS_SRC_COLOR: return GlBlendFunc.ONE_MINUS_SRC_COLOR;
            case gl.DST_COLOR: return GlBlendFunc.DST_COLOR;
            case gl.ONE_MINUS_DST_COLOR: return GlBlendFunc.ONE_MINUS_DST_COLOR;
            case gl.SRC_ALPHA: return GlBlendFunc.SRC_ALPHA;
            case gl.ONE_MINUS_SRC_ALPHA: return GlBlendFunc.ONE_MINUS_SRC_ALPHA;
            case gl.DST_ALPHA: return GlBlendFunc.DST_ALPHA;
            case gl.ONE_MINUS_DST_ALPHA: return GlBlendFunc.ONE_MINUS_DST_ALPHA;
            case gl.CONSTANT_COLOR: return GlBlendFunc.CONSTANT_COLOR;
            case gl.ONE_MINUS_CONSTANT_COLOR: return GlBlendFunc.ONE_MINUS_CONSTANT_COLOR;
            case gl.CONSTANT_ALPHA: return GlBlendFunc.CONSTANT_ALPHA;
            case gl.ONE_MINUS_CONSTANT_ALPHA: return GlBlendFunc.ONE_MINUS_CONSTANT_ALPHA;
            case gl.SRC_ALPHA_SATURATE: return GlBlendFunc.SRC_ALPHA_SATURATE;
            default: throw new Error('Invalid WebGL blend func');
        }
    }

}
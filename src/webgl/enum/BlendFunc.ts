import { Gl } from '../Gl';

export enum BlendFunc {
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

export class BlendFuncResolver {

    public static enumToGl(blendFunc: BlendFunc): number {
        const gl = Gl.gl;
        switch (blendFunc) {
            case BlendFunc.ZERO: return gl.ZERO;
            case BlendFunc.ONE: return gl.ONE;
            case BlendFunc.SRC_COLOR: return gl.SRC_COLOR;
            case BlendFunc.ONE_MINUS_SRC_COLOR: return gl.ONE_MINUS_SRC_COLOR;
            case BlendFunc.DST_COLOR: return gl.DST_COLOR;
            case BlendFunc.ONE_MINUS_DST_COLOR: return gl.ONE_MINUS_DST_COLOR;
            case BlendFunc.SRC_ALPHA: return gl.SRC_ALPHA;
            case BlendFunc.ONE_MINUS_SRC_ALPHA: return gl.ONE_MINUS_SRC_ALPHA;
            case BlendFunc.DST_ALPHA: return gl.DST_ALPHA;
            case BlendFunc.ONE_MINUS_DST_ALPHA: return gl.ONE_MINUS_DST_ALPHA;
            case BlendFunc.CONSTANT_COLOR: return gl.CONSTANT_COLOR;
            case BlendFunc.ONE_MINUS_CONSTANT_COLOR: return gl.ONE_MINUS_CONSTANT_COLOR;
            case BlendFunc.CONSTANT_ALPHA: return gl.CONSTANT_ALPHA;
            case BlendFunc.ONE_MINUS_CONSTANT_ALPHA: return gl.ONE_MINUS_CONSTANT_ALPHA;
            case BlendFunc.SRC_ALPHA_SATURATE: return gl.SRC_ALPHA_SATURATE;
            default: throw new Error('Invalid enum BlendFunc');
        }
    }

    public static glToEnum(blendFunc: number): BlendFunc {
        const gl = Gl.gl;
        switch (blendFunc) {
            case gl.ZERO: return BlendFunc.ZERO;
            case gl.ONE: return BlendFunc.ONE;
            case gl.SRC_COLOR: return BlendFunc.SRC_COLOR;
            case gl.ONE_MINUS_SRC_COLOR: return BlendFunc.ONE_MINUS_SRC_COLOR;
            case gl.DST_COLOR: return BlendFunc.DST_COLOR;
            case gl.ONE_MINUS_DST_COLOR: return BlendFunc.ONE_MINUS_DST_COLOR;
            case gl.SRC_ALPHA: return BlendFunc.SRC_ALPHA;
            case gl.ONE_MINUS_SRC_ALPHA: return BlendFunc.ONE_MINUS_SRC_ALPHA;
            case gl.DST_ALPHA: return BlendFunc.DST_ALPHA;
            case gl.ONE_MINUS_DST_ALPHA: return BlendFunc.ONE_MINUS_DST_ALPHA;
            case gl.CONSTANT_COLOR: return BlendFunc.CONSTANT_COLOR;
            case gl.ONE_MINUS_CONSTANT_COLOR: return BlendFunc.ONE_MINUS_CONSTANT_COLOR;
            case gl.CONSTANT_ALPHA: return BlendFunc.CONSTANT_ALPHA;
            case gl.ONE_MINUS_CONSTANT_ALPHA: return BlendFunc.ONE_MINUS_CONSTANT_ALPHA;
            case gl.SRC_ALPHA_SATURATE: return BlendFunc.SRC_ALPHA_SATURATE;
            default: throw new Error('Invalid WebGL blrnd func');
        }
    }

}
import { Gl } from '../Gl';

export enum Format {
    RED,
    RED_INTEGER,
    RG,
    RG_INTEGER,
    RGB,
    RGB_INTEGER,
    RGBA,
    RGBA_INTEGER,
    LUMINANCE_ALPHA,
    LUMINANCE,
    ALPHA,
}

export class FormatResolver {

    public static enumToGl(format: Format): number {
        const gl = Gl.gl;
        switch (format) {
            case Format.RED: return gl.RED;
            case Format.RED_INTEGER: return gl.RED_INTEGER;
            case Format.RG: return gl.RG;
            case Format.RG_INTEGER: return gl.RG_INTEGER;
            case Format.RGB: return gl.RGB;
            case Format.RGB_INTEGER: return gl.RGB_INTEGER;
            case Format.RGBA: return gl.RGBA;
            case Format.RGBA_INTEGER: return gl.RGBA_INTEGER;
            case Format.LUMINANCE_ALPHA: return gl.LUMINANCE_ALPHA;
            case Format.LUMINANCE: return gl.LUMINANCE;
            case Format.ALPHA: return gl.ALPHA;
            default: throw new Error('Invalid enum Format');
        }
    }

}
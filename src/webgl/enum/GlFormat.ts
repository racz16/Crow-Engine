import { Gl } from '../Gl';

export enum GlFormat {
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

export class GlFormatResolver {

    public static enumToGl(format: GlFormat): number {
        const gl = Gl.gl;
        switch (format) {
            case GlFormat.RED: return gl.RED;
            case GlFormat.RED_INTEGER: return gl.RED_INTEGER;
            case GlFormat.RG: return gl.RG;
            case GlFormat.RG_INTEGER: return gl.RG_INTEGER;
            case GlFormat.RGB: return gl.RGB;
            case GlFormat.RGB_INTEGER: return gl.RGB_INTEGER;
            case GlFormat.RGBA: return gl.RGBA;
            case GlFormat.RGBA_INTEGER: return gl.RGBA_INTEGER;
            case GlFormat.LUMINANCE_ALPHA: return gl.LUMINANCE_ALPHA;
            case GlFormat.LUMINANCE: return gl.LUMINANCE;
            case GlFormat.ALPHA: return gl.ALPHA;
            default: throw new Error('Invalid enum GlFormat');
        }
    }

}
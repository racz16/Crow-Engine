import { Gl } from "../Gl";

export enum TextureWrap {
    REPEAT,
    MIRRORED_REPEAT,
    CLAMP_TO_EDGE,
}

export class TextureWrapResolver {

    public static enumToGl(textureWrap: TextureWrap): number {
        const gl = Gl.gl;
        switch (textureWrap) {
            case TextureWrap.REPEAT: return gl.REPEAT;
            case TextureWrap.MIRRORED_REPEAT: return gl.MIRRORED_REPEAT;
            case TextureWrap.CLAMP_TO_EDGE: return gl.CLAMP_TO_EDGE;
            default: throw new Error('Invalid enum TextureWrap');
        }
    }

}
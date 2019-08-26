import { Gl } from '../Gl';

export enum TextureFilter {
    NEAREST,
    LINEAR,
    NEAREST_MIPMAP_NEAREST,
    NEAREST_MIPMAP_LINEAR,
    LINEAR_MIPMAP_NEAREST,
    LINEAR_MIPMAP_LINEAR,
}

export class TextureFilterResolver {

    public static enumToGl(textureFilter: TextureFilter): number {
        const gl = Gl.gl;
        switch (textureFilter) {
            case TextureFilter.NEAREST: return gl.NEAREST;
            case TextureFilter.LINEAR: return gl.LINEAR;
            case TextureFilter.NEAREST_MIPMAP_NEAREST: return gl.NEAREST_MIPMAP_NEAREST;
            case TextureFilter.NEAREST_MIPMAP_LINEAR: return gl.NEAREST_MIPMAP_LINEAR;
            case TextureFilter.LINEAR_MIPMAP_NEAREST: return gl.LINEAR_MIPMAP_NEAREST;
            case TextureFilter.LINEAR_MIPMAP_LINEAR: return gl.LINEAR_MIPMAP_LINEAR;
            default: throw new Error('Invalid enum TextureFilter');
        }
    }

}
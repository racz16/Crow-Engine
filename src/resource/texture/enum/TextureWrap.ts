import { GlWrap } from "../../../webgl/enum/GlWrap";

export enum TextureWrap {
    REPEAT,
    MIRRORED_REPEAT,
    CLAMP_TO_EDGE,
}

export class TextureWrapResolver {

    public static enumToGl(wrap: TextureWrap): GlWrap {
        switch (wrap) {
            case TextureWrap.REPEAT: return GlWrap.REPEAT;
            case TextureWrap.MIRRORED_REPEAT: return GlWrap.MIRRORED_REPEAT;
            case TextureWrap.CLAMP_TO_EDGE: return GlWrap.CLAMP_TO_EDGE;
            default: throw new Error('Invalid enum TextureWrap');
        }
    }

}
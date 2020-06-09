import { GlMagnificationFilter } from "../../../webgl/enum/GlMagnificationFIlter";
import { GlMinificationFilter } from "../../../webgl/enum/GlMinificationFilter";

export enum TextureFiltering {
    None,
    Bilinear,
    Trilinear,
    Anisotropic_2,
    Anisotropic_4,
    Anisotropic_8,
    Anisotropic_16,
}

export class TextureFilteringResolver {

    public static enumToGlMagnification(textureFilter: TextureFiltering): GlMagnificationFilter {
        if (textureFilter === TextureFiltering.None) {
            return GlMagnificationFilter.NEAREST;
        } else {
            return GlMagnificationFilter.LINEAR;
        }
    }

    public static enumToGlMinification(textureFilter: TextureFiltering): GlMinificationFilter {
        if (textureFilter === TextureFiltering.None) {
            return GlMinificationFilter.NEAREST_MIPMAP_NEAREST
        } else if (textureFilter === TextureFiltering.Bilinear) {
            return GlMinificationFilter.LINEAR_MIPMAP_NEAREST
        } else {
            return GlMinificationFilter.LINEAR_MIPMAP_LINEAR
        }
    }

    public static enumToGlAnisotropicValue(textureFilter: TextureFiltering): number {
        switch (textureFilter) {
            case TextureFiltering.None:
            case TextureFiltering.Bilinear:
            case TextureFiltering.Trilinear: return 1;
            case TextureFiltering.Anisotropic_2: return 2;
            case TextureFiltering.Anisotropic_4: return 4;
            case TextureFiltering.Anisotropic_8: return 8;
            case TextureFiltering.Anisotropic_16: return 16;
            default: throw new Error('Invalid enum TextureFiltering');
        }
    }

}
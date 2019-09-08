import { TextureFilter } from '../../../webgl/enum/TextureFilter';

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

    public static enumToGlMagnification(textureFilter: TextureFiltering): TextureFilter {
        if (textureFilter === TextureFiltering.None) {
            return TextureFilter.NEAREST;
        } else {
            return TextureFilter.LINEAR;
        }
    }

    public static enumToGlMinification(textureFilter: TextureFiltering): TextureFilter {
        if (textureFilter === TextureFiltering.None) {
            return TextureFilter.NEAREST_MIPMAP_NEAREST
        } else if (textureFilter === TextureFiltering.Bilinear) {
            return TextureFilter.LINEAR_MIPMAP_NEAREST
        } else {
            return TextureFilter.LINEAR_MIPMAP_LINEAR
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
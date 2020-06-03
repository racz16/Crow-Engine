import { Gl } from '../Gl';

export enum TextureDataType {
    BYTE,
    UNSIGNED_BYTE,
    SHORT,
    UNSIGNED_SHORT,
    INT,
    UNSIGNED_INT,
    HALF_FLOAT,
    FLOAT,
    UNSIGNED_SHORT_5_6_5,
    UNSIGNED_SHORT_4_4_4_4,
    UNSIGNED_SHORT_5_5_5_1,
    UNSIGNED_INT_2_10_10_10_REV,
    UNSIGNED_INT_10F_11F_11F_REV,
    UNSIGNED_INT_5_9_9_9_REV,
    UNSIGNED_INT_24_8,
    FLOAT_32_UNSIGNED_INT_24_8_REV
}

export class TextureDataTypeResolver {

    public static enumToGl(textureDataType: TextureDataType): number {
        const gl = Gl.gl;
        switch (textureDataType) {
            case TextureDataType.BYTE: return gl.BYTE;
            case TextureDataType.UNSIGNED_BYTE: return gl.UNSIGNED_BYTE;
            case TextureDataType.SHORT: return gl.SHORT;
            case TextureDataType.UNSIGNED_SHORT: return gl.UNSIGNED_SHORT;
            case TextureDataType.INT: return gl.INT;
            case TextureDataType.UNSIGNED_INT: return gl.UNSIGNED_INT;
            case TextureDataType.HALF_FLOAT: return gl.HALF_FLOAT;
            case TextureDataType.FLOAT: return gl.FLOAT;
            case TextureDataType.UNSIGNED_SHORT_5_6_5: return gl.UNSIGNED_SHORT_5_6_5;
            case TextureDataType.UNSIGNED_SHORT_4_4_4_4: return gl.UNSIGNED_SHORT_4_4_4_4;
            case TextureDataType.UNSIGNED_SHORT_5_5_5_1: return gl.UNSIGNED_SHORT_5_5_5_1;
            case TextureDataType.UNSIGNED_INT_2_10_10_10_REV: return gl.UNSIGNED_INT_2_10_10_10_REV;
            case TextureDataType.UNSIGNED_INT_10F_11F_11F_REV: return gl.UNSIGNED_INT_10F_11F_11F_REV;
            case TextureDataType.UNSIGNED_INT_5_9_9_9_REV: return gl.UNSIGNED_INT_5_9_9_9_REV;
            case TextureDataType.UNSIGNED_INT_24_8: return gl.UNSIGNED_INT_24_8;
            case TextureDataType.FLOAT_32_UNSIGNED_INT_24_8_REV: return gl.FLOAT_32_UNSIGNED_INT_24_8_REV;
            default: throw new Error('Invalid enum TextureDataType');
        }
    }

}
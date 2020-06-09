import { Gl } from '../Gl';

export enum GlTextureDataType {
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

export class GlTextureDataTypeResolver {

    public static enumToGl(textureDataType: GlTextureDataType): number {
        const gl = Gl.gl;
        switch (textureDataType) {
            case GlTextureDataType.BYTE: return gl.BYTE;
            case GlTextureDataType.UNSIGNED_BYTE: return gl.UNSIGNED_BYTE;
            case GlTextureDataType.SHORT: return gl.SHORT;
            case GlTextureDataType.UNSIGNED_SHORT: return gl.UNSIGNED_SHORT;
            case GlTextureDataType.INT: return gl.INT;
            case GlTextureDataType.UNSIGNED_INT: return gl.UNSIGNED_INT;
            case GlTextureDataType.HALF_FLOAT: return gl.HALF_FLOAT;
            case GlTextureDataType.FLOAT: return gl.FLOAT;
            case GlTextureDataType.UNSIGNED_SHORT_5_6_5: return gl.UNSIGNED_SHORT_5_6_5;
            case GlTextureDataType.UNSIGNED_SHORT_4_4_4_4: return gl.UNSIGNED_SHORT_4_4_4_4;
            case GlTextureDataType.UNSIGNED_SHORT_5_5_5_1: return gl.UNSIGNED_SHORT_5_5_5_1;
            case GlTextureDataType.UNSIGNED_INT_2_10_10_10_REV: return gl.UNSIGNED_INT_2_10_10_10_REV;
            case GlTextureDataType.UNSIGNED_INT_10F_11F_11F_REV: return gl.UNSIGNED_INT_10F_11F_11F_REV;
            case GlTextureDataType.UNSIGNED_INT_5_9_9_9_REV: return gl.UNSIGNED_INT_5_9_9_9_REV;
            case GlTextureDataType.UNSIGNED_INT_24_8: return gl.UNSIGNED_INT_24_8;
            case GlTextureDataType.FLOAT_32_UNSIGNED_INT_24_8_REV: return gl.FLOAT_32_UNSIGNED_INT_24_8_REV;
            default: throw new Error('Invalid enum GlTextureDataType');
        }
    }

}
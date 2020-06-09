import { Gl } from '../Gl';

export enum GlVertexAttribPointerType {
    BYTE,
    UNSIGNED_BYTE,
    SHORT,
    UNSIGNED_SHORT,
    INT,
    UNSIGNED_INT,
    HALF_FLOAT,
    FLOAT,
    UNSIGNED_INT_2_10_10_10_REV,
    INT_2_10_10_10_REV,
}

export class GlVertexAttribPointerTypeResolver {

    public static enumToGl(vertexAttribPointerType: GlVertexAttribPointerType): number {
        const gl = Gl.gl;
        switch (vertexAttribPointerType) {
            case GlVertexAttribPointerType.BYTE: return gl.BYTE;
            case GlVertexAttribPointerType.UNSIGNED_BYTE: return gl.UNSIGNED_BYTE;
            case GlVertexAttribPointerType.SHORT: return gl.SHORT;
            case GlVertexAttribPointerType.UNSIGNED_SHORT: return gl.UNSIGNED_SHORT;
            case GlVertexAttribPointerType.INT: return gl.INT;
            case GlVertexAttribPointerType.UNSIGNED_INT: return gl.UNSIGNED_INT;
            case GlVertexAttribPointerType.HALF_FLOAT: return gl.HALF_FLOAT;
            case GlVertexAttribPointerType.FLOAT: return gl.FLOAT;
            case GlVertexAttribPointerType.UNSIGNED_INT_2_10_10_10_REV: return gl.UNSIGNED_INT_2_10_10_10_REV;
            case GlVertexAttribPointerType.INT_2_10_10_10_REV: return gl.INT_2_10_10_10_REV;
            default: throw new Error('Invalid enum GlVertexAttribPointerType');
        }
    }

}
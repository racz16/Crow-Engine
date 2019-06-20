import { Gl } from "../Gl";

export enum VertexAttribPointerType {
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

export class VertexAttribPointerTypeResolver {

    public static enumToGl(vertexAttribPointerType: VertexAttribPointerType): number {
        const gl = Gl.gl;
        switch (vertexAttribPointerType) {
            case VertexAttribPointerType.BYTE: return gl.BYTE;
            case VertexAttribPointerType.UNSIGNED_BYTE: return gl.UNSIGNED_BYTE;
            case VertexAttribPointerType.SHORT: return gl.SHORT;
            case VertexAttribPointerType.UNSIGNED_SHORT: return gl.UNSIGNED_SHORT;
            case VertexAttribPointerType.INT: return gl.INT;
            case VertexAttribPointerType.UNSIGNED_INT: return gl.UNSIGNED_INT;
            case VertexAttribPointerType.HALF_FLOAT: return gl.HALF_FLOAT;
            case VertexAttribPointerType.FLOAT: return gl.FLOAT;
            case VertexAttribPointerType.UNSIGNED_INT_2_10_10_10_REV: return gl.UNSIGNED_INT_2_10_10_10_REV;
            case VertexAttribPointerType.INT_2_10_10_10_REV: return gl.INT_2_10_10_10_REV;
            default: throw new Error('Invalid enum VertexAttribPointerType');
        }
    }

}
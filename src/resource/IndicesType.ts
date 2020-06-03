import { Gl } from "../webgl/Gl";

export enum IndicesType {
    UNSIGNED_BYTE,
    UNSIGNED_SHORT,
    UNSIGNED_INT,
}

export class IndicesTypeResolver {

    public static enumToGl(indicesType: IndicesType): number {
        switch (indicesType) {
            case IndicesType.UNSIGNED_BYTE: return Gl.gl.UNSIGNED_BYTE;
            case IndicesType.UNSIGNED_SHORT: return Gl.gl.UNSIGNED_SHORT;
            case IndicesType.UNSIGNED_INT: return Gl.gl.UNSIGNED_INT;
            default: throw new Error('Invalid enum IndicesType');
        }
    }

}
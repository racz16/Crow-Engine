import { Gl } from '../Gl';

export enum CubeMapSide {
    RIGHT,
    LEFT,
    UP,
    DOWN,
    FRONT,
    BACK,
}

export class CubeMapSideResolver {

    public static enumToGl(cubeMapSide: CubeMapSide): number {
        const gl = Gl.gl;
        switch (cubeMapSide) {
            case CubeMapSide.RIGHT: return gl.TEXTURE_CUBE_MAP_POSITIVE_X;
            case CubeMapSide.LEFT: return gl.TEXTURE_CUBE_MAP_NEGATIVE_X;
            case CubeMapSide.UP: return gl.TEXTURE_CUBE_MAP_POSITIVE_Y;
            case CubeMapSide.DOWN: return gl.TEXTURE_CUBE_MAP_NEGATIVE_Y;
            case CubeMapSide.FRONT: return gl.TEXTURE_CUBE_MAP_POSITIVE_Z;
            case CubeMapSide.BACK: return gl.TEXTURE_CUBE_MAP_NEGATIVE_Z;
            default: throw new Error('Invalid enum CubeMapSide');
        }
    }

    public static indexToEnum(index: number): CubeMapSide {
        switch (index) {
            case 0: return CubeMapSide.RIGHT;
            case 1: return CubeMapSide.LEFT;
            case 2: return CubeMapSide.UP;
            case 3: return CubeMapSide.DOWN;
            case 4: return CubeMapSide.FRONT;
            case 5: return CubeMapSide.BACK;
            default: throw new Error('Invalid index');
        }
    }

}
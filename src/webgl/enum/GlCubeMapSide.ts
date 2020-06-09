import { Gl } from '../Gl';

export enum GlCubeMapSide {
    RIGHT,
    LEFT,
    UP,
    DOWN,
    FRONT,
    BACK,
}

export class GlCubeMapSideResolver {

    public static enumToGl(cubeMapSide: GlCubeMapSide): number {
        const gl = Gl.gl;
        switch (cubeMapSide) {
            case GlCubeMapSide.RIGHT: return gl.TEXTURE_CUBE_MAP_POSITIVE_X;
            case GlCubeMapSide.LEFT: return gl.TEXTURE_CUBE_MAP_NEGATIVE_X;
            case GlCubeMapSide.UP: return gl.TEXTURE_CUBE_MAP_POSITIVE_Y;
            case GlCubeMapSide.DOWN: return gl.TEXTURE_CUBE_MAP_NEGATIVE_Y;
            case GlCubeMapSide.FRONT: return gl.TEXTURE_CUBE_MAP_POSITIVE_Z;
            case GlCubeMapSide.BACK: return gl.TEXTURE_CUBE_MAP_NEGATIVE_Z;
            default: throw new Error('Invalid enum GlCubeMapSide');
        }
    }

    public static indexToEnum(index: number): GlCubeMapSide {
        switch (index) {
            case 0: return GlCubeMapSide.RIGHT;
            case 1: return GlCubeMapSide.LEFT;
            case 2: return GlCubeMapSide.UP;
            case 3: return GlCubeMapSide.DOWN;
            case 4: return GlCubeMapSide.FRONT;
            case 5: return GlCubeMapSide.BACK;
            default: throw new Error('Invalid index');
        }
    }

}
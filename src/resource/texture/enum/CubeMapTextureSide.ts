import { GlCubeMapSide } from "../../../webgl/enum/GlCubeMapSide";

export enum CubeMapTextureSide {
    RIGHT,
    LEFT,
    UP,
    DOWN,
    FRONT,
    BACK,
}

export class CubeMapTextureSideResolver {

    public static enumToGl(cubeMapSide: CubeMapTextureSide): GlCubeMapSide {
        switch (cubeMapSide) {
            case CubeMapTextureSide.RIGHT: return GlCubeMapSide.RIGHT;
            case CubeMapTextureSide.LEFT: return GlCubeMapSide.LEFT;
            case CubeMapTextureSide.UP: return GlCubeMapSide.UP;
            case CubeMapTextureSide.DOWN: return GlCubeMapSide.DOWN;
            case CubeMapTextureSide.FRONT: return GlCubeMapSide.FRONT;
            case CubeMapTextureSide.BACK: return GlCubeMapSide.BACK;
            default: throw new Error('Invalid enum CubeMapTextureSide');
        }
    }

}
import { Gl } from "../webgl/Gl";

export enum RenderingMode {
    POINTS,
    LINES,
    LINE_LOOP,
    LINE_STRIP,
    TRIANGLES,
    TRIANGLE_STRIP,
    TRIANGLE_FAN,
}

export class RenderingModeResolver {

    public static enumToGl(renderingMode: RenderingMode): number {
        switch (renderingMode) {
            case RenderingMode.POINTS: return Gl.gl.POINTS;
            case RenderingMode.LINES: return Gl.gl.LINES;
            case RenderingMode.LINE_LOOP: return Gl.gl.LINE_LOOP;
            case RenderingMode.LINE_STRIP: return Gl.gl.LINE_STRIP;
            case RenderingMode.TRIANGLES: return Gl.gl.TRIANGLES;
            case RenderingMode.TRIANGLE_STRIP: return Gl.gl.TRIANGLE_STRIP;
            case RenderingMode.TRIANGLE_FAN: return Gl.gl.TRIANGLE_FAN;
            default: throw new Error('Invalid enum RenderingMode');
        }
    }

}
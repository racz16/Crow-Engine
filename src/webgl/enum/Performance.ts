import { Gl } from "../Gl";

export enum Performance {
    FASTEST,
    NICEST,
    DONT_CARE
}

export class PerformanceResolver {

    public static enumToGl(performance: Performance): number {
        const gl = Gl.gl;
        switch (performance) {
            case Performance.FASTEST: return gl.FASTEST;
            case Performance.NICEST: return gl.NICEST;
            case Performance.DONT_CARE: return gl.DONT_CARE;
            default: throw new Error('Invalid enum PerformanceResolver');
        }
    }

}
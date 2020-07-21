import { Gl } from '../Gl';

export enum GlPerformance {
    FASTEST,
    NICEST,
    DONT_CARE
}

export class GlPerformanceResolver {

    public static enumToGl(performance: GlPerformance): number {
        const gl = Gl.gl;
        switch (performance) {
            case GlPerformance.FASTEST: return gl.FASTEST;
            case GlPerformance.NICEST: return gl.NICEST;
            case GlPerformance.DONT_CARE: return gl.DONT_CARE;
            default: throw new Error('Invalid enum GlPerformance');
        }
    }

}
import { Gl } from '../Gl';

export enum GlMagnificationFilter {
    NEAREST,
    LINEAR,
}

export class GlMagnificationFilterResolver {

    public static enumToGl(magnificationFilter: GlMagnificationFilter): number {
        const gl = Gl.gl;
        switch (magnificationFilter) {
            case GlMagnificationFilter.NEAREST: return gl.NEAREST;
            case GlMagnificationFilter.LINEAR: return gl.LINEAR;
            default: throw new Error('Invalid enum GlMagnificationFilter');
        }
    }

}
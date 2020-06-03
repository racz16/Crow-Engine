import { Gl } from '../Gl';

export enum MagnificationFilter {
    NEAREST,
    LINEAR,
}

export class MagnificationFilterResolver {

    public static enumToGl(magnificationFilter: MagnificationFilter): number {
        const gl = Gl.gl;
        switch (magnificationFilter) {
            case MagnificationFilter.NEAREST: return gl.NEAREST;
            case MagnificationFilter.LINEAR: return gl.LINEAR;
            default: throw new Error('Invalid enum MagnificationFilter');
        }
    }

}
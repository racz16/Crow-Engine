import { Gl } from '../Gl';

export enum GlShaderStage {
    VERTEX_SHADER,
    FRAGMENT_SHADER,
}

export class GlShaderStageResolver {

    public static enumToGl(shaderStage: GlShaderStage): number {
        const gl = Gl.gl;
        switch (shaderStage) {
            case GlShaderStage.VERTEX_SHADER: return gl.VERTEX_SHADER;
            case GlShaderStage.FRAGMENT_SHADER: return gl.FRAGMENT_SHADER;
            default: throw new Error('Invalid enum GlShaderStage');
        }
    }

}
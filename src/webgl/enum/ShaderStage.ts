import { Gl } from '../Gl';

export enum ShaderStage {
    VERTEX_SHADER,
    FRAGMENT_SHADER,
}

export class ShaderStageResolver {

    public static enumToGl(shaderStage: ShaderStage): number {
        const gl = Gl.gl;
        switch (shaderStage) {
            case ShaderStage.VERTEX_SHADER: return gl.VERTEX_SHADER;
            case ShaderStage.FRAGMENT_SHADER: return gl.FRAGMENT_SHADER;
            default: throw new Error('Invalid enum ShaderStage');
        }
    }

}
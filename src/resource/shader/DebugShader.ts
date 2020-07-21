import { Shader } from './Shader';
import { ReadonlyMat4 } from 'gl-matrix';
import { Conventions } from '../Conventions';

export class DebugShader extends Shader {

    protected getVertexShaderPath(): string {
        return 'res/shaders/debug/debug.vs';
    }
    protected getFragmentShaderPath(): string {
        return 'res/shaders/debug/debug.fs';
    }

    public connectTextureUnits(): void {
        this.getShaderProgram().connectTextureUnit('image', Conventions.TU_ZERO);
    }

    public setUniforms(data: { transformation: ReadonlyMat4, layer: number }): void {
        this.getShaderProgram().loadMatrix4('transformation', data.transformation);
        this.getShaderProgram().loadInt('layer', data.layer);
    }

}

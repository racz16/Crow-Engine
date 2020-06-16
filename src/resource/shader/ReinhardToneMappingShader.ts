import { Shader } from './Shader';
import { Conventions } from '../Conventions';

export class ReinhardToneMappingShader extends Shader {

    protected connectTextureUnits(): void {
        this.getShaderProgram().connectTextureUnit('image', Conventions.TU_ZERO);
    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/reinhardToneMapping/reinhardToneMapping.vs';
    }

    protected getFragmentShaderPath(): string {
        return 'res/shaders/reinhardToneMapping/reinhardToneMapping.fs';
    }

}
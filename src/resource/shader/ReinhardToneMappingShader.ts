import { Shader } from './Shader';
import { Conventions } from '../Conventions';

export class ReinhardToneMappingShader extends Shader {

    protected connectTextureUnits(): void {
        this.getShaderProgram().connectTextureUnit('image', Conventions.ZERO_TEXTURE_UNIT);
    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/reinhardToneMapping/reinhardToneMapping.vs';
    }

    protected getFragmentShaderPath(): string {
        return 'res/shaders/reinhardToneMapping/reinhardToneMapping.fs';
    }

}
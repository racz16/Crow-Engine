import { Shader } from './Shader';

export class ReinhardToneMappingShader extends Shader {

    protected connectTextureUnits(): void {
        this.getShaderProgram().connectTextureUnit('image', 0);
    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/reinhardToneMapping/reinhardToneMapping.vs';
    }

    protected getFragmentShaderPath(): string {
        return 'res/shaders/reinhardToneMapping/reinhardToneMapping.fs';
    }

}
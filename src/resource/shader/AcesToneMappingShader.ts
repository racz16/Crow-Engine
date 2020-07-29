import { Shader } from './Shader';
import { Conventions } from '../Conventions';

export class AcesToneMappingShader extends Shader {

    protected connectTextureUnits(): void {
        this.getShaderProgram().connectTextureUnit('image', Conventions.TU_ZERO);
    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/acesToneMapping/acesToneMapping.vs';
    }

    protected getFragmentShaderPath(): string {
        return 'res/shaders/acesToneMapping/acesToneMapping.fs';
    }

}
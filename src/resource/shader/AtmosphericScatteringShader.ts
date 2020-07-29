import { Shader } from './Shader';

export class AtmosphericScatteringShader extends Shader {

    protected getVertexShaderPath(): string {
        return 'res/shaders/atmosphericScattering/atmosphericScattering.vs';
    }

    protected getFragmentShaderPath(): string {
        return 'res/shaders/atmosphericScattering/atmosphericScattering.fs';
    }

}
import { Shader } from './Shader';
import { RenderingPipeline } from '../../rendering/RenderingPipeline';
import { Engine } from '../../core/Engine';

export class SkyBoxShader extends Shader {

    public constructor() {
        super();
    }

    public setUniforms() {
        this.getShaderProgram().bindUniformBlockToBindingPoint(RenderingPipeline.CAMERA_BINDING_POINT);

        const skybox = Engine.getParameters().get(Engine.MAIN_SKYBOX);
        skybox.bindToTextureUnit(0);
        this.getShaderProgram().loadBoolean('isThereCubeMap', true);
    }

    protected connect(): void {
        this.getShaderProgram().connectTextureUnit('cubeMap', 0);
    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/skybox/vertex.glsl';
    }
    protected getFragmentShaderPath(): string {
        return 'res/shaders/skybox/fragment.glsl';
    }

}

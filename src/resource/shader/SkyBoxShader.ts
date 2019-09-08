import { Shader } from './Shader';
import { RenderingPipeline } from '../../rendering/RenderingPipeline';
import { Engine } from '../../core/Engine';

export class SkyBoxShader extends Shader {

    public setUniforms() {
        this.getShaderProgram().bindUniformBlockToBindingPoint(RenderingPipeline.CAMERA_BINDING_POINT);

        const skybox = Engine.getParameters().get(Engine.MAIN_SKYBOX);
        skybox.getNativeTexture().bindToTextureUnit(0);
        this.getShaderProgram().loadBoolean('isThereCubeMap', true);
    }

    protected connectTextureUnits(): void {
        this.getShaderProgram().connectTextureUnit('cubeMap', 0);
    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/skybox/vertex.glsl';
    }
    protected getFragmentShaderPath(): string {
        return 'res/shaders/skybox/fragment.glsl';
    }

}

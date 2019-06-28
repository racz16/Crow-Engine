import { Shader } from "./Shader";
import { Scene } from "../../core/Scene";
import { RenderingPipeline } from "../../rendering/RenderingPipeline";
import { Utility } from "../../utility/Utility";

export class SkyBoxShader extends Shader {

    public constructor() {
        super();
        Utility.bindUniformBlockToBindingPoint(this.getShaderProgram(), RenderingPipeline.CAMERA_BINDING_POINT);
    }

    public setUniforms() {
        const skybox = Scene.getParameters().getValue(Scene.MAIN_SKYBOX);
        skybox.bindToTextureUnit(0);
        this.getShaderProgram().loadBoolean("isThereCubeMap", true);
    }

    protected connect(): void {
        this.getShaderProgram().connectTextureUnit("cubeMap", 0);
    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/skybox/vertex.glsl';
    }
    protected getFragmentShaderPath(): string {
        return 'res/shaders/skybox/fragment.glsl';
    }

}

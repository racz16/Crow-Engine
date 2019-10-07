import { GeometryRenderer } from '../GeometryRenderer';
import { PbrShader } from '../../resource/shader/PbrShader';
import { PbrLightsStruct } from '../../component/light/pbr/PbrLightsStruct';
import { Conventions } from '../../resource/Conventions';

export class PbrRenderer extends GeometryRenderer {

    private shader: PbrShader;

    public constructor() {
        super('PBR Renderer');
        this.shader = new PbrShader();
    }

    protected beforeRendering(): void {
        super.beforeRendering();
        PbrLightsStruct.getInstance().refreshUbo();
        PbrLightsStruct.getInstance().useUbo();
        this.shader.getNativeShaderProgram().bindUniformBlockToBindingPoint(Conventions.LIGHTS_BINDING_POINT);
    }

    public getShader(): PbrShader {
        return this.shader;
    }

}
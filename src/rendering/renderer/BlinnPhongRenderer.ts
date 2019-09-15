import { BlinnPhongShader } from '../../resource/shader/blinnphong/BlinnPhongShader';
import { BlinnPhongLightsStruct } from '../../component/light/blinnphong/BlinnPhongLightsStruct';
import { GeometryRenderer } from '../GeometryRenderer';

export class BlinnPhongRenderer extends GeometryRenderer {

    private shader: BlinnPhongShader;

    public constructor() {
        super('Blinn-Phong Renderer');
        this.shader = new BlinnPhongShader();
    }

    protected beforeRendering(): void {
        super.beforeRendering();
        BlinnPhongLightsStruct.getInstance().refreshUbo();
        BlinnPhongLightsStruct.getInstance().useUbo();
    }

    private beforeDrawShader(): void {
        //shadow map
        /*Parameter < Texture2D > shadowMap = RenderingPipeline.getParameters().get(RenderingPipeline.SHADOWMAP);
        if (shadowMap) {
            shadowMap.getValue().bindToTextureUnit(0);
        }*/
    }

    public getShader(): BlinnPhongShader {
        return this.shader;
    }

}
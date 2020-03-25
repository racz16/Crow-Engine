import { BlinnPhongShader } from '../../resource/shader/BlinnPhongShader';
import { BlinnPhongLightsStruct } from '../../component/light/blinnphong/BlinnPhongLightsStruct';
import { GeometryRenderer } from '../GeometryRenderer';
import { Conventions } from '../../resource/Conventions';
import { Engine } from '../../core/Engine';
import { RenderingPipeline } from '../RenderingPipeline';
import { mat4 } from 'gl-matrix';

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
        this.shader.getNativeShaderProgram().bindUniformBlockToBindingPoint(Conventions.LIGHTS_BINDING_POINT);
        let mats = Engine.getRenderingPipeline().getParameters().get(RenderingPipeline.SHADOW_PROJECTION_VIEW_MATRICES);
        if (!mats || !mats.length) {
            mats = new Array<mat4>(mat4.create());
        }
        for (let i = 0; i < mats.length; i++) {
            this.shader.getNativeShaderProgram().loadMatrix4(`shadowProjectionViewMatrices[${i}]`, mats[i]);
        }
        let splits = Engine.getRenderingPipeline().getParameters().get(RenderingPipeline.SHADOW_SPLITS);
        if (!splits || !splits.length) {
            splits = new Array<number>();
            splits.push(1);
        }
        for (let i = 0; i < splits.length; i++) {
            this.shader.getNativeShaderProgram().loadFloat(`splits[${i}]`, splits[i]);
        }
    }

    public getShader(): BlinnPhongShader {
        return this.shader;
    }

}
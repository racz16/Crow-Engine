import { GeometryRenderer } from '../GeometryRenderer';
import { PbrShader } from '../../resource/shader/PbrShader';
import { PbrLightsStruct } from '../../component/light/pbr/PbrLightsStruct';
import { Conventions } from '../../resource/Conventions';
import { Engine } from '../../core/Engine';
import { RenderingPipeline } from '../RenderingPipeline';
import { mat4 } from 'gl-matrix';

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

    public getShader(): PbrShader {
        return this.shader;
    }

}
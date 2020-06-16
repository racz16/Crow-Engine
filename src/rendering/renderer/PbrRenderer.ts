import { GeometryRenderer } from '../GeometryRenderer';
import { PbrShader } from '../../resource/shader/PbrShader';
import { PbrLightsStruct } from '../../component/light/pbr/PbrLightsStruct';
import { Conventions } from '../../resource/Conventions';
import { Engine } from '../../core/Engine';
import { RenderingPipeline } from '../RenderingPipeline';
import { mat4 } from 'gl-matrix';
import { AlphaMode } from '../../material/AlphaMode';
import { Gl } from '../../webgl/Gl';
import { IRenderableComponent } from '../../component/renderable/IRenderableComponent';
import { IRenderable } from '../../resource/IRenderable';
import { GlConstants } from '../../webgl/GlConstants';

export class PbrRenderer extends GeometryRenderer {

    private shader: PbrShader;

    public constructor() {
        super('PBR Renderer');
        if (!GlConstants.COLOR_BUFFER_FLOAT_ENABLED || !GlConstants.TEXTURE_FLOAT_LINEAR_ENABLED) {
            throw new Error();
        }
        this.shader = new PbrShader();
    }

    protected beforeRendering(): void {
        super.beforeRendering();
        PbrLightsStruct.getInstance().refreshUbo();
        PbrLightsStruct.getInstance().useUbo();
        this.shader.getNativeShaderProgram().bindUniformBlockToBindingPoint(Conventions.BP_LIGHTS);
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

    protected setAlphaMode(renderableComponent: IRenderableComponent<IRenderable>, alphaMode: AlphaMode): void {
        this.getShader().getNativeShaderProgram().loadInt('alphaMode', alphaMode);
        Gl.setEnableBlend(alphaMode === AlphaMode.BLEND);
        if (alphaMode === AlphaMode.MASK) {
            const alphaCutoff = renderableComponent.getMaterial().getParameters().get(Conventions.MP_ALPHA_CUTOFF) ?? 0.5;
            this.getShader().getNativeShaderProgram().loadFloat('alphaCutoff', alphaCutoff);
        }
    }

    public getShader(): PbrShader {
        return this.shader;
    }

}
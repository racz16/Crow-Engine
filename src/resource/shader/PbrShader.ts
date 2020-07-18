import { Shader } from './Shader';
import { IRenderableComponent } from '../../component/renderable/IRenderableComponent';
import { IRenderable } from '../IRenderable';
import { mat3, vec2 } from 'gl-matrix';
import { ShaderSlotHelper } from './slotHelper/ShaderSlotHelper';
import { NormalSlotHelper } from './slotHelper/NormalSlotHelper';
import { BaseColorSlotHelper } from './slotHelper/BaseColorSlotHelper';
import { RoughnessMetalnessSlotHelper } from './slotHelper/RoughnessMetalnessSlotHelper';
import { EmissiveSlotHelper } from './slotHelper/EmissiveSlotHelper';
import { GlTexture2D } from '../../webgl/texture/GlTexture2D';
import { GlInternalFormat } from '../../webgl/enum/GlInternalFormat';
import { GlFormat } from '../../webgl/enum/GlFormat';
import { Utility } from '../../utility/Utility';
import { GlWrap } from '../../webgl/enum/GlWrap';
import { PbrIblHelper } from './PbrIblHelper';
import { Engine } from '../../core/Engine';
import { RenderingPipeline } from '../../rendering/RenderingPipeline';
import { PbrLightsStruct } from '../../component/light/pbr/PbrLightsStruct';
import { GlMinificationFilter } from '../../webgl/enum/GlMinificationFilter';
import { GlMagnificationFilter } from '../../webgl/enum/GlMagnificationFIlter';
import { OcclusionSlotHelper } from './slotHelper/OcclusionSlotHelper';
import { Conventions } from '../Conventions';

export class PbrShader extends Shader {

    private slotHelpers: Array<ShaderSlotHelper>;
    private pbrIblHelper: PbrIblHelper;
    private brdfLut: GlTexture2D;

    public constructor() {
        super();
        this.createBrdfLut();
        this.slotHelpers = [
            new BaseColorSlotHelper(this.getShaderProgram(), Conventions.TU_BASE_COLOR, true),
            new NormalSlotHelper(this.getShaderProgram(), Conventions.TU_NORMAL_POM, true),
            new RoughnessMetalnessSlotHelper(this.getShaderProgram(), Conventions.TU_ROUGHNESS_METALNESS, true),
            new OcclusionSlotHelper(this.getShaderProgram(), Conventions.TU_OCCLUSION, true),
            new EmissiveSlotHelper(this.getShaderProgram(), Conventions.TU_EMISSIVE, true)
        ];
        this.pbrIblHelper = new PbrIblHelper(this.getShaderProgram(), this.brdfLut);
    }

    private async createBrdfLut(): Promise<void> {
        this.brdfLut = new GlTexture2D();
        this.brdfLut.allocate(GlInternalFormat.RG8, vec2.fromValues(512, 512), false);
        this.brdfLut.setWrapU(GlWrap.CLAMP_TO_EDGE);
        this.brdfLut.setWrapV(GlWrap.CLAMP_TO_EDGE);
        this.brdfLut.setMinificationFilter(GlMinificationFilter.NEAREST);
        this.brdfLut.setMagnificationFilter(GlMagnificationFilter.NEAREST);
        const data = await Utility.loadImage('res/textures/brdfLUT.png');
        this.brdfLut.store(data, GlFormat.RG, false);
    }

    public setUniforms(renderableComponent: IRenderableComponent<IRenderable>): void {
        this.setMatrixUniforms(renderableComponent);
        const material = renderableComponent.getMaterial();
        for (const helper of this.slotHelpers) {
            helper.loadSlot(material);
        }
        this.pbrIblHelper.loadIblMaps();
        this.getShaderProgram().loadInt('shadowLightIndex', PbrLightsStruct.getInstance().getShadowLightIndex());
        this.getShaderProgram().loadBoolean('receiveShadow', renderableComponent.isReceiveShadows());
        this.getShaderProgram().loadBoolean('isThereVertexColor', renderableComponent.getRenderable().hasVertexColors());
        this.getShaderProgram().loadBoolean('isThereNormal', renderableComponent.getRenderable().hasNormals());
        this.getShaderProgram().loadBoolean('isThereTangent', renderableComponent.getRenderable().hasTangents());
    }

    private setMatrixUniforms(renderableComponent: IRenderableComponent<IRenderable>): void {
        const model = renderableComponent.getModelMatrix();
        const inverseModel3x3 = mat3.fromMat4(mat3.create(), renderableComponent.getInverseModelMatrix());
        this.getShaderProgram().loadMatrix3('inverseTransposedModelMatrix3x3', inverseModel3x3, true);
        this.getShaderProgram().loadMatrix4('modelMatrix', model, false);
    }

    public connectTextureUnits(): void {
        let shadowMap = Engine.getRenderingPipeline().getParameters().get(RenderingPipeline.SHADOWMAP);
        const isThereShadowMap = Utility.isUsable(shadowMap);
        if (!isThereShadowMap) {
            shadowMap = Engine.getParameters().get(Engine.BLACK_TEXTURE_2D_ARRAY);
        }
        this.loadTexture2DArray(shadowMap, Conventions.TU_SHADOW);
        this.getShaderProgram().connectTextureUnit('shadowMap', Conventions.TU_SHADOW);
    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/pbr/pbr.vs';
    }

    protected getFragmentShaderPath(): string {
        return 'res/shaders/pbr/pbr.fs';
    }

}
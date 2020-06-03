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
import { InternalFormat } from '../../webgl/enum/InternalFormat';
import { Format } from '../../webgl/enum/Format';
import { Utility } from '../../utility/Utility';
import { TextureWrap } from '../../webgl/enum/TextureWrap';
import { PbrIblHelper } from './PbrIblHelper';
import { Engine } from '../../core/Engine';
import { RenderingPipeline } from '../../rendering/RenderingPipeline';
import { PbrLightsStruct } from '../../component/light/pbr/PbrLightsStruct';
import { MinificationFilter } from '../../webgl/enum/MinificationFilter';
import { MagnificationFilter } from '../../webgl/enum/MagnificationFIlter';
import { OcclusionSlotHelper } from './slotHelper/OcclusionSlotHelper';

export class PbrShader extends Shader {

    private readonly SHADOW_TEXTURE_UNIT = 9;
    private readonly BASE_COLOR_TEXTURE_UNIT = 1;
    private readonly NORMAL_POM_TEXTURE_UNIT = 2;
    private readonly ROUGHNESS_METALNESS_TEXTURE_UNIT = 3;
    private readonly OCCLUSION_TEXTURE_UNIT = 4;
    private readonly EMISSIVE_TEXTURE_UNIT = 5;

    private slotHelpers: Array<ShaderSlotHelper>;
    private pbrIblHelper: PbrIblHelper;
    private brdfLut: GlTexture2D;

    public constructor() {
        super();
        this.createBrdfLut();
        this.slotHelpers = [
            new BaseColorSlotHelper(this.getShaderProgram(), this.BASE_COLOR_TEXTURE_UNIT, true),
            new NormalSlotHelper(this.getShaderProgram(), this.NORMAL_POM_TEXTURE_UNIT, true),
            new RoughnessMetalnessSlotHelper(this.getShaderProgram(), this.ROUGHNESS_METALNESS_TEXTURE_UNIT, true),
            new OcclusionSlotHelper(this.getShaderProgram(), this.OCCLUSION_TEXTURE_UNIT, true),
            new EmissiveSlotHelper(this.getShaderProgram(), this.EMISSIVE_TEXTURE_UNIT, true)
        ];
        this.pbrIblHelper = new PbrIblHelper(this.getShaderProgram(), this.brdfLut);
    }

    private async createBrdfLut(): Promise<void> {
        this.brdfLut = new GlTexture2D();
        this.brdfLut.allocate(InternalFormat.RG8, vec2.fromValues(512, 512), false);
        this.brdfLut.setWrapU(TextureWrap.CLAMP_TO_EDGE);
        this.brdfLut.setWrapV(TextureWrap.CLAMP_TO_EDGE);
        this.brdfLut.setMinificationFilter(MinificationFilter.NEAREST);
        this.brdfLut.setMagnificationFilter(MagnificationFilter.NEAREST);
        const data = await Utility.loadImage('res/textures/brdfLUT.png');
        this.brdfLut.store(data, Format.RG, false);
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
            shadowMap = Engine.getParameters().get(Engine.DEFAULT_TEXTURE_2D_ARRAY);
        }
        shadowMap.bindToTextureUnit(this.SHADOW_TEXTURE_UNIT);
        this.getShaderProgram().connectTextureUnit('shadowMap', this.SHADOW_TEXTURE_UNIT);
    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/pbr/pbr.vs';
    }

    protected getFragmentShaderPath(): string {
        return 'res/shaders/pbr/pbr.fs';
    }

}
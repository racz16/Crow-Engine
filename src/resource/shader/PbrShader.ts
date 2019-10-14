import { Shader } from './Shader';
import { IRenderableComponent } from '../../component/renderable/IRenderableComponent';
import { IRenderable } from '../IRenderable';
import { mat3, vec2 } from 'gl-matrix';
import { ShaderSlotHelper } from './slotHelper/ShaderSlotHelper';
import { NormalSlotHelper } from './slotHelper/NormalSlotHelper';
import { BaseColorSlotHelper } from './slotHelper/BaseColorSlotHelper';
import { OcclusionRoughnessMetalnessSlotHelper } from './slotHelper/OcclusionRoughnessMetalnessSlotHelper';
import { EmissiveSlotHelper } from './slotHelper/EmissiveSlotHelper';
import { GlTexture2D } from '../../webgl/texture/GlTexture2D';
import { InternalFormat } from '../../webgl/enum/InternalFormat';
import { Format } from '../../webgl/enum/Format';
import { Utility } from '../../utility/Utility';
import { TextureWrap } from '../../webgl/enum/TextureWrap';
import { TextureFilter } from '../../webgl/enum/TextureFilter';
import { PbrIblHelper } from './PbrIblHelper';

export class PbrShader extends Shader {

    private readonly BASE_COLOR_TEXTURE_UNIT = 1;
    private readonly NORMAL_POM_TEXTURE_UNIT = 2;
    private readonly OCCLUSION_ROUGHNESS_METALNESS_TEXTURE_UNIT = 3;
    private readonly EMISSIVE_TEXTURE_UNIT = 4;

    private slotHelpers: Array<ShaderSlotHelper>;
    private pbrIblHelper: PbrIblHelper;
    private brdfLut: GlTexture2D;

    public constructor() {
        super();
        this.createBrdfLut();
        console.log(this.getShaderProgram());
        this.slotHelpers = [
            new BaseColorSlotHelper(this.getShaderProgram(), this.BASE_COLOR_TEXTURE_UNIT),
            new NormalSlotHelper(this.getShaderProgram(), this.NORMAL_POM_TEXTURE_UNIT),
            new OcclusionRoughnessMetalnessSlotHelper(this.getShaderProgram(), this.OCCLUSION_ROUGHNESS_METALNESS_TEXTURE_UNIT),
            new EmissiveSlotHelper(this.getShaderProgram(), this.EMISSIVE_TEXTURE_UNIT)
        ];
        this.pbrIblHelper = new PbrIblHelper(this.getShaderProgram(), this.brdfLut);
    }

    private async createBrdfLut(): Promise<void> {
        this.brdfLut = new GlTexture2D();
        this.brdfLut.allocate(InternalFormat.RG8, vec2.fromValues(512, 512), false);
        this.brdfLut.setWrapU(TextureWrap.CLAMP_TO_EDGE);
        this.brdfLut.setWrapV(TextureWrap.CLAMP_TO_EDGE);
        this.brdfLut.setMinificationFilter(TextureFilter.LINEAR);
        this.brdfLut.setMagnificationFilter(TextureFilter.LINEAR);
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
    }

    private setMatrixUniforms(renderableComponent: IRenderableComponent<IRenderable>): void {
        const model = renderableComponent.getModelMatrix();
        const inverseModel3x3 = mat3.fromMat4(mat3.create(), renderableComponent.getInverseModelMatrix());
        this.getShaderProgram().loadMatrix3('inverseTransposedModelMatrix3x3', inverseModel3x3, true);
        this.getShaderProgram().loadMatrix4('modelMatrix', model, false);
    }

    protected connectTextureUnits(): void {

    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/pbr/vertex.glsl';
    }

    protected getFragmentShaderPath(): string {
        return 'res/shaders/pbr/fragment.glsl';
    }

}
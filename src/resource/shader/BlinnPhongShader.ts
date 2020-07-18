import { Shader } from './Shader';
import { mat3 } from 'gl-matrix';
import { IRenderable } from '../IRenderable';
import { DiffuseSlotHelper } from './slotHelper/DiffuseSlotHelper';
import { SpecularSlotHelper } from './slotHelper/SpecularSlotHelper';
import { NormalSlotHelper } from './slotHelper/NormalSlotHelper';
import { ShaderSlotHelper } from './slotHelper/ShaderSlotHelper';
import { ReflectionSlotHelper } from './slotHelper/ReflectionSlotHelper';
import { RefractionSlotHelper } from './slotHelper/RefractionSlotHelper';
import { EnvironmentSlotHelper } from './slotHelper/EnvironmentSlotHelper';
import { IRenderableComponent } from '../../component/renderable/IRenderableComponent';
import { EmissiveSlotHelper } from './slotHelper/EmissiveSlotHelper';
import { Engine } from '../../core/Engine';
import { RenderingPipeline } from '../../rendering/RenderingPipeline';
import { Utility } from '../../utility/Utility';
import { BlinnPhongLightsStruct } from '../../component/light/blinnphong/BlinnPhongLightsStruct';
import { Conventions } from '../Conventions';

export class BlinnPhongShader extends Shader {

    private slotHelpers: Array<ShaderSlotHelper>;

    public constructor() {
        super();
        this.slotHelpers = [/*
            new DiffuseSlotHelper(this.getShaderProgram(), this.DIFFUSE_TEXTURE_UNIT, false),
            new SpecularSlotHelper(this.getShaderProgram(), this.SPECULAR_TEXTURE_UNIT, false),
            new NormalSlotHelper(this.getShaderProgram(), Conventions.NORMAL_POM_TEXTURE_UNIT, false),
            new ReflectionSlotHelper(this.getShaderProgram(), this.REFLECTION_TEXTURE_UNIT, false),
            new RefractionSlotHelper(this.getShaderProgram(), this.REFRACTION_TEXTURE_UNIT, false),
            new EnvironmentSlotHelper(this.getShaderProgram(), this.ENVIRONMENT_INTENSITY_TEXTURE_UNIT, false),
            new EmissiveSlotHelper(this.getShaderProgram(), Conventions.EMISSIVE_TEXTURE_UNIT, false)*/
        ];
    }

    public setUniforms(renderableComponent: IRenderableComponent<IRenderable>): void {
        this.setMatrixUniforms(renderableComponent);
        const material = renderableComponent.getMaterial();
        for (const helper of this.slotHelpers) {
            helper.loadSlot(material);
        }
        this.getShaderProgram().loadInt('shadowLightIndex', BlinnPhongLightsStruct.getInstance().getShadowLightIndex());
        this.getShaderProgram().loadBoolean('receiveShadow', renderableComponent.isReceiveShadows());
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
        return 'res/shaders/blinnPhong/blinnPhong.vs';
    }
    protected getFragmentShaderPath(): string {
        return 'res/shaders/blinnPhong/blinnPhong.fs';
    }

}
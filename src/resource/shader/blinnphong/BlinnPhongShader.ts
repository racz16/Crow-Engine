import { Shader } from "../Shader";
import { mat3, vec3, vec4, vec2 } from "gl-matrix";
import { GameObject } from "../../../core/GameObject";
import { Scene } from "../../../core/Scene";
import { Material } from "../../../material/Material";
import { RenderableComponent } from "../../../component/renderable/RenderableComponent";
import { IRenderable } from "../../IRenderable";
import { BlinnPhongDiffuseHelper } from "./BlinnPhongDiffuseHelper";
import { BlinnPhongSpecularHelper } from "./BlinnPhongSpecularHelper";
import { BlinnPhongNormalHelper } from "./BlinnPhongNormalHelper";
import { BlinnPhongHelper } from "./BlinnPhongHelper";
import { BlinnPhongReflectionHelper } from "./BlinnPhongReflectionHelper";
import { BlinnPhongRefractionHelper } from "./BlinnPhongRefractionHelper";
import { BlinnPhongEnvironmentHelper } from "./BlinnPhongEnvironmentHelper";

export class BlinnPhongShader extends Shader {

    private slotHelpers: Array<BlinnPhongHelper>;

    public constructor() {
        super();
        this.getShaderProgram().bindUniformBlockToBindingPoint('Camera', Scene.CAMERA_BINDING_POINT);
        this.getShaderProgram().bindUniformBlockToBindingPoint('Lights', Scene.LIGHTS_BINDING_POINT);
        this.slotHelpers = [
            new BlinnPhongDiffuseHelper(),
            new BlinnPhongSpecularHelper(),
            new BlinnPhongNormalHelper(),
            new BlinnPhongReflectionHelper(),
            new BlinnPhongRefractionHelper(),
            new BlinnPhongEnvironmentHelper(),
        ];
    }

    public setUniforms(rc: RenderableComponent<IRenderable>): void {
        const go = rc.getGameObject();
        const inverseModel3x3 = mat3.fromMat4(mat3.create(), go.getTransform().getInverseModelMatrix());
        const model = go.getTransform().getModelMatrix();
        const sp = this.getShaderProgram();
        sp.loadMatrix3('inverseTransposedModelMatrix3x3', inverseModel3x3, true);
        sp.loadMatrix4('modelMatrix', model, false);
        sp.loadBoolean('sRgb', false);

        const material = rc.getMaterial();
        for (const helper of this.slotHelpers) {
            helper.loadSlot(material, sp);
        }
    }

    private loadEnvironmentSlots(material: Material): void {
        //reflection
        const reflectionSlot = material.getSlot(Material.REFLECTION);
        const isThereReflectionMap = "material.isThereReflectionMap";
        const reflectionTextureUnit = 4;
        const reflectionUsable = reflectionSlot != null && reflectionSlot.isActive() && reflectionSlot
            .getCubeMapTexture() != null;
        //refraction
        const refractionSlot = material.getSlot(Material.REFRACTION);
        const isThereRefractionMap = "material.isThereRefractionMap";
        const refractionTextureUnit = 5;
        const refractionIndex = "material.refractionIndex";
        const index = material.getParameters().getValue(Material.REFRACTION_INDEX) == null ? 1 / 1.33 : material
            .getParameters().getValue(Material.REFRACTION_INDEX) as number;
        const refractionUsable = refractionSlot != null && refractionSlot.isActive() && refractionSlot
            .getCubeMapTexture() != null;
        //intensity
        const intensitySlot = material.getSlot(Material.ENVIRONMENT_INTENSITY);
        const isThereIntensityMap = "material.isThereEnvironmentIntensityMap";
        const intensityColor = "material.environmentIntensityColor";
        const tileName = "material.environmentIntensityTile";
        const offsetName = "material.environmentIntensityOffset";
        const intensityTextureUnit = 6;
        //parallax correction
        const isThereParallaxCorrection = "material.isThereParallaxCorrection";
        const parallaxCorrectionValue = "material.geometryProxyRadius";
        const environmentProbePosition = "material.environmentProbePosition";
        const sp = this.getShaderProgram();

        if (reflectionUsable || refractionUsable) {
            if (!reflectionUsable && refractionUsable) {
                sp.loadBoolean(isThereReflectionMap, false);

                sp.loadBoolean(isThereRefractionMap, true);
                refractionSlot.getCubeMapTexture().bindToTextureUnit(refractionTextureUnit);
                sp.loadFloat(refractionIndex, index);
            } else if (reflectionUsable && !refractionUsable) {
                sp.loadBoolean(isThereReflectionMap, true);
                reflectionSlot.getCubeMapTexture().bindToTextureUnit(reflectionTextureUnit);

                sp.loadBoolean(isThereRefractionMap, false);
            } else {
                sp.loadBoolean(isThereReflectionMap, true);
                reflectionSlot.getCubeMapTexture().bindToTextureUnit(reflectionTextureUnit);

                sp.loadBoolean(isThereRefractionMap, true);
                refractionSlot.getCubeMapTexture().bindToTextureUnit(refractionTextureUnit);
                sp.loadFloat(refractionIndex, index);
            }
            if (reflectionUsable) {
                const pc = false;
                //const pc = reflectionSlot.getCubeMapTexture().isParallaxCorrection();
                sp.loadBoolean(isThereParallaxCorrection, pc);
                if (pc) {
                    //sp.loadFloat(parallaxCorrectionValue, reflectionSlot.getCubeMapTexture()
                    //    .getParallaxCorrectionValue());
                    //sp.loadVector3(environmentProbePosition, reflectionSlot.getCubeMapTexture().getPosition());
                }
            }
            if (intensitySlot != null && intensitySlot.isActive()) {
                const texture = intensitySlot.getTexture2D();
                const color = intensitySlot.getColor();
                if (texture != null) {
                    texture.bindToTextureUnit(intensityTextureUnit);
                    sp.loadBoolean(isThereIntensityMap, true);
                    sp.loadVector2(tileName, intensitySlot.getTextureTile());
                    sp.loadVector2(offsetName, intensitySlot.getTextureOffset());
                } else if (color != null) {
                    sp.loadVector3(intensityColor, vec3.fromValues(color[0], color[1], color[2]));
                    sp.loadBoolean(isThereIntensityMap, false);
                } else {
                    sp.loadBoolean(isThereIntensityMap, false);
                    sp.loadVector3(intensityColor, vec3.fromValues(1, 1, 1));
                }
            } else {
                sp.loadBoolean(isThereIntensityMap, false);
                sp.loadVector3(intensityColor, vec3.fromValues(1, 1, 1));
            }
        } else {
            sp.loadBoolean(isThereReflectionMap, false);
            sp.loadBoolean(isThereRefractionMap, false);
        }
    }

    public connect(): void {
        //this.getShaderProgram().connectTextureUnit("shadowMap", 0);
        this.getShaderProgram().connectTextureUnit("material.reflection", 4);
        this.getShaderProgram().connectTextureUnit("material.refraction", 5);
    }

    protected getVertexShaderPath(): string {
        return 'res/shaders/blinnPhong/vertex.glsl';
    }
    protected getFragmentShaderPath(): string {
        return 'res/shaders/blinnPhong/fragment.glsl';
    }

}
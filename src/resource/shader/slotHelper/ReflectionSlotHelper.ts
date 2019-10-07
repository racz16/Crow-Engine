import { ShaderSlotHelper } from './ShaderSlotHelper';
import { Material } from '../../../material/Material';
import { GlShaderProgram } from '../../../webgl/shader/GlShaderProgram';
import { Conventions } from '../../Conventions';
import { MaterialSlot } from '../../../material/MaterialSlot';
import { ParameterKey } from '../../../utility/parameter/ParameterKey';

export class ReflectionSlotHelper extends ShaderSlotHelper {

    public loadSlot(material: Material<any>, sp: GlShaderProgram): void {
        this.setValues(material.getSlot(this.getMaterialSlotKey()), sp);
        if (this.isCubeMapTextureUsable()) {
            this.loadCubeMapTexture();
            this.loadParallaxCorrectionData();
        } else {
            this.loadDefaultCubeMapTexture();
            sp.loadBoolean(this.getIsThereMapName(), false);
            this.shaderProgram.loadBoolean(this.getIsThereParallaxCorrectionName(), false);
        }
    }

    private loadParallaxCorrectionData(): void {
        const gpr = this.slot.getParameters().get(MaterialSlot.PARALLAX_CORRECTION_GEOMETRY_PROXY_RADIUS);
        const epp = this.slot.getParameters().get(MaterialSlot.PARALLAX_CORRECTION_ENVIRONMENT_PROBE_POSITION);
        if (gpr && epp) {
            this.shaderProgram.loadBoolean(this.getIsThereParallaxCorrectionName(), true);
            this.shaderProgram.loadFloat(this.getGeometryProxyRadiusName(), gpr);
            this.shaderProgram.loadVector3(this.getEnvironmentProbePositionName(), epp);
        } else {
            this.shaderProgram.loadBoolean(this.getIsThereParallaxCorrectionName(), false);
        }
    }

    protected getMaterialSlotKey(): ParameterKey<MaterialSlot> {
        return Material.REFLECTION;
    }

    protected getTextureUnit(): number {
        return Conventions.REFLECTION_TEXTURE_UNIT;
    }

    protected getMapName(): string {
        return 'material.reflectionMap';
    }

    protected getIsThereMapName(): string {
        return 'material.isThereReflectionMap';
    }

    protected getTileName(): string {
        return null;
    }

    protected getOffsetName(): string {
        return null;
    }

    protected getColorName(): string {
        return null;
    }

    protected getIsThereParallaxCorrectionName(): string {
        return 'material.isThereParallaxCorrection';
    }

    protected getGeometryProxyRadiusName(): string {
        return 'material.geometryProxyRadius';
    }

    protected getEnvironmentProbePositionName(): string {
        return 'material.environmentProbePosition';
    }

}
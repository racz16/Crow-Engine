import { ShaderSlotHelper } from './ShaderSlotHelper';
import { Material } from '../../../material/Material';
import { MaterialSlot } from '../../../material/MaterialSlot';
import { ParameterKey } from '../../../utility/parameter/ParameterKey';
import { Conventions } from '../../Conventions';

export class ReflectionSlotHelper extends ShaderSlotHelper {

    public loadSlot(material: Material<any>): void {
        this.setSlot(material.getSlot(this.getMaterialSlotKey()));
        if (this.isCubeMapTextureUsable()) {
            this.loadCubeMapTexture();
            this.loadParallaxCorrectionData();
        } else {
            this.loadDefaultCubeMapTexture();
            this.shaderProgram.loadBoolean(this.getIsThereParallaxCorrectionName(), false);
        }
    }

    private loadParallaxCorrectionData(): void {
        const gpr = this.slot.getParameters().get(Conventions.MSP_PARALLAX_CORRECTION_GEOMETRY_PROXY_RADIUS);
        const epp = this.slot.getParameters().get(Conventions.MSP_PARALLAX_CORRECTION_ENVIRONMENT_PROBE_POSITION);
        if (gpr && epp) {
            this.shaderProgram.loadBoolean(this.getIsThereParallaxCorrectionName(), true);
            this.shaderProgram.loadFloat(this.getGeometryProxyRadiusName(), gpr);
            this.shaderProgram.loadVector3(this.getEnvironmentProbePositionName(), epp);
        } else {
            this.shaderProgram.loadBoolean(this.getIsThereParallaxCorrectionName(), false);
        }
    }

    protected getMaterialSlotKey(): ParameterKey<MaterialSlot> {
        return Conventions.MS_REFLECTION;
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

    protected getTextureCoordinateName(): string {
        return null;
    }

}
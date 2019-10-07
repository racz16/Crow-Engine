import { ShaderSlotHelper } from './ShaderSlotHelper';
import { Conventions } from '../../Conventions';
import { vec3 } from 'gl-matrix';
import { Material } from '../../../material/Material';
import { MaterialSlot } from '../../../material/MaterialSlot';
import { ParameterKey } from '../../../utility/parameter/ParameterKey';
import { GlShaderProgram } from '../../../webgl/shader/GlShaderProgram';

export class OcclusionRoughnessMetalnessSlotHelper extends ShaderSlotHelper {

    public loadSlot(material: Material<any>, sp: GlShaderProgram): void {
        super.loadSlot(material, sp);
        this.loadFloatParameter('material.occlusionStrength', MaterialSlot.OCCLUSION_STRENGTH, 0.5);
    }

    protected getDefaultColor(): vec3 {
        return vec3.fromValues(1, 0.5, 0.5);
    }

    protected getMaterialSlotKey(): ParameterKey<MaterialSlot> {
        return Material.OCCLUSION_ROUGHNESS_METALNESS;
    }

    protected getTextureUnit(): number {
        return Conventions.OCCLUSION_ROUGHNESS_METALNESS_TEXTURE_UNIT;
    }

    protected getMapName(): string {
        return 'material.occlusionRoughnessMetalnessMap';
    }

    protected getIsThereMapName(): string {
        return 'material.isThereOcclusionRoughnessMetalnessMap';
    }

    protected getTileName(): string {
        return 'material.occlusionRoughnessMetalnessMapTile';
    }

    protected getOffsetName(): string {
        return 'material.occlusionRoughnessMetalnessMapOffset';
    }

    protected getColorName(): string {
        return 'material.occlusionRoughnessMetalness';
    }

}
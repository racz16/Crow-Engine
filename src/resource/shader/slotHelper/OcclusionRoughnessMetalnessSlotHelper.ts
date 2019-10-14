import { ShaderSlotHelper } from './ShaderSlotHelper';
import { vec3 } from 'gl-matrix';
import { Material } from '../../../material/Material';
import { MaterialSlot } from '../../../material/MaterialSlot';
import { ParameterKey } from '../../../utility/parameter/ParameterKey';

export class OcclusionRoughnessMetalnessSlotHelper extends ShaderSlotHelper {

    public loadSlot(material: Material<any>): void {
        super.loadSlot(material);
        this.loadFloatParameter('material.occlusionStrength', MaterialSlot.OCCLUSION_STRENGTH, 0);
    }

    protected getDefaultColor(): vec3 {
        return vec3.fromValues(1, 0.5, 0.5);
    }

    protected getMaterialSlotKey(): ParameterKey<MaterialSlot> {
        return Material.OCCLUSION_ROUGHNESS_METALNESS;
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
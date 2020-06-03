import { ShaderSlotHelper } from './ShaderSlotHelper';
import { Material } from '../../../material/Material';
import { MaterialSlot } from '../../../material/MaterialSlot';
import { ParameterKey } from '../../../utility/parameter/ParameterKey';

export class RoughnessMetalnessSlotHelper extends ShaderSlotHelper {

    protected getMaterialSlotKey(): ParameterKey<MaterialSlot> {
        return Material.ROUGHNESS_METALNESS;
    }

    protected getMapName(): string {
        return 'material.roughnessMetalnessMap';
    }

    protected getIsThereMapName(): string {
        return 'material.isThereRoughnessMetalnessMap';
    }

    protected getTileName(): string {
        return 'material.roughnessMetalnessMapTile';
    }

    protected getOffsetName(): string {
        return 'material.roughnessMetalnessMapOffset';
    }

    protected getColorName(): string {
        return 'material.roughnessMetalness';
    }

    protected getTextureCoordinateName(): string {
        return 'material.roughnessMetalnessTextureCoordinate';
    }

}
import { ShaderSlotHelper } from './ShaderSlotHelper';
import { Material } from '../../../material/Material';
import { vec3 } from 'gl-matrix';
import { ParameterKey } from '../../../utility/parameter/ParameterKey';
import { MaterialSlot } from '../../../material/MaterialSlot';

export class EnvironmentSlotHelper extends ShaderSlotHelper {

    protected getDefaultColor(): vec3 {
        return vec3.fromValues(1, 1, 1);
    }

    protected getMaterialSlotKey(): ParameterKey<MaterialSlot> {
        return Material.ENVIRONMENT_INTENSITY;
    }

    protected getMapName(): string {
        return 'material.environmentIntensityMap';
    }

    protected getIsThereMapName(): string {
        return 'material.isThereEnvironmentIntensityMap';
    }

    protected getTileName(): string {
        return 'material.environmentIntensityMapTile';
    }

    protected getOffsetName(): string {
        return 'material.environmentIntensityMapOffset';
    }

    protected getColorName(): string {
        return 'material.environmentIntensityColor';
    }

    protected getTextureCoordinateName(): string {
        return null;
    }

}
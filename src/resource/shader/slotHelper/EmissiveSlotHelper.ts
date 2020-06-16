import { ShaderSlotHelper } from './ShaderSlotHelper';
import { ParameterKey } from '../../../utility/parameter/ParameterKey';
import { MaterialSlot } from '../../../material/MaterialSlot';
import { vec3 } from 'gl-matrix';
import { Conventions } from '../../Conventions';

export class EmissiveSlotHelper extends ShaderSlotHelper {

    protected getDefaultColor(): vec3 {
        return vec3.fromValues(0, 0, 0);
    }

    protected getMaterialSlotKey(): ParameterKey<MaterialSlot> {
        return Conventions.MS_EMISSIVE;
    }

    protected getMapName(): string {
        return 'material.emissiveMap';
    }

    protected getIsThereMapName(): string {
        return 'material.isThereEmissiveMap';
    }

    protected getTileName(): string {
        return 'material.emissiveMapTile';
    }

    protected getOffsetName(): string {
        return 'material.emissiveMapOffset';
    }

    protected getColorName(): string {
        return 'material.emissiveColor';
    }

    protected getTextureCoordinateName(): string {
        return 'material.emissiveTextureCoordinate';
    }

}
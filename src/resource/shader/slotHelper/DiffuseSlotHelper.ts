import { ShaderSlotHelper } from './ShaderSlotHelper';
import { ParameterKey } from '../../../utility/parameter/ParameterKey';
import { MaterialSlot } from '../../../material/MaterialSlot';
import { Conventions } from '../../Conventions';

export class DiffuseSlotHelper extends ShaderSlotHelper {

    protected getMaterialSlotKey(): ParameterKey<MaterialSlot> {
        return Conventions.MS_DIFFUSE;
    }

    protected getMapName(): string {
        return 'material.diffuseMap';
    }

    protected getIsThereMapName(): string {
        return 'material.isThereDiffuseMap';
    }

    protected getTileName(): string {
        return 'material.diffuseMapTile';
    }

    protected getOffsetName(): string {
        return 'material.diffuseMapOffset';
    }

    protected getColorName(): string {
        return 'material.diffuseColor';
    }

    protected getTextureCoordinateName(): string {
        return null;
    }

}
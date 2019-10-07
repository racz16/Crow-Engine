import { Material } from '../../../material/Material';
import { ShaderSlotHelper } from './ShaderSlotHelper';
import { Conventions } from '../../Conventions';
import { ParameterKey } from '../../../utility/parameter/ParameterKey';
import { MaterialSlot } from '../../../material/MaterialSlot';

export class DiffuseSlotHelper extends ShaderSlotHelper {

    protected getMaterialSlotKey(): ParameterKey<MaterialSlot> {
        return Material.DIFFUSE;
    }

    protected getTextureUnit(): number {
        return Conventions.DIFFUSE_TEXTURE_UNIT;
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

}
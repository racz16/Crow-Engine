import { ShaderSlotHelper } from './ShaderSlotHelper';
import { ParameterKey } from '../../../utility/parameter/ParameterKey';
import { MaterialSlot } from '../../../material/MaterialSlot';
import { Conventions } from '../../Conventions';
import { Material } from '../../../material/Material';

export class AlphaSlotHelper extends ShaderSlotHelper {

    public loadSlot(material: Material<any>): void {
        this.setSlot(material.getSlot(this.getMaterialSlotKey()));
        if (this.isTexture2DUsable()) {
            this.loadTexture2D();
        } else {
            this.loadDefaultTexture2D();
        }
    }

    protected getMaterialSlotKey(): ParameterKey<MaterialSlot> {
        return Conventions.MS_BASE_COLOR;
    }

    protected getMapName(): string {
        return 'textureMap';
    }

    protected getIsThereMapName(): string {
        return 'isThereTextureMap';
    }

    protected getTileName(): string {
        return 'tile';
    }

    protected getOffsetName(): string {
        return 'offset';
    }

    protected getColorName(): string {
        return null;
    }

    protected getTextureCoordinateName(): string {
        return 'textureCoordinate';
    }

}
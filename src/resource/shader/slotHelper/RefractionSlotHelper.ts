import { ShaderSlotHelper } from './ShaderSlotHelper';
import { Material } from '../../../material/Material';
import { ParameterKey } from '../../../utility/parameter/ParameterKey';
import { MaterialSlot } from '../../../material/MaterialSlot';
import { Conventions } from '../../Conventions';

export class RefractionSlotHelper extends ShaderSlotHelper {

    public loadSlot(material: Material<any>): void {
        this.setSlot(material.getSlot(this.getMaterialSlotKey()));
        if (this.isCubeMapTextureUsable()) {
            this.loadCubeMapTexture();
            this.loadFloatParameter('material.refractionIndex', Conventions.MSP_REFRACTION_INDEX, 1 / 1.33);
        } else {
            this.loadDefaultCubeMapTexture();
        }
    }

    protected getMaterialSlotKey(): ParameterKey<MaterialSlot> {
        return Conventions.MS_REFRACTION;
    }

    protected getMapName(): string {
        return 'material.refractionMap';
    }

    protected getIsThereMapName(): string {
        return 'material.isThereRefractionMap';
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

    protected getTextureCoordinateName(): string {
        return null;
    }

}
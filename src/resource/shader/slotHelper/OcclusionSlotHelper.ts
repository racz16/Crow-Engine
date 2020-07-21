import { ShaderSlotHelper } from './ShaderSlotHelper';
import { ParameterKey } from '../../../utility/parameter/ParameterKey';
import { MaterialSlot } from '../../../material/MaterialSlot';
import { Material } from '../../../material/Material';
import { Conventions } from '../../Conventions';

export class OcclusionSlotHelper extends ShaderSlotHelper {

    public loadSlot(material: Material<any>): void {
        this.setSlot(material.getSlot(this.getMaterialSlotKey()));
        if (this.isTexture2DUsable()) {
            this.loadTexture2D();
            this.loadFloatParameter('material.occlusionStrength', Conventions.MSP_OCCLUSION_STRENGTH, 1);
        } else {
            this.loadDefaultTexture2D();
            this.shaderProgram.loadFloat('material.occlusionStrength', 0);
        }
    }

    protected getMaterialSlotKey(): ParameterKey<MaterialSlot> {
        return Conventions.MS_OCCLUSION;
    }

    protected getMapName(): string {
        return 'material.occlusionMap';
    }

    protected getIsThereMapName(): string {
        return 'material.isThereOcclusionMap';
    }

    protected getTileName(): string {
        return 'material.occlusionMapTile';
    }

    protected getOffsetName(): string {
        return 'material.occlusionMapOffset';
    }

    protected getColorName(): string {
        return null;
    }

    protected getTextureCoordinateName(): string {
        return 'material.occlusionTextureCoordinate';
    }

}
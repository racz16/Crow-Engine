import { ShaderSlotHelper } from './ShaderSlotHelper';
import { Material } from '../../../material/Material';
import { vec4 } from 'gl-matrix';
import { MaterialSlot } from '../../../material/MaterialSlot';
import { ParameterKey } from '../../../utility/parameter/ParameterKey';
import { Conventions } from '../../Conventions';

export class SpecularSlotHelper extends ShaderSlotHelper {

    private static readonly defaultValue = vec4.fromValues(0.5, 0.5, 0.5, 0.5);

    public loadSlot(material: Material<any>): void {
        this.setSlot(material.getSlot(this.getMaterialSlotKey()));
        //texture
        if (this.isTexture2DUsable()) {
            this.loadTexture2D();
            this.loadBooleanParameter('material.isThereGlossiness', Conventions.MSP_USE_GLOSSINESS, false);
        } else {
            this.loadDefaultTexture2D();
        }
        //color
        if (this.isColorUsable()) {
            this.loadColor4();
        } else if (this.isTexture2DUsable()) {
            this.loadDefaultColor4(vec4.fromValues(1, 1, 1, 1));
        } else {
            this.loadDefaultColor4(SpecularSlotHelper.defaultValue)
        }
    }

    protected getMaterialSlotKey(): ParameterKey<MaterialSlot> {
        return Conventions.MS_SPECULAR;
    }

    protected getMapName(): string {
        return 'material.specularMap';
    }

    protected getIsThereMapName(): string {
        return 'material.isThereSpecularMap';
    }

    protected getTileName(): string {
        return 'material.specularMapTile';
    }

    protected getOffsetName(): string {
        return 'material.specularMapOffset';
    }

    protected getColorName(): string {
        return 'material.specularColor';
    }

    protected getTextureCoordinateName(): string {
        return null;
    }

}
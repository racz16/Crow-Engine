import { ShaderSlotHelper } from './ShaderSlotHelper';
import { Material } from '../../../material/Material';
import { vec4 } from 'gl-matrix';
import { MaterialSlot } from '../../../material/MaterialSlot';
import { ParameterKey } from '../../../utility/parameter/ParameterKey';

export class SpecularSlotHelper extends ShaderSlotHelper {

    private static readonly defaultValue = vec4.fromValues(0.5, 0.5, 0.5, 0.5);

    public loadSlot(material: Material<any>): void {
        this.setSlot(material.getSlot(this.getMaterialSlotKey()));
        if (this.isTexture2DUsable()) {
            this.loadTexture2D();
            this.loadGlossiness();
        } else if (this.isColorUsable()) {
            this.loadDefaultTexture2D();
            this.loadColor4();
        } else {
            this.loadDefaultTexture2D();
            this.loadDefaultColor4(SpecularSlotHelper.defaultValue);
        }
    }

    private loadGlossiness(): void {
        this.loadBooleanParameter('material.isThereGlossiness', MaterialSlot.USE_GLOSSINESS, false);
        const color = this.slot.getColor();
        if (color) {
            this.shaderProgram.loadVector4(this.getColorName(), color);
        } else {
            this.shaderProgram.loadVector4(this.getColorName(), SpecularSlotHelper.defaultValue);
        }
    }

    protected getMaterialSlotKey(): ParameterKey<MaterialSlot> {
        return Material.SPECULAR;
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

}
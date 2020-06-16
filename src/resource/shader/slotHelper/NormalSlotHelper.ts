import { ShaderSlotHelper } from './ShaderSlotHelper';
import { Material } from '../../../material/Material';
import { MaterialSlot } from '../../../material/MaterialSlot';
import { ParameterKey } from '../../../utility/parameter/ParameterKey';
import { Conventions } from '../../Conventions';

export class NormalSlotHelper extends ShaderSlotHelper {

    public loadSlot(material: Material<any>): void {
        this.setSlot(material.getSlot(this.getMaterialSlotKey()));
        if (this.isTexture2DUsable()) {
            this.loadNormalMap();
        } else {
            this.loadDefaultTexture2D();
            this.shaderProgram.loadBoolean(this.getUseNormalMapName(), false);
        }
    }

    private loadNormalMap(): void {
        this.shaderProgram.loadBoolean(this.getUseNormalMapName(), true);
        this.shaderProgram.loadFloat('material.normalScale', 1);
        this.loadTexture2D();
        this.loadPomParameters();
    }

    private loadPomParameters(): void {
        this.loadFloatParameter('material.normalScale', Conventions.MSP_NORMAL_SCALE, 1);
        this.loadBooleanParameter('material.isTherePOM', Conventions.MSP_USE_POM, false);
        if (this.isThereParameter(Conventions.MSP_USE_POM)) {
            this.loadFloatParameter('material.POMScale', Conventions.MSP_POM_SCALE, 0.15);
            this.loadFloatParameter('material.POMMinLayers', Conventions.MSP_POM_MIN_LAYERS, 15);
            this.loadFloatParameter('material.POMMaxLayers', Conventions.MSP_POM_MAX_LAYERS, 30);
        }
    }

    protected getMaterialSlotKey(): ParameterKey<MaterialSlot> {
        return Conventions.MS_NORMAL;
    }

    protected getMapName(): string {
        return 'material.normalMap';
    }

    protected getIsThereMapName(): string {
        return 'material.isThereNormalMap';
    }

    protected getTileName(): string {
        return 'material.normalMapTile';
    }

    protected getOffsetName(): string {
        return 'material.normalMapOffset';
    }

    protected getColorName(): string {
        return null;
    }

    protected getUseNormalMapName(): string {
        return 'useNormalMap';
    }

    protected getTextureCoordinateName(): string {
        return 'material.normalMapTextureCoordinate';
    }

}
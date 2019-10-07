import { ShaderSlotHelper } from './ShaderSlotHelper';
import { Material } from '../../../material/Material';
import { GlShaderProgram } from '../../../webgl/shader/GlShaderProgram';
import { Conventions } from '../../Conventions';
import { ParameterKey } from '../../../utility/parameter/ParameterKey';
import { MaterialSlot } from '../../../material/MaterialSlot';

export class RefractionSlotHelper extends ShaderSlotHelper {

    private material: Material<any>;

    public loadSlot(material: Material<any>, sp: GlShaderProgram): void {
        this.material = material;
        this.setValues(material.getSlot(this.getMaterialSlotKey()), sp);
        if (this.isCubeMapTextureUsable()) {
            this.loadCubeMapTexture();
            this.loadFloatParameter('material.refractionIndex', MaterialSlot.REFRACTION_INDEX, 1 / 1.33);
        } else {
            this.loadDefaultCubeMapTexture();
            sp.loadBoolean(this.getIsThereMapName(), false);
        }
    }

    protected getMaterialSlotKey(): ParameterKey<MaterialSlot> {
        return Material.REFRACTION;
    }

    protected getTextureUnit(): number {
        return Conventions.REFRACTION_TEXTURE_UNIT;
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

}
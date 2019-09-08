import { BlinnPhongHelper } from './BlinnPhongHelper';
import { Material } from '../../../material/Material';
import { GlShaderProgram } from '../../../webgl/shader/GlShaderProgram';
import { BlinnPhongRenderer } from '../../../rendering/renderer/BlinnPhongRenderer';
import { Conventions } from '../../Conventions';

export class BlinnPhongReflectionHelper extends BlinnPhongHelper {

    public loadSlot(material: Material<BlinnPhongRenderer>, sp: GlShaderProgram): void {
        this.setValues(material.getSlot(Material.REFLECTION), sp);
        sp.loadBoolean(this.getIsThereParallaxCorrectionName(), false);
        if (this.isCubeMapTextureUsable()) {
            this.loadCubeMapTexture();
        } else {
            this.loadDefaultCubeMapTexture();
            sp.loadBoolean(this.getIsThereMapName(), false);
        }
    }

    protected getTextureUnit(): number {
        return Conventions.REFLECTION_TEXTURE_UNIT;
    }

    protected getMapName(): string {
        return 'material.reflection';
    }

    protected getIsThereMapName(): string {
        return 'material.isThereReflectionMap';
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

    protected getIsThereParallaxCorrectionName(): string {
        return 'material.isThereParallaxCorrection';
    }

}
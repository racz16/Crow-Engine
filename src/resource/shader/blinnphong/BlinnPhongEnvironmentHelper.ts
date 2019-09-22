import { BlinnPhongHelper } from './BlinnPhongHelper';
import { Material } from '../../../material/Material';
import { GlShaderProgram } from '../../../webgl/shader/GlShaderProgram';
import { vec3 } from 'gl-matrix';
import { BlinnPhongRenderer } from '../../../rendering/renderer/BlinnPhongRenderer';
import { Conventions } from '../../Conventions';

export class BlinnPhongEnvironmentHelper extends BlinnPhongHelper {

    private defaultIntensity = vec3.fromValues(1, 1, 1)
    private material: Material<BlinnPhongRenderer>;

    public loadSlot(material: Material<BlinnPhongRenderer>, sp: GlShaderProgram): void {
        this.material = material;
        this.setValues(material.getSlot(Material.ENVIRONMENT_INTENSITY), sp);
        if (this.isTexture2DUsable()) {
            this.loadTexture2D();
        } else if (this.isColorUsable()) {
            this.loadColor3();
        } else {
            this.loadDefaultColor3(this.defaultIntensity);
        }
    }

    protected getTextureUnit(): number {
        return Conventions.ENVIRONMENT_INTENSITY_TEXTURE_UNIT;
    }

    protected getMapName(): string {
        return 'material.environmentIntensity';
    }

    protected getIsThereMapName(): string {
        return 'material.isThereEnvironmentIntensityMap';
    }

    protected getTileName(): string {
        return 'material.environmentIntensityTile';
    }

    protected getOffsetName(): string {
        return 'material.environmentIntensityOffset';
    }

    protected getColorName(): string {
        return 'material.environmentIntensityColor';
    }

}
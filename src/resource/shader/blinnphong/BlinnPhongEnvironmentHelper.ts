import { BlinnPhongHelper } from "./BlinnPhongHelper";
import { Material } from "../../../material/Material";
import { GlShaderProgram } from "../../../webgl/shader/GlShaderProgram";
import { vec3 } from "gl-matrix";

export class BlinnPhongEnvironmentHelper extends BlinnPhongHelper {

    private defaultIntensity = vec3.fromValues(1, 1, 1)
    private material: Material;

    public loadSlot(material: Material, sp: GlShaderProgram): void {
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

    /*private isThereReflectionOrRefractionMap(): boolean {
        return this.isTexture2DUsable(this.material.getSlot(Material.REFLECTION)) ||
            this.isTexture2DUsable(this.material.getSlot(Material.REFLECTION));
    }*/

    protected getTextureUnit(): number {
        return 6;
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
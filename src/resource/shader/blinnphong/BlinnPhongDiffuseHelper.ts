import { vec3 } from "gl-matrix";
import { GlShaderProgram } from "../../../webgl/shader/GlShaderProgram";
import { Material } from "../../../material/Material";
import { BlinnPhongHelper } from "./BlinnPhongHelper";

export class BlinnPhongDiffuseHelper extends BlinnPhongHelper {

    private static readonly defaultValue = vec3.fromValues(0.5, 0.5, 0.5);

    public loadSlot(material: Material, sp: GlShaderProgram): void {
        this.setValues(material.getSlot(Material.DIFFUSE), sp);
        if (this.isTexture2DUsable()) {
            this.loadTexture2D();
        } else if (this.isColorUsable()) {
            this.loadDefaultTexture2D();
            this.loadColor3();
        } else {
            this.loadDefaultTexture2D();
            this.loadDefaultColor3(BlinnPhongDiffuseHelper.defaultValue);
        }
    }

    protected getTextureUnit(): number {
        return 1;
    }

    protected getMapName(): string {
        return 'material.diffuse';
    }

    protected getIsThereMapName(): string {
        return 'material.isThereDiffuseMap';
    }

    protected getTileName(): string {
        return 'material.diffuseTile';
    }

    protected getOffsetName(): string {
        return 'material.diffuseOffset';
    }

    protected getColorName(): string {
        return 'material.diffuseColor';
    }

}
import { BlinnPhongHelper } from "./BlinnPhongHelper";
import { Material } from "../../../material/Material";
import { GlShaderProgram } from "../../../webgl/shader/GlShaderProgram";
import { MaterialSlot } from "../../../material/MaterialSlot";
import { Texture2D } from "../../texture/Texture2D";

export class BlinnPhongNormalHelper extends BlinnPhongHelper {

    private static readonly defPOMScale = 0.15;
    private static readonly defPOMMinLayers = 15;
    private static readonly defPOMMaxLayers = 30;

    private material: Material;

    public loadSlot(material: Material, sp: GlShaderProgram): void {
        this.material = material;
        this.setValues(material.getSlot(Material.NORMAL), sp);
        if (this.isTexture2DUsable()) {
            sp.loadBoolean(this.getUseNormalMapName(), true);
            this.loadTexture2D();
            this.loadPom();
        } else {
            sp.loadBoolean(this.getIsThereMapName(), false);
            sp.loadBoolean(this.getUseNormalMapName(), false);
        }
    }

    private loadPom(): void {
        const sp = this.getSp();
        const usePom = this.material.getParameters().get(MaterialSlot.USE_POM);
        if (usePom != null && usePom == 1) {
            sp.loadBoolean(this.getIsTherePomName(), true);
            let value = this.material.getParameters().get(MaterialSlot.POM_SCALE) as number;
            sp.loadFloat(this.getPomScaleName(), value == null ? BlinnPhongNormalHelper.defPOMScale : value);
            value = this.material.getParameters().get(MaterialSlot.POM_MIN_LAYERS) as number;
            sp.loadFloat(this.getPomMinLayersName(), value == null ? BlinnPhongNormalHelper.defPOMMinLayers : value);
            value = this.material.getParameters().get(MaterialSlot.POM_MAX_LAYERS) as number;
            sp.loadFloat(this.getPomMaxLayersName(), value == null ? BlinnPhongNormalHelper.defPOMMaxLayers : value);
        } else {
            sp.loadBoolean(this.getIsTherePomName(), false);
        }
    }

    protected getTextureUnit(): number {
        return 3;
    }

    protected getMapName(): string {
        return 'material.normal';
    }

    protected getIsThereMapName(): string {
        return 'material.isThereNormalMap';
    }

    protected getTileName(): string {
        return 'material.normalTile';
    }

    protected getOffsetName(): string {
        return 'material.normalOffset';
    }

    protected getColorName(): string {
        return null;
    }

    protected getUseNormalMapName(): string {
        return 'useNormalMap';
    }

    protected getIsTherePomName(): string {
        return 'material.isTherePOM';
    }

    protected getPomScaleName(): string {
        return 'material.POMScale';
    }

    protected getPomMinLayersName(): string {
        return 'material.POMMinLayers';
    }

    protected getPomMaxLayersName(): string {
        return 'material.POMMaxLayers';
    }

}
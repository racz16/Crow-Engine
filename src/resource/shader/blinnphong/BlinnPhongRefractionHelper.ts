import { BlinnPhongHelper } from "./BlinnPhongHelper";
import { Material } from "../../../material/Material";
import { GlShaderProgram } from "../../../webgl/shader/GlShaderProgram";
import { BlinnPhongRenderer } from "../../../rendering/renderer/BlinnPhongRenderer";

export class BlinnPhongRefractionHelper extends BlinnPhongHelper {

    private static readonly defaultRefractionIndex = 1 / 1.33;

    private material: Material<BlinnPhongRenderer>;

    public loadSlot(material: Material<BlinnPhongRenderer>, sp: GlShaderProgram): void {
        this.material = material;
        this.setValues(material.getSlot(Material.REFRACTION), sp);
        if (this.isCubeMapTextureUsable()) {
            this.loadCubeMapTexture();
            this.loadRefractionIndex();
        } else {
            this.loadDefaultCubeMapTexture();
            sp.loadBoolean(this.getIsThereMapName(), false);
        }
    }

    private loadRefractionIndex(): void {
        const sp = this.getSp();
        const index = this.material.getParameters().get(Material.REFRACTION_INDEX) == null ?
            BlinnPhongRefractionHelper.defaultRefractionIndex :
            this.material.getParameters().get(Material.REFRACTION_INDEX) as number;
        sp.loadFloat(this.getRefractionIndexName(), index);
    }

    protected getTextureUnit(): number {
        return 5;
    }

    protected getMapName(): string {
        return 'material.refraction';
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

    protected getRefractionIndexName(): string {
        return 'material.refractionIndex';
    }

}
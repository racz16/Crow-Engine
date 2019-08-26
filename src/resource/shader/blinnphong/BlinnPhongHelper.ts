import { vec3, vec4 } from "gl-matrix";

import { MaterialSlot } from "../../../material/MaterialSlot";
import { GlShaderProgram } from "../../../webgl/shader/GlShaderProgram";
import { Texture2D } from "../../texture/Texture2D";
import { Material } from "../../../material/Material";
import { CubeMapTexture } from "../../texture/CubeMapTexture";
import { BlinnPhongRenderer } from "../../../rendering/renderer/BlinnPhongRenderer";

export abstract class BlinnPhongHelper {

    private slot: MaterialSlot;
    private sp: GlShaderProgram;

    public abstract loadSlot(material: Material<BlinnPhongRenderer>, sp: GlShaderProgram): void;

    protected setValues(slot: MaterialSlot, sp: GlShaderProgram): void {
        this.slot = slot;
        this.sp = sp;
    }

    protected getSlot(): MaterialSlot {
        return this.slot;
    }

    protected getSp(): GlShaderProgram {
        return this.sp;
    }

    protected isTexture2DUsable(): boolean {
        return this.slot && this.slot.isActive() && this.slot.getTexture2D() && (this.slot.getTexture2D() as Texture2D).loaded;
    }

    protected isCubeMapTextureUsable(): boolean {
        return this.slot && this.slot.isActive() && this.slot.getCubeMapTexture() && (this.slot.getCubeMapTexture() as CubeMapTexture).loaded === 6;
    }

    protected isColorUsable(): boolean {
        return this.slot && this.slot.isActive() && this.slot.getColor() != null;
    }

    protected loadTexture2D(): void {
        const texture = this.slot.getTexture2D();
        this.sp.connectTextureUnit(this.getMapName(), this.getTextureUnit());
        texture.bindToTextureUnit(this.getTextureUnit());
        this.sp.loadBoolean(this.getIsThereMapName(), true);
        this.sp.loadVector2(this.getTileName(), this.slot.getTextureTile());
        this.sp.loadVector2(this.getOffsetName(), this.slot.getTextureOffset());
    }

    protected loadCubeMapTexture(): void {
        const texture = this.slot.getCubeMapTexture();
        this.sp.connectTextureUnit(this.getMapName(), this.getTextureUnit());
        texture.bindToTextureUnit(this.getTextureUnit());
        this.sp.loadBoolean(this.getIsThereMapName(), true);
    }

    protected loadColor3(): void {
        const color = this.slot.getColor();
        this.sp.loadVector3(this.getColorName(), vec3.fromValues(color[0], color[1], color[2]));
        this.sp.loadBoolean(this.getIsThereMapName(), false);
    }

    protected loadColor4(): void {
        const color = this.slot.getColor();
        this.sp.loadVector4(this.getColorName(), color);
        this.sp.loadBoolean(this.getIsThereMapName(), false);
    }

    protected loadDefaultTexture2D(): void {
        const texture = Texture2D.getDefaultTexture();
        this.sp.connectTextureUnit(this.getMapName(), this.getTextureUnit());
        texture.bindToTextureUnit(this.getTextureUnit());
    }

    protected loadDefaultCubeMapTexture(): void {
        const texture = CubeMapTexture.getDefaultTexture();
        this.sp.connectTextureUnit(this.getMapName(), this.getTextureUnit());
        texture.bindToTextureUnit(this.getTextureUnit());
    }

    protected loadDefaultColor3(defaultColor: vec3): void {
        this.sp.loadVector3(this.getColorName(), vec3.fromValues(defaultColor[0], defaultColor[1], defaultColor[2]));
        this.sp.loadBoolean(this.getIsThereMapName(), false);

    }

    protected loadDefaultColor4(defaultColor: vec4): void {
        this.sp.loadVector4(this.getColorName(), defaultColor);
        this.sp.loadBoolean(this.getIsThereMapName(), false);
    }

    protected abstract getTextureUnit(): number;

    protected abstract getMapName(): string;

    protected abstract getIsThereMapName(): string;

    protected abstract getTileName(): string;

    protected abstract getOffsetName(): string;

    protected abstract getColorName(): string;

}
import { vec3, vec4 } from 'gl-matrix';
import { MaterialSlot } from '../../../material/MaterialSlot';
import { GlShaderProgram } from '../../../webgl/shader/GlShaderProgram';
import { Material } from '../../../material/Material';
import { Engine } from '../../../core/Engine';
import { Utility } from '../../../utility/Utility';
import { ParameterKey } from '../../../utility/parameter/ParameterKey';

export abstract class ShaderSlotHelper {

    protected slot: MaterialSlot;
    protected shaderProgram: GlShaderProgram;

    public loadSlot(material: Material<any>, sp: GlShaderProgram): void {
        this.setValues(material.getSlot(this.getMaterialSlotKey()), sp);
        if (this.isTexture2DUsable()) {
            this.loadTexture2D();
        } else if (this.isColorUsable()) {
            this.loadDefaultTexture2D();
            this.loadColor3();
        } else {
            this.loadDefaultTexture2D();
            this.loadDefaultColor3(this.getDefaultColor());
        }
    }

    protected setValues(slot: MaterialSlot, shaderProgram: GlShaderProgram): void {
        this.slot = slot;
        this.shaderProgram = shaderProgram;
    }

    protected isTexture2DUsable(): boolean {
        return this.slot && this.slot.isActive() && Utility.isUsable(this.slot.getTexture2D());
    }

    protected isCubeMapTextureUsable(): boolean {
        return this.slot && this.slot.isActive() && Utility.isUsable(this.slot.getCubeMapTexture());
    }

    protected isColorUsable(): boolean {
        return this.slot && this.slot.isActive() && this.slot.getColor() != null;
    }

    protected loadTexture2D(): void {
        const texture = this.slot.getTexture2D();
        this.shaderProgram.connectTextureUnit(this.getMapName(), this.getTextureUnit());
        texture.getNativeTexture().bindToTextureUnit(this.getTextureUnit());
        this.shaderProgram.loadBoolean(this.getIsThereMapName(), true);
        this.shaderProgram.loadVector2(this.getTileName(), this.slot.getTextureTile());
        this.shaderProgram.loadVector2(this.getOffsetName(), this.slot.getTextureOffset());
    }

    protected loadCubeMapTexture(): void {
        const texture = this.slot.getCubeMapTexture();
        this.shaderProgram.connectTextureUnit(this.getMapName(), this.getTextureUnit());
        texture.getNativeTexture().bindToTextureUnit(this.getTextureUnit());
        this.shaderProgram.loadBoolean(this.getIsThereMapName(), true);
    }

    protected loadColor3(): void {
        const color = this.slot.getColor();
        this.shaderProgram.loadVector3(this.getColorName(), vec3.fromValues(color[0], color[1], color[2]));
        this.shaderProgram.loadBoolean(this.getIsThereMapName(), false);
    }

    protected loadColor4(): void {
        const color = this.slot.getColor();
        this.shaderProgram.loadVector4(this.getColorName(), color);
        this.shaderProgram.loadBoolean(this.getIsThereMapName(), false);
    }

    protected loadDefaultTexture2D(): void {
        const texture = Engine.getParameters().get(Engine.DEFAULT_TEXTURE_2D);
        this.shaderProgram.connectTextureUnit(this.getMapName(), this.getTextureUnit());
        texture.getNativeTexture().bindToTextureUnit(this.getTextureUnit());
    }

    protected loadDefaultCubeMapTexture(): void {
        const texture = Engine.getParameters().get(Engine.DEFAULT_CUBE_MAP_TEXTURE);
        this.shaderProgram.connectTextureUnit(this.getMapName(), this.getTextureUnit());
        texture.getNativeTexture().bindToTextureUnit(this.getTextureUnit());
    }

    protected loadDefaultColor3(defaultColor: vec3): void {
        this.shaderProgram.loadVector3(this.getColorName(), vec3.fromValues(defaultColor[0], defaultColor[1], defaultColor[2]));
        this.shaderProgram.loadBoolean(this.getIsThereMapName(), false);

    }

    protected loadDefaultColor4(defaultColor: vec4): void {
        this.shaderProgram.loadVector4(this.getColorName(), defaultColor);
        this.shaderProgram.loadBoolean(this.getIsThereMapName(), false);
    }

    protected getDefaultColor(): vec3 {
        return vec3.fromValues(0.5, 0.5, 0.5);
    }

    protected loadFloatParameter(parameterName: string, parameterKey: ParameterKey<number>, defaultValue: number): void {
        let value = defaultValue;
        if (this.isThereParameter(parameterKey)) {
            value = this.slot.getParameters().get(parameterKey);
        }
        this.shaderProgram.loadFloat(parameterName, value);
    }

    protected loadBooleanParameter(parameterName: string, parameterKey: ParameterKey<boolean>, defaultValue: boolean): void {
        let value = defaultValue;
        if (this.isThereParameter(parameterKey)) {
            value = this.slot.getParameters().get(parameterKey);
        }
        this.shaderProgram.loadBoolean(parameterName, value);
    }

    protected isThereParameter(parameterKey: ParameterKey<any>): boolean {
        return this.slot && this.slot.isActive() && this.slot.getParameters().get(parameterKey) != null;
    }

    protected abstract getMaterialSlotKey(): ParameterKey<MaterialSlot>;

    protected abstract getTextureUnit(): number;

    protected abstract getMapName(): string;

    protected abstract getIsThereMapName(): string;

    protected abstract getTileName(): string;

    protected abstract getOffsetName(): string;

    protected abstract getColorName(): string;

}
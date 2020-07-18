import { vec3, ReadonlyVec4 } from 'gl-matrix';
import { MaterialSlot } from '../../../material/MaterialSlot';
import { GlShaderProgram } from '../../../webgl/shader/GlShaderProgram';
import { Material } from '../../../material/Material';
import { Engine } from '../../../core/Engine';
import { Utility } from '../../../utility/Utility';
import { ParameterKey } from '../../../utility/parameter/ParameterKey';
import { GlTextureUnit } from '../../../webgl/GlTextureUnit';
import { Texture2D } from '../../texture/Texture2D';

export abstract class ShaderSlotHelper {

    protected slot: MaterialSlot;
    protected shaderProgram: GlShaderProgram;
    protected textureUnit: GlTextureUnit;
    protected multipleTextureCoordinates: boolean;

    public constructor(sp: GlShaderProgram, textureUnit: GlTextureUnit, multipleTextureCoordinates: boolean) {
        this.shaderProgram = sp;
        this.textureUnit = textureUnit;
        this.multipleTextureCoordinates = multipleTextureCoordinates;
    }

    public loadSlot(material: Material<any>): void {
        this.setSlot(material.getSlot(this.getMaterialSlotKey()));
        //texture
        if (this.isTexture2DUsable()) {
            this.loadTexture2D();
        } else {
            this.loadDefaultTexture2D();
        }
        //color
        if (this.isColorUsable()) {
            this.loadColor3();
        } else if (this.isTexture2DUsable()) {
            this.loadDefaultColor3(vec3.fromValues(1, 1, 1));
        } else {
            this.loadDefaultColor3(this.getDefaultColor());
        }
    }

    protected setSlot(slot: MaterialSlot): void {
        this.slot = slot;
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
        this.shaderProgram.loadTexture(this.getTextureUnit(), texture.getNativeTexture(), texture.getNativeSampler());
        this.shaderProgram.loadBoolean(this.getIsThereMapName(), true);
        this.shaderProgram.loadVector2(this.getTileName(), this.slot.getTextureTile());
        this.shaderProgram.loadVector2(this.getOffsetName(), this.slot.getTextureOffset());
        if (this.multipleTextureCoordinates) {
            this.shaderProgram.loadInt(this.getTextureCoordinateName(), this.slot.getTextureCoordinate());
        }
    }

    protected loadCubeMapTexture(): void {
        const texture = this.slot.getCubeMapTexture();
        this.shaderProgram.connectTextureUnit(this.getMapName(), this.getTextureUnit());
        this.shaderProgram.loadTexture(this.getTextureUnit(), texture.getNativeTexture(), texture.getNativeSampler());
        this.shaderProgram.loadBoolean(this.getIsThereMapName(), true);
    }

    protected loadColor3(): void {
        const color = this.slot.getColor();
        this.shaderProgram.loadVector3(this.getColorName(), vec3.fromValues(color[0], color[1], color[2]));
    }

    protected loadColor4(): void {
        const color = this.slot.getColor();
        this.shaderProgram.loadVector4(this.getColorName(), color);
    }

    protected loadDefaultTexture2D(): void {
        const texture = Engine.getParameters().get(Engine.BLACK_TEXTURE_2D);
        this.shaderProgram.connectTextureUnit(this.getMapName(), this.getTextureUnit());
        this.shaderProgram.loadTexture(this.getTextureUnit(), texture.getNativeTexture(), texture.getNativeSampler());
        this.shaderProgram.loadBoolean(this.getIsThereMapName(), false);
        if (this.multipleTextureCoordinates) {
            this.shaderProgram.loadInt(this.getTextureCoordinateName(), 0);
        }
    }

    protected loadDefaultCubeMapTexture(): void {
        const texture = Engine.getParameters().get(Engine.BLACK_CUBE_MAP_TEXTURE);
        this.shaderProgram.connectTextureUnit(this.getMapName(), this.getTextureUnit());
        this.shaderProgram.loadTexture(this.getTextureUnit(), texture.getNativeTexture(), texture.getNativeSampler());
        this.shaderProgram.loadBoolean(this.getIsThereMapName(), false);
    }

    protected loadDefaultColor3(defaultColor: vec3): void {
        this.shaderProgram.loadVector3(this.getColorName(), vec3.fromValues(defaultColor[0], defaultColor[1], defaultColor[2]));
    }

    protected loadDefaultColor4(defaultColor: ReadonlyVec4): void {
        this.shaderProgram.loadVector4(this.getColorName(), defaultColor);
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

    protected getTextureUnit(): GlTextureUnit {
        return this.textureUnit;
    }

    protected abstract getMaterialSlotKey(): ParameterKey<MaterialSlot>;

    protected abstract getMapName(): string;

    protected abstract getIsThereMapName(): string;

    protected abstract getTileName(): string;

    protected abstract getOffsetName(): string;

    protected abstract getColorName(): string;

    protected abstract getTextureCoordinateName(): string;

}
import { vec4, vec2 } from "gl-matrix";
import { ParameterKey } from "../utility/parameter/ParameterKey";
import { ParameterContainer } from "../utility/parameter/ParameterContainer";
import { ITexture2D } from "../resource/texture/ITexture2D";
import { ICubeMapTexture } from "../resource/texture/ICubeMapTexture";

export class MaterialSlot {

    public static readonly USE_GLOSSINESS = new ParameterKey<Number>(Number, "PARAM_USE_GLOSSINESS");
    public static readonly USE_POM = new ParameterKey<Number>(Number, "PARAM_USE_POM");
    public static readonly POM_SCALE = new ParameterKey<Number>(Number, "PARAM_POM_SCALE");
    public static readonly POM_MIN_LAYERS = new ParameterKey<Number>(Number, "PARAM_POM_MIN_LAYERS");
    public static readonly POM_MAX_LAYERS = new ParameterKey<Number>(Number, "PARAM_POM_MAX_LAYERS");
    private readonly textureTile = vec2.fromValues(1, 1);
    private readonly textureOffset = vec2.create();
    private readonly parameters = new ParameterContainer();
    private active = true;
    private color: vec4;
    private texture2D: ITexture2D;
    private cubeMapTexture: ICubeMapTexture;

    public isActive(): boolean {
        return this.active;
    }

    public setActive(active: boolean): void {
        this.active = active;
    }

    public getColor(): vec4 {
        return this.color;
    }

    public setColor(color: vec4): void {
        this.color = color;
    }

    public getTexture2D(): ITexture2D {
        return this.texture2D;
    }

    public setTexture2D(texture: ITexture2D): void {
        this.texture2D = texture;
    }

    public getCubeMapTexture(): ICubeMapTexture {
        return this.cubeMapTexture;
    }

    public setCubeMapTexture(cubeMapTexture: ICubeMapTexture) {
        this.cubeMapTexture = cubeMapTexture;
    }

    public getTextureTile(): vec2 {
        return this.textureTile;
    }

    public setTextureTile(textureTile: vec2): void {
        this.textureTile.set(textureTile);
    }

    public getTextureOffset(): vec2 {
        return this.textureOffset;
    }

    public setTextureOffset(textureOffset: vec2): void {
        this.textureOffset.set(textureOffset);
    }

    public getParameters(): ParameterContainer {
        return this.parameters;
    }

}
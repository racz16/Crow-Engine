import { vec4, vec2, vec3 } from 'gl-matrix';
import { ParameterKey } from '../utility/parameter/ParameterKey';
import { ParameterContainer } from '../utility/parameter/ParameterContainer';
import { ITexture2D } from '../resource/texture/ITexture2D';
import { ICubeMapTexture } from '../resource/texture/ICubeMapTexture';
import { ITexture2DArray } from '../resource/texture/ITexture2DArray';

export class MaterialSlot {

    public static readonly USE_GLOSSINESS = new ParameterKey<boolean>('PARAM_USE_GLOSSINESS');
    public static readonly NORMAL_SCALE = new ParameterKey<number>('PARAM_NORMAL_SCALE');
    public static readonly USE_POM = new ParameterKey<boolean>('PARAM_USE_POM');
    public static readonly POM_SCALE = new ParameterKey<number>('PARAM_POM_SCALE');
    public static readonly POM_MIN_LAYERS = new ParameterKey<number>('PARAM_POM_MIN_LAYERS');
    public static readonly POM_MAX_LAYERS = new ParameterKey<number>('PARAM_POM_MAX_LAYERS');
    public static readonly REFRACTION_INDEX = new ParameterKey<number>('PARAM_REFRACTION_INDEX');
    public static readonly PARALLAX_CORRECTION_GEOMETRY_PROXY_RADIUS = new ParameterKey<number>('PARAM_PARALLAX_CORRECTION_GEOMETRY_PROXY_RADIUS');
    public static readonly PARALLAX_CORRECTION_ENVIRONMENT_PROBE_POSITION = new ParameterKey<vec3>('PARAM_PARALLAX_CORRECTION_ENVIRONMENT_PROBE_POSITION');
    public static readonly OCCLUSION_STRENGTH = new ParameterKey<number>('PARAM_OCCLUSION_STRENGTH');

    private readonly textureTile = vec2.fromValues(1, 1);
    private readonly textureOffset = vec2.create();
    private textureCoordinate = 0;
    private textureLayer = 0;
    private active = true;
    private color: vec4;
    private texture2D: ITexture2D;
    private texture2DArray: ITexture2DArray;
    private cubeMapTexture: ICubeMapTexture;
    private readonly parameters = new ParameterContainer();

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

    public getTexture2DArray(): ITexture2DArray {
        return this.texture2DArray;
    }

    public setTexture2DArray(texture: ITexture2DArray): void {
        this.texture2DArray = texture;
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
        vec2.copy(this.textureTile, textureTile);
    }

    public getTextureOffset(): vec2 {
        return this.textureOffset;
    }

    public setTextureOffset(textureOffset: vec2): void {
        vec2.copy(this.textureOffset, textureOffset);
    }

    public getTextureLayer(): number {
        return this.textureLayer;
    }

    public setTextureLayer(layer: number): void {
        this.textureLayer = layer;
    }

    public getParameters(): ParameterContainer {
        return this.parameters;
    }

    public getTextureCoordinate(): number {
        return this.textureCoordinate;
    }

    public setTextureCoordinate(textureCoordinate): void {
        if (textureCoordinate < 0) {
            throw new Error();
        }
        this.textureCoordinate = textureCoordinate;
    }

}
import { GlObject } from "./GlObject";
import { Gl } from "./Gl";
import { GlConstants } from "./GlConstants";
import { TextureWrap, TextureWrapResolver } from "./enum/TextureWrap";
import { MagnificationFilter, MagnificationFilterResolver } from "./enum/MagnificationFIlter";
import { MinificationFilter, MinificationFilterResolver } from "./enum/MinificationFilter";

export class GlSampler extends GlObject {

    private anisotropicLevel = 1;
    private magnificationFilter = MagnificationFilter.NEAREST;
    private minificationFilter = MinificationFilter.NEAREST_MIPMAP_NEAREST;
    private wrapU = TextureWrap.REPEAT;
    private wrapV = TextureWrap.REPEAT;
    private wrapW = TextureWrap.REPEAT;

    public constructor() {
        super();
        this.setId(this.createId());
    }

    protected createId(): number {
        return Gl.gl.createSampler() as number;
    }

    public getAnisotropicLevel(): number {
        return this.anisotropicLevel;
    }

    public setAnisotropicLevel(level: number): void {
        this.anisotropicLevel = level;
        Gl.gl.samplerParameterf(this.getId(), GlConstants.ANISOTROPIC_FILTER_EXTENSION.TEXTURE_MAX_ANISOTROPY_EXT, this.anisotropicLevel);
    }

    public static isAnisotropicFilterEnabled(): boolean {
        return GlConstants.ANISOTROPIC_FILTER_ENABLED;
    }

    public static getMaxAnisotropicLevel(): number {
        return GlConstants.MAX_ANISOTROPIC_FILTER_LEVEL;
    }

    //
    //filter
    //
    public getMagnificationFilter(): MagnificationFilter {
        return this.magnificationFilter;
    }

    public setMagnificationFilter(filter: MagnificationFilter): void {
        this.magnificationFilter = filter;
        Gl.gl.samplerParameteri(this.getId(), Gl.gl.TEXTURE_MAG_FILTER, MagnificationFilterResolver.enumToGl(filter));
    }

    public getMinificationFilter(): MinificationFilter {
        return this.minificationFilter;
    }

    public setMinificationFilter(filter: MinificationFilter): void {
        this.minificationFilter = filter;
        Gl.gl.samplerParameteri(this.getId(), Gl.gl.TEXTURE_MIN_FILTER, MinificationFilterResolver.enumToGl(filter));
    }

    //
    //wrap
    //
    public getWrapU(): TextureWrap {
        return this.wrapU;
    }

    public setWrapU(wrap: TextureWrap): void {
        this.wrapU = wrap;
        Gl.gl.samplerParameteri(this.getId(), Gl.gl.TEXTURE_WRAP_S, TextureWrapResolver.enumToGl(wrap));
    }

    public getWrapV(): TextureWrap {
        return this.wrapV;
    }

    public setWrapV(wrap: TextureWrap): void {
        this.wrapV = wrap;
        Gl.gl.samplerParameteri(this.getId(), Gl.gl.TEXTURE_WRAP_T, TextureWrapResolver.enumToGl(wrap));
    }

    public getWrapW(): TextureWrap {
        return this.wrapW;
    }

    public setWrapW(wrap: TextureWrap): void {
        this.wrapW = wrap;
        Gl.gl.samplerParameteri(this.getId(), Gl.gl.TEXTURE_WRAP_R, TextureWrapResolver.enumToGl(wrap));
    }

    //
    //misc
    //
    public static getMaxTextureUnits(): number {
        return GlConstants.MAX_COMBINED_TEXTURE_IMAGE_UNITS;
    }

    public static getMaxTextureUnitsSafe(): number {
        return GlConstants.MAX_COMBINED_TEXTURE_IMAGE_UNITS_SAFE;
    }

    public bindToTextureUnit(textureUnit: number): void {
        Gl.gl.bindSampler(textureUnit, this.getId());
    }

    public release(): void {
        Gl.gl.deleteSampler(this.getId());
        this.setId(GlObject.INVALID_ID);
    }


}
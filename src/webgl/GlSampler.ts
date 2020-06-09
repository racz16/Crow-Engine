import { GlObject } from "./GlObject";
import { Gl } from "./Gl";
import { GlConstants } from "./GlConstants";
import { GlWrap, GlWrapResolver } from "./enum/GlWrap";
import { GlMagnificationFilter as GlMagnificationFilter, GlMagnificationFilterResolver } from "./enum/GlMagnificationFIlter";
import { GlMinificationFilter, GlMinificationFilterResolver } from "./enum/GlMinificationFilter";
import { GlTextureUnit } from "./GlTextureUnit";

export class GlSampler extends GlObject {

    private anisotropicLevel = 1;
    private magnificationFilter = GlMagnificationFilter.LINEAR;
    private minificationFilter = GlMinificationFilter.NEAREST_MIPMAP_LINEAR;
    private wrapU = GlWrap.REPEAT;
    private wrapV = GlWrap.REPEAT;
    private wrapW = GlWrap.REPEAT;

    public constructor() {
        super();
        this.setId(this.createId());
    }

    protected createId(): number {
        return Gl.gl.createSampler() as number;
    }

    public bindToTextureUnit(textureUnit: GlTextureUnit): void {
        Gl.gl.bindSampler(textureUnit.getIndex(), this.getId());
    }

    public static unbindFromTextureUnit(textureUnit: GlTextureUnit): void {
        Gl.gl.bindSampler(textureUnit.getIndex(), null);
    }

    //filter
    public getAnisotropicLevel(): number {
        return this.anisotropicLevel;
    }

    public setAnisotropicLevel(level: number): void {
        this.anisotropicLevel = level;
        Gl.gl.samplerParameterf(this.getId(), GlConstants.ANISOTROPIC_FILTER_EXTENSION.TEXTURE_MAX_ANISOTROPY_EXT, this.anisotropicLevel);
    }

    public getMagnificationFilter(): GlMagnificationFilter {
        return this.magnificationFilter;
    }

    public setMagnificationFilter(filter: GlMagnificationFilter): void {
        this.magnificationFilter = filter;
        Gl.gl.samplerParameteri(this.getId(), Gl.gl.TEXTURE_MAG_FILTER, GlMagnificationFilterResolver.enumToGl(filter));
    }

    public getMinificationFilter(): GlMinificationFilter {
        return this.minificationFilter;
    }

    public setMinificationFilter(filter: GlMinificationFilter): void {
        this.minificationFilter = filter;
        Gl.gl.samplerParameteri(this.getId(), Gl.gl.TEXTURE_MIN_FILTER, GlMinificationFilterResolver.enumToGl(filter));
    }

    //wrap
    public getWrapU(): GlWrap {
        return this.wrapU;
    }

    public setWrapU(wrap: GlWrap): void {
        this.wrapU = wrap;
        Gl.gl.samplerParameteri(this.getId(), Gl.gl.TEXTURE_WRAP_S, GlWrapResolver.enumToGl(wrap));
    }

    public getWrapV(): GlWrap {
        return this.wrapV;
    }

    public setWrapV(wrap: GlWrap): void {
        this.wrapV = wrap;
        Gl.gl.samplerParameteri(this.getId(), Gl.gl.TEXTURE_WRAP_T, GlWrapResolver.enumToGl(wrap));
    }

    public getWrapW(): GlWrap {
        return this.wrapW;
    }

    public setWrapW(wrap: GlWrap): void {
        this.wrapW = wrap;
        Gl.gl.samplerParameteri(this.getId(), Gl.gl.TEXTURE_WRAP_R, GlWrapResolver.enumToGl(wrap));
    }

    //misc
    public release(): void {
        Gl.gl.deleteSampler(this.getId());
        this.setId(GlObject.INVALID_ID);
    }

}
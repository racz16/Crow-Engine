import { GlObject } from '../GlObject';
import { vec2 } from 'gl-matrix';
import { InternalFormat, InternalFormatResolver } from '../enum/InternalFormat';
import { TextureFilter, TextureFilterResolver } from '../enum/TextureFilter';
import { TextureWrap, TextureWrapResolver } from '../enum/TextureWrap';
import { GlConstants } from '../GlConstants';
import { Gl } from '../Gl';
import { IResource } from '../../resource/IResource';

export abstract class GlTexture extends GlObject implements IResource {

    private size = vec2.create();
    private allocated: boolean;
    private internalFormat: InternalFormat;
    private mipmapLevelCount = 1;
    private anisotropicLevel = 1;
    private magnificationFilter = TextureFilter.NEAREST;
    private minificationFilter = TextureFilter.NEAREST_MIPMAP_NEAREST;
    private wrapU = TextureWrap.REPEAT;
    private wrapV = TextureWrap.REPEAT;

    public constructor() {
        super();
        this.setId(this.createId());
    }

    protected createId(): number {
        return Gl.gl.createTexture() as number;
    }

    protected abstract getTarget(): number;

    public bind(): void {
        Gl.gl.bindTexture(this.getTarget(), this.getId());
    }

    //
    //allocate----------------------------------------------------------------------------------------------------------
    //
    public allocate(internalFormat: InternalFormat, size: vec2, mipmaps: boolean): void {
        this.allocationGeneral(internalFormat, size, mipmaps);
        const glInternalFormat = InternalFormatResolver.enumToGl(this.internalFormat).code;
        this.bind();
        Gl.gl.texStorage2D(this.getTarget(), this.mipmapLevelCount, glInternalFormat, this.size[0], this.size[1]);
    }

    protected allocationGeneral(internalFormat: InternalFormat, size: vec2, mipmaps: boolean): void {
        this.setInternalFormat(internalFormat);
        this.setSize(size);
        this.setDataSize(this.computeDataSize());
        this.allocated = true;
        this.setMipmapCount(mipmaps);
    }

    protected computeDataSize(): number {
        const pixelSizeInBits = InternalFormatResolver.enumToGl(this.internalFormat).bitDepth;
        const numberOfPixels = this.size[0] * this.size[1];
        const mipmapMultiplier = this.isMipmapped() ? 1 / 3 : 1;
        const dataSizeInBits = pixelSizeInBits * numberOfPixels * mipmapMultiplier;
        const dataSizeInBytes = dataSizeInBits / 8;
        return dataSizeInBytes;
    }

    public isAllocated(): boolean {
        return this.allocated;
    }

    //
    //mipmap------------------------------------------------------------------------------------------------------------
    //
    public isMipmapped(): boolean {
        return this.mipmapLevelCount > 1;
    }

    public getMipmapLevelCount(): number {
        return this.mipmapLevelCount;
    }

    protected setMipmapCount(mipmaps: boolean): void {
        this.mipmapLevelCount = mipmaps ? this.computeMaxMipmapCount() : 1;
    }

    private computeMaxMipmapCount(): number {
        return Math.floor(Math.log(Math.max(this.size[0], this.size[1])) / Math.log(2)) + 1;
    }

    public getAnisotropicLevel(): number {
        return this.anisotropicLevel;
    }

    public setAnisotropicLevel(level: number): void {
        this.anisotropicLevel = level;
        this.bind();
        Gl.gl.texParameterf(this.getTarget(), GlConstants.ANISOTROPIC_FILTER_EXTENSION.TEXTURE_MAX_ANISOTROPY_EXT, this.anisotropicLevel);
    }

    public static isAnisotropicFilterEnabled(): boolean {
        return GlConstants.ANISOTROPIC_FILTER_ENABLED;
    }

    public static getMaxAnisotropicLevel(): number {
        return GlConstants.MAX_ANISOTROPIC_FILTER_LEVEL;
    }

    //
    //filter------------------------------------------------------------------------------------------------------------
    //
    public getMagnificationFilter(): TextureFilter {
        return this.magnificationFilter;
    }

    public setMagnificationFilter(filter: TextureFilter): void {
        this.magnificationFilter = filter;
        this.bind();
        Gl.gl.texParameteri(this.getTarget(), Gl.gl.TEXTURE_MAG_FILTER, TextureFilterResolver.enumToGl(filter));
    }

    public getMinificationFilter(): TextureFilter {
        return this.minificationFilter;
    }

    public setMinificationFilter(filter: TextureFilter): void {
        this.minificationFilter = filter;
        this.bind();
        Gl.gl.texParameteri(this.getTarget(), Gl.gl.TEXTURE_MIN_FILTER, TextureFilterResolver.enumToGl(filter));
    }

    //
    //wrap--------------------------------------------------------------------------------------------------------------
    //
    public getWrapU(): TextureWrap {
        return this.wrapU;
    }

    public setWrapU(wrap: TextureWrap): void {
        this.wrapU = wrap;
        this.bind();
        Gl.gl.texParameteri(this.getTarget(), Gl.gl.TEXTURE_WRAP_S, TextureWrapResolver.enumToGl(wrap));
    }

    public getWrapV(): TextureWrap {
        return this.wrapV;
    }

    public setWrapV(wrap: TextureWrap): void {
        this.wrapV = wrap;
        this.bind();
        Gl.gl.texParameteri(this.getTarget(), Gl.gl.TEXTURE_WRAP_T, TextureWrapResolver.enumToGl(wrap));
    }

    //
    //misc--------------------------------------------------------------------------------------------------------------
    //
    public generateMipmaps(): void {
        this.bind();
        Gl.gl.generateMipmap(this.getTarget());
    }

    public getInternalFormat(): InternalFormat {
        return this.internalFormat;
    }

    protected setInternalFormat(internalFormat: InternalFormat): void {
        this.internalFormat = internalFormat;
    }

    public getSize(): vec2 {
        return vec2.clone(this.size);
    }

    protected setSize(size: vec2): void {
        this.size.set(size);
    }

    public static getMaxSize(): number {
        return GlConstants.MAX_TEXTURE_SIZE;
    }

    public static getMaxSizeSafe(): number {
        return GlConstants.MAX_TEXTURE_SIZE_SAFE;
    }

    public issRgb(): boolean {
        return this.internalFormat === InternalFormat.SRGB8_A8 || this.internalFormat == InternalFormat.SRGB8;
    }

    public bindToTextureUnit(textureUnit: number): void {
        Gl.gl.activeTexture(Gl.gl.TEXTURE0 + textureUnit);
        this.bind();
    }

    public static getMaxTextureUnits(): number {
        return GlConstants.MAX_COMBINED_TEXTURE_IMAGE_UNITS;
    }

    public static getMaxTextureUnitsSafe(): number {
        return GlConstants.MAX_COMBINED_TEXTURE_IMAGE_UNITS_SAFE;
    }

    public release(): void {
        Gl.gl.deleteTexture(this.getId());
        this.setId(-1);
        this.setDataSize(0);
        this.allocated = false;
    }

}

import { GlObject } from '../GlObject';
import { vec2, ReadonlyVec2 } from 'gl-matrix';
import { GlInternalFormat, GlInternalFormatResolver } from '../enum/GlInternalFormat';
import { GlWrap, GlWrapResolver } from '../enum/GlWrap';
import { GlConstants } from '../GlConstants';
import { Gl } from '../Gl';
import { IResource } from '../../resource/IResource';
import { GlMagnificationFilter, GlMagnificationFilterResolver } from '../enum/GlMagnificationFIlter';
import { GlMinificationFilter, GlMinificationFilterResolver } from '../enum/GlMinificationFilter';
import { GlTextureUnit } from '../GlTextureUnit';

export abstract class GlTexture extends GlObject implements IResource {

    private readonly size = vec2.create();
    private layers = 1;
    private allocated: boolean;
    private internalFormat: GlInternalFormat;
    private mipmapLevelCount = 1;
    private anisotropicLevel = 1;
    private magnificationFilter = GlMagnificationFilter.LINEAR;
    private minificationFilter = GlMinificationFilter.NEAREST_MIPMAP_LINEAR;
    private wrapU = GlWrap.REPEAT;
    private wrapV = GlWrap.REPEAT;

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

    //allocate
    protected allocate2D(internalFormat: GlInternalFormat, size: ReadonlyVec2, layers: number, mipmaps: boolean): void {
        this.allocationGeneral(internalFormat, size, layers, mipmaps);
        const glInternalFormat = GlInternalFormatResolver.enumToGl(this.internalFormat).getCode();
        this.bind();
        Gl.gl.texStorage2D(this.getTarget(), this.mipmapLevelCount, glInternalFormat, this.size[0], this.size[1]);
        this.allocated = true;
    }

    protected allocate3D(internalFormat: GlInternalFormat, size: ReadonlyVec2, layers: number, mipmaps: boolean): void {
        this.allocationGeneral(internalFormat, size, layers, mipmaps);
        const glInternalFormat = GlInternalFormatResolver.enumToGl(this.internalFormat).getCode();
        this.bind();
        Gl.gl.texStorage3D(this.getTarget(), this.mipmapLevelCount, glInternalFormat, this.size[0], this.size[1], layers);
        this.allocated = true;
    }

    protected allocationGeneral(internalFormat: GlInternalFormat, size: ReadonlyVec2, layers: number, mipmaps: boolean): void {
        this.setInternalFormat(internalFormat);
        this.setSize(size);
        this.setLayers(layers);
        this.setMipmapCount(mipmaps);
        this.setDataSize(this.computeDataSize());
    }

    protected computeDataSize(): number {
        Gl.gl.getTexParameter
        const pixelSizeInBits = GlInternalFormatResolver.enumToGl(this.internalFormat).getBitDepth();
        const numberOfPixels = this.size[0] * this.size[1] * this.layers;
        const mipmapMultiplier = this.isMipmapped() ? 1 + 1 / 3 : 1;
        const dataSizeInBits = pixelSizeInBits * numberOfPixels * mipmapMultiplier;
        const dataSizeInBytes = dataSizeInBits / 8;
        return dataSizeInBytes;
    }

    public isAllocated(): boolean {
        return this.allocated;
    }

    //mipmap
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

    //filter
    public getMagnificationFilter(): GlMagnificationFilter {
        return this.magnificationFilter;
    }

    public setMagnificationFilter(filter: GlMagnificationFilter): void {
        this.magnificationFilter = filter;
        this.bind();
        Gl.gl.texParameteri(this.getTarget(), Gl.gl.TEXTURE_MAG_FILTER, GlMagnificationFilterResolver.enumToGl(filter));
    }

    public getMinificationFilter(): GlMinificationFilter {
        return this.minificationFilter;
    }

    public setMinificationFilter(filter: GlMinificationFilter): void {
        this.minificationFilter = filter;
        this.bind();
        Gl.gl.texParameteri(this.getTarget(), Gl.gl.TEXTURE_MIN_FILTER, GlMinificationFilterResolver.enumToGl(filter));
    }

    //wrap
    public getWrapU(): GlWrap {
        return this.wrapU;
    }

    public setWrapU(wrap: GlWrap): void {
        this.wrapU = wrap;
        this.bind();
        Gl.gl.texParameteri(this.getTarget(), Gl.gl.TEXTURE_WRAP_S, GlWrapResolver.enumToGl(wrap));
    }

    public getWrapV(): GlWrap {
        return this.wrapV;
    }

    public setWrapV(wrap: GlWrap): void {
        this.wrapV = wrap;
        this.bind();
        Gl.gl.texParameteri(this.getTarget(), Gl.gl.TEXTURE_WRAP_T, GlWrapResolver.enumToGl(wrap));
    }

    //misc
    public generateMipmaps(): void {
        this.bind();
        Gl.gl.generateMipmap(this.getTarget());
    }

    public getInternalFormat(): GlInternalFormat {
        return this.internalFormat;
    }

    protected setInternalFormat(internalFormat: GlInternalFormat): void {
        this.internalFormat = internalFormat;
    }

    public getSize(): ReadonlyVec2 {
        return this.size;
    }

    protected setSize(size: ReadonlyVec2): void {
        vec2.copy(this.size, size);
    }

    public getLayers(): number {
        return this.layers;
    }

    protected setLayers(layers: number): void {
        this.layers = layers;
    }

    public isSRgb(): boolean {
        return this.internalFormat === GlInternalFormat.SRGB8_A8 || this.internalFormat === GlInternalFormat.SRGB8;
    }

    public bindToTextureUnit(textureUnit: GlTextureUnit): void {
        Gl.gl.activeTexture(textureUnit.getId());
        this.bind();
    }

    public isMultisampled(): boolean {
        return false;
    }

    public getSampleCount(): number {
        return 1;
    }

    public release(): void {
        Gl.gl.deleteTexture(this.getId());
        this.setId(GlObject.INVALID_ID);
        this.setDataSize(0);
        this.allocated = false;
    }

}

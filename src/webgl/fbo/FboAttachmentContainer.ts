import { GlTexture2D } from '../texture/GlTexture2D';
import { Rbo } from './Rbo';
import { Utility } from '../../utility/Utility';
import { FboAttachmentSlot, AttachmentSlotResolver } from '../enum/FboAttachmentSlot';
import { GlCubeMapTextureSide } from '../texture/GlCubeMapTextureSide';
import { IFboAttachment } from './IFboAttachment';
import { Fbo } from './Fbo';
import { Gl } from '../Gl';
import { CubeMapSideResolver } from '../enum/CubeMapSide';
import { GlTexture2DArrayLayer } from '../texture/GlTexture2DArrayLayer';

export class FboAttachmentContainer {

    private texture: GlTexture2D;
    private textureArrayLayer: GlTexture2DArrayLayer;
    private cubeMapSideTexture: GlCubeMapTextureSide;
    private rbo: Rbo;
    private index: number;
    private slot: FboAttachmentSlot;
    private draw = false;
    private fbo: Fbo;

    public constructor(fbo: Fbo, slot: FboAttachmentSlot, index: number) {
        this.fbo = fbo;
        this.slot = slot;
        this.index = index;
        if (index === 0) {
            this.draw = true;
        }
    }

    public getIndex(): number {
        return this.index;
    }

    public getSlot(): FboAttachmentSlot {
        return this.slot;
    }

    public getFbo(): Fbo {
        return this.fbo;
    }

    //getter------------------------------------------------------------------------------------------------------------
    public getAttachment(): IFboAttachment {
        return this.isThereRboAttachment() ? this.getRboAttachment() : (this.isThereTextureAttachment() ? this.getTextureAttachment() : (this.isThereTextureArrayLayerAttachment() ? this.getTextureArrayLayerAttachment() : this.getCubeMapSideTextureAttachment()));
    }

    public getTextureAttachment(): GlTexture2D {
        return this.isThereTextureAttachment() ? this.texture : null;
    }

    public getTextureArrayLayerAttachment(): GlTexture2DArrayLayer {
        return this.isThereTextureArrayLayerAttachment() ? this.textureArrayLayer : null;
    }

    public getCubeMapSideTextureAttachment(): GlCubeMapTextureSide {
        return this.isThereCubeMapSideTextureAttachment() ? this.cubeMapSideTexture : null;
    }

    public getRboAttachment(): Rbo {
        return this.isThereRboAttachment() ? this.rbo : null;
    }

    //attach------------------------------------------------------------------------------------------------------------
    public attachTexture2D(texture: GlTexture2D): void {
        this.rbo = null;
        this.texture = texture;
        this.textureArrayLayer = null;
        this.cubeMapSideTexture = null;
        this.fbo.bind();
        Gl.gl.framebufferTexture2D(Gl.gl.FRAMEBUFFER, AttachmentSlotResolver.enumToGl(this.slot).attachmentPointCode, Gl.gl.TEXTURE_2D, texture.getId(), 0);
    }

    public attachTexture2DArrayLayer(texture: GlTexture2DArrayLayer): void {
        this.rbo = null;
        this.texture = null;
        this.textureArrayLayer = texture;
        this.cubeMapSideTexture = null;
        this.fbo.bind();
        Gl.gl.framebufferTextureLayer(Gl.gl.FRAMEBUFFER, AttachmentSlotResolver.enumToGl(this.slot).attachmentPointCode, texture.getTexture2DArray().getId(), 0, texture.getLayer());
    }

    public attachCubeMapTextureSide(texture: GlCubeMapTextureSide): void {
        this.rbo = null;
        this.texture = null;
        this.textureArrayLayer = null;
        this.cubeMapSideTexture = texture;
        this.fbo.bind();
        Gl.gl.framebufferTextureLayer(Gl.gl.FRAMEBUFFER, AttachmentSlotResolver.enumToGl(this.slot).attachmentPointCode, texture.getCubeMapTexture().getId(), 0, CubeMapSideResolver.enumToGl(texture.getSide()));
    }

    public attachRbo(rbo: Rbo): void {
        this.rbo = rbo;
        this.texture = null;
        this.textureArrayLayer = null;
        this.cubeMapSideTexture = null;
        this.fbo.bind();
        Gl.gl.framebufferRenderbuffer(Gl.gl.FRAMEBUFFER, AttachmentSlotResolver.enumToGl(this.slot).attachmentPointCode, Gl.gl.RENDERBUFFER, rbo.getId())
    }

    public detachAttachment(): void {
        this.rbo = null;
        this.texture = null;
        this.textureArrayLayer = null;
        this.cubeMapSideTexture = null;
        this.fbo.bind();
        Gl.gl.framebufferTexture2D(Gl.gl.FRAMEBUFFER, AttachmentSlotResolver.enumToGl(this.slot).attachmentPointCode, Gl.gl.TEXTURE_2D, null, 0);
    }

    //contains----------------------------------------------------------------------------------------------------------
    public isThereAttachment(): boolean {
        return this.isThereTextureAttachment() ||
            this.isThereTextureArrayLayerAttachment() ||
            this.isThereRboAttachment() ||
            this.isThereCubeMapSideTextureAttachment();
    }

    public isThereTextureAttachment(): boolean {
        return Utility.isUsable(this.texture);
    }

    public isThereTextureArrayLayerAttachment(): boolean {
        return Utility.isUsable(this.textureArrayLayer);
    }

    public isThereCubeMapSideTextureAttachment(): boolean {
        return Utility.isUsable(this.cubeMapSideTexture);
    }

    public isThereRboAttachment(): boolean {
        return Utility.isUsable(this.rbo);
    }

    //draw--------------------------------------------------------------------------------------------------------------
    public isDrawBuffer(): boolean {
        return this.draw;
    }

    private setDrawBuffer(draw: boolean): void {
        this.draw = draw;
    }

    public isReadBuffer(): boolean {
        return this.fbo.getReadBufferIndex() === this.index;
    }

    public setReadBuffer(): void {
        this.fbo.setReadBuffer(this.index);
    }

}

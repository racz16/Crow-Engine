import { GlTexture2D } from '../texture/GlTexture2D';
import { GlRbo } from './GlRbo';
import { Utility } from '../../utility/Utility';
import { GlFboAttachmentSlot, GlAttachmentSlotResolver } from '../enum/GlFboAttachmentSlot';
import { GlCubeMapTextureSide } from '../texture/GlCubeMapTextureSide';
import { IGlFboAttachment } from './IGlFboAttachment';
import { GlFbo } from './GlFbo';
import { Gl } from '../Gl';
import { GlCubeMapSideResolver } from '../enum/GlCubeMapSide';
import { GlTexture2DArrayLayer } from '../texture/GlTexture2DArrayLayer';

export class GlFboAttachmentContainer {

    private texture: GlTexture2D;
    private textureArrayLayer: GlTexture2DArrayLayer;
    private cubeMapSideTexture: GlCubeMapTextureSide;
    private rbo: GlRbo;
    private index: number;
    private slot: GlFboAttachmentSlot;
    private fbo: GlFbo;

    public constructor(fbo: GlFbo, slot: GlFboAttachmentSlot, index = 0) {
        this.fbo = fbo;
        this.slot = slot;
        this.index = index;
    }

    public getIndex(): number {
        return this.index;
    }

    public getId(): number {
        return Gl.gl.COLOR_ATTACHMENT0 + this.getIndex();
    }

    public getSlot(): GlFboAttachmentSlot {
        return this.slot;
    }

    public getFbo(): GlFbo {
        return this.fbo;
    }

    //getter
    public getAttachment(): IGlFboAttachment {
        if (this.isThereRboAttachment()) {
            return this.getRboAttachment();
        } else if (this.isThereTextureAttachment()) {
            return this.getTextureAttachment();
        } else if (this.isThereTextureArrayLayerAttachment()) {
            return this.getTextureArrayLayerAttachment();
        } else {
            return this.getCubeMapSideTextureAttachment();
        }
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

    public getRboAttachment(): GlRbo {
        return this.isThereRboAttachment() ? this.rbo : null;
    }

    //attach
    public attachTexture2D(texture: GlTexture2D): void {
        this.rbo = null;
        this.texture = texture;
        this.textureArrayLayer = null;
        this.cubeMapSideTexture = null;
        this.fbo.bind();
        Gl.gl.framebufferTexture2D(Gl.gl.FRAMEBUFFER, GlAttachmentSlotResolver.enumToGl(this.slot).getAttachmentPointCode() + this.index, Gl.gl.TEXTURE_2D, texture.getId(), 0);
    }

    public attachTexture2DArrayLayer(texture: GlTexture2DArrayLayer): void {
        this.rbo = null;
        this.texture = null;
        this.textureArrayLayer = texture;
        this.cubeMapSideTexture = null;
        this.fbo.bind();
        Gl.gl.framebufferTextureLayer(Gl.gl.FRAMEBUFFER, GlAttachmentSlotResolver.enumToGl(this.slot).getAttachmentPointCode() + this.index, texture.getTexture2DArray().getId(), 0, texture.getLayer());
    }

    public attachCubeMapTextureSide(texture: GlCubeMapTextureSide): void {
        this.rbo = null;
        this.texture = null;
        this.textureArrayLayer = null;
        this.cubeMapSideTexture = texture;
        this.fbo.bind();
        Gl.gl.framebufferTextureLayer(Gl.gl.FRAMEBUFFER, GlAttachmentSlotResolver.enumToGl(this.slot).getAttachmentPointCode() + this.index, texture.getCubeMapTexture().getId(), 0, GlCubeMapSideResolver.enumToGl(texture.getSide()));
    }

    public attachRbo(rbo: GlRbo): void {
        this.rbo = rbo;
        this.texture = null;
        this.textureArrayLayer = null;
        this.cubeMapSideTexture = null;
        this.fbo.bind();
        Gl.gl.framebufferRenderbuffer(Gl.gl.FRAMEBUFFER, GlAttachmentSlotResolver.enumToGl(this.slot).getAttachmentPointCode() + this.index, Gl.gl.RENDERBUFFER, rbo.getId())
    }

    public detachAttachment(): void {
        this.rbo = null;
        this.texture = null;
        this.textureArrayLayer = null;
        this.cubeMapSideTexture = null;
        this.fbo.bind();
        Gl.gl.framebufferTexture2D(Gl.gl.FRAMEBUFFER, GlAttachmentSlotResolver.enumToGl(this.slot).getAttachmentPointCode() + this.index, Gl.gl.TEXTURE_2D, null, 0);
    }

    //contains
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

    //draw
    public isDrawBuffer(): boolean {
        for (const drawBuffer of this.fbo.getDrawBuffersIterator()) {
            if (drawBuffer === this) {
                return true;
            }
        }
        return false;
    }

    public isReadBuffer(): boolean {
        return this.fbo.getReadBuffer() === this;
    }

    public setReadBuffer(): void {
        this.fbo.setReadBuffer(this);
    }

}

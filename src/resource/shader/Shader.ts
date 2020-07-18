import { GlShaderStage } from '../../webgl/enum/GlShaderStage';
import { GlShader } from '../../webgl/shader/GlShader';
import { GlShaderProgram } from '../../webgl/shader/GlShaderProgram';
import { Utility } from '../../utility/Utility';
import { Engine } from '../../core/Engine';
import { IResource } from '../IResource';
import { ITexture2D } from '../texture/ITexture2D';
import { GlTextureUnit } from '../../webgl/GlTextureUnit';
import { ITexture2DArray } from '../texture/ITexture2DArray';
import { ICubeMapTexture } from '../texture/ICubeMapTexture';

export abstract class Shader implements IResource {

    private shaderProgram: GlShaderProgram;
    private loaded = false;

    public constructor() {
        this.shaderProgram = new GlShaderProgram();
        this.loadShadersAndCreateProgram();
    }

    public getNativeShaderProgram(): GlShaderProgram {
        return this.shaderProgram;
    }

    protected abstract getVertexShaderPath(): string;

    protected abstract getFragmentShaderPath(): string;

    private async loadShadersAndCreateProgram(): Promise<void> {
        const [vertexSource, fragmentSource] = await Promise.all([
            (await fetch(this.getVertexShaderPath())).text(),
            (await fetch(this.getFragmentShaderPath())).text(),
        ]);
        this.createShaderProgram(vertexSource, fragmentSource);
    }

    protected createShaderProgram(vertexSource: string, fragmentSource: string): void {
        const vertexShader = this.createAndttachShader(GlShaderStage.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.createAndttachShader(GlShaderStage.FRAGMENT_SHADER, fragmentSource);
        this.shaderProgram.link();
        this.validateIfDebug();
        if (!Engine.DEBUG) {
            this.detachAndReleaseShader(vertexShader);
            this.detachAndReleaseShader(fragmentShader);
        }
        this.loaded = true;
    }

    private createAndttachShader(stage: GlShaderStage, source: string): GlShader {
        const shader = new GlShader(stage);
        shader.setSource(source);
        shader.compile();
        if (!shader.isCompileValid()) {
            throw new Error(shader.getCompileInfo());
        }
        this.shaderProgram.attachShader(shader);
        return shader;
    }

    private detachAndReleaseShader(shader: GlShader): void {
        this.shaderProgram.detachShader(shader);
        shader.release();
    }

    private validateIfDebug(): void {
        if (Engine.DEBUG) {
            if (!this.shaderProgram.isLinkValid()) {
                throw new Error(this.shaderProgram.getValidationOrLinkInfo());
            }
            this.shaderProgram.validate();
            if (!this.shaderProgram.isProgramValid()) {
                throw new Error(this.shaderProgram.getValidationOrLinkInfo());
            }
        }
    }

    protected getShaderProgram(): GlShaderProgram {
        return this.shaderProgram;
    }

    public loadTexture2D(texture: ITexture2D, textureUnit: GlTextureUnit): void {
        this.shaderProgram.loadTexture(textureUnit, texture.getNativeTexture(), texture.getNativeSampler());
    }

    public loadTexture2DArray(texture: ITexture2DArray, textureUnit: GlTextureUnit): void {
        this.shaderProgram.loadTexture(textureUnit, texture.getNativeTexture(), texture.getNativeSampler());
    }

    public loadCubeMapTexture(texture: ICubeMapTexture, textureUnit: GlTextureUnit): void {
        this.shaderProgram.loadTexture(textureUnit, texture.getNativeTexture(), texture.getNativeSampler());
    }

    public start(): void {
        this.shaderProgram.start();
        this.connectTextureUnits();
    }

    protected connectTextureUnits(): void { }

    public setUniforms(data?: any): void { }

    public getDataSize(): number {
        return 0;
    }

    public getAllDataSize(): number {
        return this.getDataSize();
    }

    public isUsable(): boolean {
        return Utility.isUsable(this.shaderProgram) && this.loaded;
    }

    public release(): void {
        if (this.isUsable()) {
            this.shaderProgram.release();
            this.shaderProgram = null;
        }
    }

}
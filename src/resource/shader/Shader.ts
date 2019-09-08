import { ShaderStage } from '../../webgl/enum/ShaderStage';
import { GlShader } from '../../webgl/shader/GlShader';
import { GlShaderProgram } from '../../webgl/shader/GlShaderProgram';
import { Utility } from '../../utility/Utility';

export abstract class Shader {

    private shaderProgram: GlShaderProgram;
    private loaded = false;

    public constructor() {
        this.shaderProgram = new GlShaderProgram();
        this.loadShadersAndCreateProgram();
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
        const vertexShader = this.createAndttachShader(ShaderStage.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.createAndttachShader(ShaderStage.FRAGMENT_SHADER, fragmentSource);
        this.linkAndValidate();
        this.detachAndReleaseShader(vertexShader);
        this.detachAndReleaseShader(fragmentShader);
        this.loaded = true;
    }

    private createAndttachShader(stage: ShaderStage, source: string): GlShader {
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

    private linkAndValidate(): void {
        this.shaderProgram.link();
        if (!this.shaderProgram.isLinkValid()) {
            throw new Error(this.shaderProgram.getValidationOrLinkInfo());
        }
        this.shaderProgram.validate();
        if (!this.shaderProgram.isProgramValid()) {
            throw new Error(this.shaderProgram.getValidationOrLinkInfo());
        }
    }

    protected getShaderProgram(): GlShaderProgram {
        return this.shaderProgram;
    }

    public start(): void {
        this.shaderProgram.start();
        this.connectTextureUnits();
    }

    protected connectTextureUnits(): void { }

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
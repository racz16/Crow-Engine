import { ShaderStage } from '../../webgl/enum/ShaderStage';
import { GlShader } from '../../webgl/shader/GlShader';
import { GlShaderProgram } from '../../webgl/shader/GlShaderProgram';

export abstract class Shader {

    private shaderProgram: GlShaderProgram;
    private vertexSource = '';
    private fragmentSource = '';
    private loaded = false;

    public constructor() {
        this.shaderProgram = new GlShaderProgram();
        this.load();
    }

    private async load(): Promise<void> {
        const [vertexText, fragmentText] = await Promise.all([
            (await fetch(this.getVertexShaderPath())).text(),
            (await fetch(this.getFragmentShaderPath())).text(),
        ]);
        this.vertexSource = vertexText;
        this.fragmentSource = fragmentText;
        this.createShader();
    }

    protected abstract getVertexShaderPath(): string;

    protected abstract getFragmentShaderPath(): string;

    protected createShader(): void {
        if (this.vertexSource && this.fragmentSource) {
            this.addShader(ShaderStage.VERTEX_SHADER, this.vertexSource);
            this.addShader(ShaderStage.FRAGMENT_SHADER, this.fragmentSource);
            this.shaderProgram.link();
            if (!this.shaderProgram.isLinkValid()) {
                throw new Error(this.shaderProgram.getValidationOrLinkInfo());
            }
            this.shaderProgram.validate();
            if (!this.shaderProgram.isProgramValid()) {
                throw new Error(this.shaderProgram.getValidationOrLinkInfo());
            }
            this.loaded = true;
        }
    }

    protected getShaderProgram(): GlShaderProgram {
        return this.shaderProgram;
    }

    public start(): void {
        this.shaderProgram.start();
        this.connect();
    }

    protected connect(): void {

    }

    private addShader(stage: ShaderStage, source: string) {
        const shader = new GlShader(stage);
        shader.setSource(source);
        shader.compile();
        if (!shader.isCompileValid()) {
            throw new Error(shader.getCompileInfo());
        }
        this.shaderProgram.attachShader(shader);
        shader.release();
    }

    public isUsable(): boolean {
        return this.loaded && this.shaderProgram.isUsable();
    }

    public release(): void {
        this.shaderProgram.release();
    }
}
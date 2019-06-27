import { ShaderStage } from "../../webgl/enum/ShaderStage";
import { GlShader } from "../../webgl/shader/GlShader";
import { GlShaderProgram } from "../../webgl/shader/GlShaderProgram";
import { Utility } from "../../utility/Utility";

export abstract class Shader {

    private shaderProgram: GlShaderProgram;
    private vertexSource = "";
    private fragmentSource = "";

    public constructor() {
        this.shaderProgram = new GlShaderProgram();
        Utility.loadResource(this.getVertexShaderPath(), (source: string) => {
            this.vertexSource = source;
            this.createShader();
        });
        Utility.loadResource(this.getFragmentShaderPath(), (source: string) => {
            this.fragmentSource = source;
            this.createShader();
        });
    }

    protected abstract getVertexShaderPath(): string;

    protected abstract getFragmentShaderPath(): string;

    protected createShader(): void {
        if (this.vertexSource && this.fragmentSource) {
            this.addShader(ShaderStage.VERTEX_SHADER, this.vertexSource);
            this.addShader(ShaderStage.FRAGMENT_SHADER, this.fragmentSource);
            this.shaderProgram.link();
            this.shaderProgram.validate();
            if (!this.shaderProgram.isLinkValid() || !this.shaderProgram.isProgramValid()) {
                throw new Error(this.shaderProgram.getLinkErrorMessage());
            }
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
            throw new Error(shader.getCompileErrorMessage());
        }
        this.shaderProgram.attachShader(shader);
        shader.release();
    }

    public isUsable(): boolean {
        return this.shaderProgram.isUsable();
    }

    public release(): void {
        this.shaderProgram.release();
    }
}
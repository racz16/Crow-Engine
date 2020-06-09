import { GlObject } from '../GlObject';
import { Gl } from '../Gl';
import { GlShaderStage, GlShaderStageResolver } from '../enum/GlShaderStage';
import { GlConstants } from '../GlConstants';

export class GlShader extends GlObject {

    private stage: GlShaderStage;

    public constructor(stage: GlShaderStage) {
        super();
        this.setStage(stage);
        this.setId(this.createId());
    }

    private createId(): number {
        const glStage = GlShaderStageResolver.enumToGl(this.stage);
        return Gl.gl.createShader(glStage) as number;
    }

    public getShaderSource(): string {
        return Gl.gl.getShaderSource(this.getId());
    }

    public getTranslatedShaderSource(): string {
        const debugExtension = GlConstants.DEBUG_SHADERS_EXTENSION;
        return debugExtension.getTranslatedShaderSource(this.getId());
    }

    public getStage(): GlShaderStage {
        return this.stage;
    }

    private setStage(stage: GlShaderStage): void {
        this.stage = stage;
    }

    public setSource(source: string): void {
        Gl.gl.shaderSource(this.getId(), source);
    }

    public compile(): void {
        Gl.gl.compileShader(this.getId());
    }

    public isCompileValid(): boolean {
        return Gl.gl.getShaderParameter(this.getId(), Gl.gl.COMPILE_STATUS);
    }

    public getCompileInfo(): string {
        return Gl.gl.getShaderInfoLog(this.getId());
    }

    public release(): void {
        Gl.gl.deleteShader(this.getId());
        this.setId(GlObject.INVALID_ID);
    }

}
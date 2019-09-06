import { GlObject } from '../GlObject';
import { Gl } from '../Gl';
import { ShaderStage, ShaderStageResolver } from '../enum/ShaderStage';
import { GlConstants } from '../GlConstants';

export class GlShader extends GlObject {

    private stage: ShaderStage;

    public constructor(stage: ShaderStage) {
        super();
        this.setStage(stage);
        this.setId(this.createId());
    }

    private createId(): number {
        const glStage = ShaderStageResolver.enumToGl(this.stage);
        return Gl.gl.createShader(glStage) as number;
    }

    public getTranslatedShaderSource(): string {
        const debugExtension = GlConstants.DEBUG_SHADERS_EXTENSION;
        if (debugExtension) {
            return debugExtension.getTranslatedShaderSource(this.getId());
        } else {
            return null;
        }
    }

    public getStage(): ShaderStage {
        return this.stage;
    }

    private setStage(stage: ShaderStage): void {
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
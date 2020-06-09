import { GlObject } from '../GlObject';
import { Gl } from '../Gl';
import { vec2, vec3, vec4, mat4, mat3 } from 'gl-matrix';
import { GlShader } from './GlShader';
import { GlBindingPoint } from '../GlBindingPoint';
import { GlShaderStage } from '../enum/GlShaderStage';
import { GlTextureUnit } from '../GlTextureUnit';
import { GlTexture } from '../texture/GlTexture';
import { GlSampler } from '../GlSampler';

export class GlShaderProgram extends GlObject {

    private uniforms = new Map<string, number>();
    private uniformBlocks = new Map<string, number>();
    private attributes = new Map<string, number>();
    private vertexShader: GlShader;
    private fragmentShader: GlShader;

    public constructor() {
        super();
        this.setId(this.createId());
    }

    private createId(): number {
        return Gl.gl.createProgram() as number;
    }

    public link(): void {
        Gl.gl.linkProgram(this.getId());
        this.connectUniforms();
        this.connectUniformBlocks();
        this.connectAttributes();
    }

    public validate(): void {
        Gl.gl.validateProgram(this.getId());
    }

    public isLinkValid(): boolean {
        return Gl.gl.getProgramParameter(this.getId(), Gl.gl.LINK_STATUS);
    }

    public isProgramValid(): boolean {
        return Gl.gl.getProgramParameter(this.getId(), Gl.gl.VALIDATE_STATUS);
    }

    public getValidationOrLinkInfo(): string {
        return Gl.gl.getProgramInfoLog(this.getId());
    }

    //connecting
    private connectUniforms(): void {
        this.uniforms.clear();
        for (let i = 0; i < Gl.gl.getProgramParameter(this.getId(), Gl.gl.ACTIVE_UNIFORMS); i++) {
            const info = Gl.gl.getActiveUniform(this.getId(), i);
            if (info.size > 1) {
                this.connectUniformArray(info);
            } else {
                this.connectUniform(info.name);
            }
        }
    }

    private connectUniformArray(info: WebGLActiveInfo): void {
        for (let i = 0; i < info.size; i++) {
            const name = info.name.substring(0, info.name.length - 3) + `[${i}]`;
            this.connectUniform(name);
        }
    }

    private connectUniform(name: string): void {
        const location = Gl.gl.getUniformLocation(this.getId(), name) as number;
        this.uniforms.set(name, location);
    }

    private connectUniformBlocks(): void {
        this.uniformBlocks.clear();
        for (let i = 0; i < Gl.gl.getProgramParameter(this.getId(), Gl.gl.ACTIVE_UNIFORM_BLOCKS); i++) {
            const name = Gl.gl.getActiveUniformBlockName(this.getId(), i);
            const location = Gl.gl.getUniformBlockIndex(this.getId(), name) as number;
            this.uniformBlocks.set(name, location);
        }
    }

    private connectAttributes(): void {
        this.attributes.clear();
        for (let i = 0; i < Gl.gl.getProgramParameter(this.getId(), Gl.gl.ACTIVE_ATTRIBUTES); i++) {
            const info = Gl.gl.getActiveAttrib(this.getId(), i);
            const location = Gl.gl.getAttribLocation(this.getId(), info.name) as number;
            this.attributes.set(info.name, location);
        }
    }

    public getUniformLocation(uniformName: string): number {
        return this.uniforms.has(uniformName) ? this.uniforms.get(uniformName) : -1;
    }

    public getAttributeLocation(attributeName: string): number {
        return this.attributes.has(attributeName) ? this.attributes.get(attributeName) : -1;
    }

    public getUniformBlockIndex(uniformBlockName: string): number {
        return this.uniformBlocks.has(uniformBlockName) ? this.uniformBlocks.get(uniformBlockName) : -1;
    }

    public getUniformBlocksIterator(): IterableIterator<[string, number]> {
        return this.uniformBlocks.entries();
    }

    public getUniformsIterator(): IterableIterator<[string, number]> {
        return this.uniforms.entries();
    }

    public getAttributesIterator(): IterableIterator<[string, number]> {
        return this.attributes.entries();
    }

    //loading uniforms
    public loadFloat(uniform: string, value: number): void {
        Gl.gl.uniform1f(this.getUniformLocation(uniform), value);
    }

    public loadInt(uniform: string, value: number): void {
        Gl.gl.uniform1i(this.getUniformLocation(uniform), value);
    }

    public loadBoolean(uniform: string, value: boolean): void {
        Gl.gl.uniform1f(this.getUniformLocation(uniform), value ? 1 : 0);
    }

    public loadVector2(uniform: string, vector: vec2): void {
        Gl.gl.uniform2fv(this.getUniformLocation(uniform), vector);
    }

    public loadVector3(uniform: string, vector: vec3): void {
        Gl.gl.uniform3fv(this.getUniformLocation(uniform), vector);
    }

    public loadVector4(uniform: string, vector: vec4): void {
        Gl.gl.uniform4fv(this.getUniformLocation(uniform), vector);
    }

    public loadMatrix3(uniform: string, matrix: mat3, transpose = false): void {
        Gl.gl.uniformMatrix3fv(this.getUniformLocation(uniform), transpose, matrix);
    }

    public loadMatrix4(uniform: string, matrix: mat4, transpose = false): void {
        Gl.gl.uniformMatrix4fv(this.getUniformLocation(uniform), transpose, matrix);
    }

    public connectTextureUnit(uniform: string, textureUnit: GlTextureUnit): void {
        Gl.gl.uniform1i(this.getUniformLocation(uniform), textureUnit.getIndex());
    }

    public loadTexture(textureUnit: GlTextureUnit, texture: GlTexture, sampler: GlSampler = null): void {
        texture.bindToTextureUnit(textureUnit);
        if (sampler) {
            sampler.bindToTextureUnit(textureUnit);
        } else {
            GlSampler.unbindFromTextureUnit(textureUnit);
        }
    }

    //misc
    public bindUniformBlockToBindingPoint(bindingPoint: GlBindingPoint): void {
        const ubi = this.getUniformBlockIndex(bindingPoint.getName());
        Gl.gl.uniformBlockBinding(this.getId(), ubi, bindingPoint.getBindingPoint());
    }

    public start(): void {
        Gl.gl.useProgram(this.getId());
    }

    public attachShader(shader: GlShader): void {
        Gl.gl.attachShader(this.getId(), shader.getId());
        this.setShaderTo(shader, shader.getStage());
    }

    public detachShader(shader: GlShader): void {
        Gl.gl.detachShader(this.getId(), shader.getId());
        this.setShaderTo(null, shader.getStage());
    }

    private setShaderTo(shader: GlShader, stage: GlShaderStage): void {
        if (stage === GlShaderStage.VERTEX_SHADER) {
            this.vertexShader = shader;
        } else {
            this.fragmentShader = shader;
        }
    }

    public getVertexShader(): GlShader {
        return this.vertexShader;
    }

    public getFragmentShader(): GlShader {
        return this.fragmentShader;
    }

    public release(): void {
        Gl.gl.deleteProgram(this.getId());
        this.setId(GlObject.INVALID_ID);
    }

}

import { GlObject } from '../GlObject';
import { Gl } from '../Gl';
import { vec2, vec3, vec4, mat4, mat3 } from 'gl-matrix';
import { GlShader } from './GlShader';
import { BindingPoint } from '../../rendering/BindingPoint';

export class GlShaderProgram extends GlObject {

    private uniforms = new Map<string, number>();
    private uniformBlocks = new Map<string, number>();
    private attributes = new Map<string, number>();

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

    public getLinkErrorMessage(): string {
        return Gl.gl.getProgramInfoLog(this.getId());
    }

    private connectUniforms(): void {
        this.uniforms.clear();
        for (let i = 0; i < Gl.gl.getProgramParameter(this.getId(), Gl.gl.ACTIVE_UNIFORMS); i++) {
            const name = Gl.gl.getActiveUniform(this.getId(), i).name;
            const location = Gl.gl.getUniformLocation(this.getId(), name) as number;
            this.uniforms.set(name, location);
        }
    }

    public connectUniformBlocks(): void {
        for (let i = 0; i < Gl.gl.getProgramParameter(this.getId(), Gl.gl.ACTIVE_UNIFORM_BLOCKS); i++) {
            const name = Gl.gl.getActiveUniformBlockName(this.getId(), i);
            const location = Gl.gl.getUniformBlockIndex(this.getId(), name) as number;
            this.uniformBlocks.set(name, location);
        }
    }

    private connectAttributes(): void {
        this.attributes.clear();
        for (let i = 0; i < Gl.gl.getProgramParameter(this.getId(), Gl.gl.ACTIVE_ATTRIBUTES); i++) {
            const name = Gl.gl.getActiveAttrib(this.getId(), i).name;
            const location = Gl.gl.getAttribLocation(this.getId(), name) as number;
            this.attributes.set(name, location);
        }
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

    public bindUniformBlock(uniformBlock: string, bindingPoint: number): void {
        Gl.gl.uniformBlockBinding(this.getId(), Gl.gl.getUniformBlockIndex(this.getId(), uniformBlock), bindingPoint);
    }

    public bindUniformBlockToBindingPoint(bindingPoint: BindingPoint): void {
        this.bindUniformBlock(bindingPoint.name, bindingPoint.bindingPoint);
    }

    public loadFloat(uniform: string, value: number): void {
        Gl.gl.uniform1f(this.getUniformLocation(uniform), value);
    }

    public loadInt(uniform: string, value: number): void {
        Gl.gl.uniform1i(this.getUniformLocation(uniform), value);
    }

    public loadVector2(uniform: string, vector: vec2): void {
        Gl.gl.uniform2f(this.getUniformLocation(uniform), vector[0], vector[1]);
    }

    public loadVector3(uniform: string, vector: vec3): void {
        Gl.gl.uniform3f(this.getUniformLocation(uniform), vector[0], vector[1], vector[2]);
    }

    public loadVector4(uniform: string, vector: vec4): void {
        Gl.gl.uniform4f(this.getUniformLocation(uniform), vector[0], vector[1], vector[2], vector[3]);
    }

    public loadBoolean(uniform: string, value: boolean): void {
        Gl.gl.uniform1f(this.getUniformLocation(uniform), value ? 1 : 0);
    }

    public loadMatrix4(uniform: string, matrix: mat4, transpose = false): void {
        Gl.gl.uniformMatrix4fv(this.getUniformLocation(uniform), transpose, matrix);
    }

    public loadMatrix3(uniform: string, matrix: mat3, transpose = false): void {
        Gl.gl.uniformMatrix3fv(this.getUniformLocation(uniform), transpose, matrix);
    }

    public connectTextureUnit(uniform: string, textureUnit: number): void {
        Gl.gl.uniform1i(this.getUniformLocation(uniform), textureUnit);
    }

    public getUniformLocation(uniformName: string): number {
        const location = this.uniforms.get(uniformName);
        return location ? location : -1;
    }

    public getAttributeLocation(attributeName: string): number {
        const location = this.attributes.get(attributeName);
        return location ? location : -1;
    }

    public getUniformBlockLocation(uniformBlockName: string): number {
        const location = this.uniformBlocks.get(uniformBlockName);
        return location ? location : -1;
    }

    public start(): void {
        Gl.gl.useProgram(this.getId());
    }
    public attachShader(shader: GlShader): void {
        Gl.gl.attachShader(this.getId(), shader.getId());
    }

    public detachShader(shader: GlShader): void {
        Gl.gl.detachShader(this.getId(), shader.getId());
    }

    public release(): void {
        Gl.gl.deleteProgram(this.getId());
        this.setId(-1);
    }

}

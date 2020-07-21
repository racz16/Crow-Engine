import { Gl } from './Gl';

export class GlTextureUnit {

    private readonly index: number

    public constructor(index: number) {
        this.index = index;
    }

    public getId(): number {
        return Gl.gl.TEXTURE0 + this.index;
    }

    public getIndex(): number {
        return this.index;
    }

}
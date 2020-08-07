import { GlObject } from '../GlObject';
import { Gl } from '../Gl';

export abstract class GlQuery<T> extends GlObject {

    private alreadyUsed = false;

    public constructor() {
        super();
        this.setId(this.createId());
    }

    protected createId(): number {
        return Gl.gl.createQuery() as number;
    }

    public abstract getTarget(): number;

    protected isAlreadyUsed(): boolean {
        return this.alreadyUsed;
    }

    protected setAlreadyUsed(): void {
        this.alreadyUsed = true;
    }

    public isResultAvailable(): boolean {
        return this.isAlreadyUsed() && Gl.gl.getQueryParameter(this.getId(), Gl.gl.QUERY_RESULT_AVAILABLE);
    }

    public getResult(): T {
        return Gl.gl.getQueryParameter(this.getId(), Gl.gl.QUERY_RESULT);
    }

    public release(): void {
        Gl.gl.deleteQuery(this.getId());
        this.setId(GlObject.INVALID_ID);
    }

}
import { GlQuery } from './GlQuery';
import { GlConstants } from '../GlConstants';
import { Gl } from '../Gl';

export class GlTimestampQuery extends GlQuery<number> {

    public getTarget(): number {
        return GlConstants.DISJOINT_TIMER_QUERY_EXTENSION.TIMESTAMP_EXT;
    }

    public isResultAvailable(): boolean {
        const available = super.isResultAvailable();
        const disjoint = Gl.gl.getParameter(GlConstants.DISJOINT_TIMER_QUERY_EXTENSION.GPU_DISJOINT_EXT);
        return available && !disjoint;
    }

    public queryTimestamp(): void {
        const ext = GlConstants.DISJOINT_TIMER_QUERY_EXTENSION;
        ext.queryCounterEXT(this.getId(), ext.TIMESTAMP_EXT);
        this.setAlreadyUsed();
    }

}
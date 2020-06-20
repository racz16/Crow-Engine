
import { GlScopedQuery } from "./GlScopedQuery";
import { GlConstants } from "../GlConstants";
import { Gl } from "../Gl";

export class GlTimeElapsedQuery extends GlScopedQuery {

    public getTarget(): number {
        return GlConstants.DISJOINT_TIMER_QUERY_EXTENSION.TIME_ELAPSED_EXT;
    }

    public isResultAvailable(): boolean {
        const available = super.isResultAvailable();
        const disjoint = Gl.gl.getParameter(GlConstants.DISJOINT_TIMER_QUERY_EXTENSION.GPU_DISJOINT_EXT);
        return available && !disjoint;
    }

}
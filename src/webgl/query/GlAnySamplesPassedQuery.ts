import { GlScopedQuery } from "./GlScopedQuery";
import { Gl } from "../Gl";

export class GlAnySamplesPassedQuery extends GlScopedQuery {

    public getTarget(): number {
        return Gl.gl.ANY_SAMPLES_PASSED;
    }

}
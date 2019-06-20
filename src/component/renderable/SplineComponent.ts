import { RenderableComponent } from "./RenderableComponent";
import { ISpline } from "../../resource/spline/ISpline";
import { Material } from "../../material/Material";

export class SplineComponent extends RenderableComponent<ISpline>{

    public constructor(spline: ISpline, material: Material) {
        super(spline, material);
    }

    public isLoop(): boolean {
        return this.getRenderable().isLoop();
    }

    public getFaceCount(): number {
        return 0;
    }

}

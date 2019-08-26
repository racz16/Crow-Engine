import { RenderableComponent } from './RenderableComponent';
import { ISpline } from '../../resource/spline/ISpline';

export class SplineComponent extends RenderableComponent<ISpline>{

    public isLoop(): boolean {
        return this.getRenderable().isLoop();
    }

    public getFaceCount(): number {
        return 0;
    }

}

import { IMesh } from '../../resource/mesh/IMesh';
import { RenderableComponent } from './RenderableComponent';

export class MeshComponent extends RenderableComponent<IMesh>{

    public getFaceCount(): number {
        return this.getRenderable().getFaceCount();
    }

}

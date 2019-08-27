import { IRenderable } from '../resource/IRenderable';
import { Utility } from '../utility/Utility';
import { IRenderableComponent } from '../component/renderable/IRenderableComponent';

export class RenderableContainer {

    private renderables = new Array<IRenderableComponent<IRenderable>>();

    public getRenderableComponent(index: number): IRenderableComponent<IRenderable> {
        return this.renderables[index];
    }

    public getRenderableComponentCount(): number {
        return this.renderables.length;
    }

    public getRenderableComponentsIterator(): IterableIterator<IRenderableComponent<IRenderable>> {
        return this.renderables.values();
    }

    public add(renderable: IRenderableComponent<IRenderable>): void {
        if (!this.renderables.includes(renderable) && renderable.getGameObject()) {
            this.renderables.push(renderable);
        }
    }

    public remove(renderable: IRenderableComponent<IRenderable>): void {
        const index = this.renderables.indexOf(renderable);
        if (index !== -1 && !renderable.getGameObject()) {
            Utility.removeElement(this.renderables, index);
        }
    }

}
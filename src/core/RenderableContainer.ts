import { IRenderable } from "../resource/IRenderable";
import { Utility } from "../utility/Utility";
import { IRenderableComponent } from "../component/renderable/IRenderableComponent";

export class RenderableContainer {

    private renderables = new Array<IRenderableComponent<IRenderable>>();

    public getRenderableComponent(index: number): IRenderableComponent<IRenderable> {
        return this.renderables[index];
    }

    public getRenderableComponentCount(): number {
        return this.renderables.length;
    }

    public getRenderableComponentIterator(): IterableIterator<IRenderableComponent<IRenderable>> {
        return this.renderables.values();
    }

    private add(renderable: IRenderableComponent<IRenderable>): void {
        if (!this.renderables.includes(renderable)) {
            this.renderables.push(renderable);
        }
    }

    private remove(renderable: IRenderableComponent<IRenderable>): void {
        const index = this.renderables.indexOf(renderable);
        if (index !== -1) {
            Utility.removeElement(this.renderables, index);
        }
    }

}
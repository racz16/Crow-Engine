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

    public private_add(renderable: IRenderableComponent<IRenderable>): void {
        if (Utility.contains(this.renderables, renderable)) {
            return;
        }
        this.renderables.push(renderable);
    }

    public private_remove(renderable: IRenderableComponent<IRenderable>): void {
        const index = this.renderables.indexOf(renderable);
        if (index === -1) {
            return;
        }
        Utility.removeElement(this.renderables, index);
    }
}
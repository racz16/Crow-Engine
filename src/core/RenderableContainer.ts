import { RenderableComponent } from "../component/renderable/RenderableComponent";
import { IRenderable } from "../resource/IRenderable";
import { Utility } from "../utility/Utility";

export class RenderableContainer {
    private renderables = new Array<RenderableComponent<IRenderable>>();

    public getRenderableComponent(index: number): RenderableComponent<IRenderable> {
        return this.renderables[index];
    }

    public getRenderableComponentCount(): number {
        return this.renderables.length;
    }

    public getRenderableComponentIterator(): IterableIterator<RenderableComponent<IRenderable>> {
        return this.renderables.values();
    }

    public private_add(renderable: RenderableComponent<IRenderable>): void {
        if (Utility.contains(this.renderables, renderable)) {
            return;
        }
        this.renderables.push(renderable);
    }

    public private_remove(renderable: RenderableComponent<IRenderable>): void {
        const index = this.renderables.indexOf(renderable);
        if (index === -1) {
            return;
        }
        Utility.removeElement(this.renderables, index);
    }
}
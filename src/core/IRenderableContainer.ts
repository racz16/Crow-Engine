import { IRenderableComponent } from "../component/renderable/IRenderableComponent";
import { IRenderable } from "../resource/IRenderable";

export interface IRenderableContainer {

    add(renderable: IRenderableComponent<IRenderable>): void;

    getCount(): number;

    get(index: number): IRenderableComponent<IRenderable>;

    getIterator(): IterableIterator<IRenderableComponent<IRenderable>>;

    remove(renderable: IRenderableComponent<IRenderable>): void;

}
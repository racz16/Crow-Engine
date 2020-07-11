import { IRenderable } from '../resource/IRenderable';
import { Utility } from '../utility/Utility';
import { IRenderableComponent } from '../component/renderable/IRenderableComponent';
import { IRenderableContainer } from './IRenderableContainer';

export class RenderableContainer implements IRenderableContainer {

    private renderables = new Array<IRenderableComponent<IRenderable>>();

    public add(renderable: IRenderableComponent<IRenderable>): void {
        if (!this.renderables.includes(renderable) && renderable.getGameObject()) {
            this.renderables.push(renderable);
        }
    }

    public getCount(): number {
        return this.renderables.length;
    }

    public get(index: number): IRenderableComponent<IRenderable> {
        return this.renderables[index];
    }

    public getIterator(): IterableIterator<IRenderableComponent<IRenderable>> {
        return this.renderables.values();
    }

    public remove(renderable: IRenderableComponent<IRenderable>): void {
        const index = this.renderables.indexOf(renderable);
        if (index !== -1 && !renderable.getGameObject()) {
            Utility.removeElementByIndex(this.renderables, index);
        }
    }

}
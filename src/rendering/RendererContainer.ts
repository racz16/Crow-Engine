import { Renderer } from './Renderer';
import { Utility } from '../utility/Utility';

export class RendererContainer<T extends Renderer>{

    private renderers = new Array<T>();

    public addToTheEnd(renderer: T): void {
        if (!this.contains(renderer)) {
            this.renderers.push(renderer);
            (renderer as any).addedToThePipeline();
        }
    }

    public addToIndex(renderer: T, index: number): void {
        if (!this.contains(renderer)) {
            Utility.addElement(this.renderers, index, renderer);
            (renderer as any).addedToThePipeline();
        }
    }

    public contains(renderer: T): boolean {
        return this.renderers.includes(renderer);
    }

    public get(index: number): T {
        return this.renderers[index];
    }

    public getCount(): number {
        return this.renderers.length;
    }

    public getIterator(): IterableIterator<T> {
        return this.renderers.values();
    }

    public remove(renderer: T): void {
        const index = this.renderers.indexOf(renderer);
        if (index !== -1) {
            Utility.removeElementByIndex(this.renderers, index);
            (renderer as any).removedFromThePipeline();
        }
    }

}
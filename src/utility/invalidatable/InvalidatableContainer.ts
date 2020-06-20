import { Utility } from '../Utility';
import { IInvalidatable } from './IInvalidatable';

export class InvalidatableContainer {

    protected invalidatables = new Array<IInvalidatable>();
    protected readonly container: any;
    private invalidatable = true;

    public constructor(container: any) {
        this.container = container;
    }

    public add(invalidatable: IInvalidatable): void {
        if (!invalidatable || invalidatable == this.container) {
            throw new Error();
        }
        if (!this.contains(invalidatable)) {
            this.invalidatables.push(invalidatable);
        }
    }

    public contains(invalidatable: IInvalidatable): boolean {
        return this.invalidatables.includes(invalidatable);;
    }

    public remove(invalidatable: IInvalidatable): void {
        const index = this.invalidatables.indexOf(invalidatable);
        if (index !== -1) {
            Utility.removeElement(this.invalidatables, index);
        }
    }

    public getCount(): number {
        return this.invalidatables.length;
    }

    public get(index: number): IInvalidatable {
        return this.invalidatables[index];
    }

    public getIterator(): IterableIterator<IInvalidatable> {
        return this.invalidatables.values();
    }

    public invalidate(): void {
        if (this.invalidatable) {
            this.invalidatable = false;
            this.invalidateAll();
            this.invalidatable = true;
        }
    }

    private invalidateAll(): void {
        for (const invalidatable of this.invalidatables) {
            invalidatable.invalidate(this.container);
        }
    }

}
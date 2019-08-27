import { Utility } from '../Utility';
import { IInvalidatable } from './IInvalidatable';

export class InvalidatableContainer {

    private invalidatables = new Array<IInvalidatable>();
    private readonly container: object;
    private invalidatable = true;

    public constructor(container: object) {
        this.container = container;
    }

    public addInvalidatable(invalidatable: IInvalidatable): void {
        if (!invalidatable || invalidatable === this.container) {
            throw new Error();
        }
        this.addInvalidatableUnsafe(invalidatable);
    }

    private addInvalidatableUnsafe(invalidatable: IInvalidatable): void {
        if (!this.containsInvalidatable(invalidatable)) {
            this.invalidatables.push(invalidatable);
        }
    }

    public containsInvalidatable(invalidatable: IInvalidatable): boolean {
        return this.invalidatables.includes(invalidatable);;
    }

    public removeInvalidatable(invalidatable: IInvalidatable): void {
        const index = this.invalidatables.indexOf(invalidatable);
        if (index !== -1) {
            Utility.removeElement(this.invalidatables, index);
        }
    }

    public getInvalidatableCount(): number {
        return this.invalidatables.length;
    }

    public getInvalidatablesIterator(): IterableIterator<IInvalidatable> {
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
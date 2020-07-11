import { ParameterKey } from './ParameterKey';
import { IInvalidatable } from '../invalidatable/IInvalidatable';
import { Utility } from '../Utility';
import { InvalidatableContainer } from '../invalidatable/InvalidatableContainer';

export class ParameterContainer {

    protected parameters = new Map<string, any>();
    protected invalidatables = new Map<string, Array<IInvalidatable>>();

    public get<T>(key: ParameterKey<T>): T {
        return this.parameters.get(key.getKey());
    }

    public set<T>(key: ParameterKey<T>, parameter: T): void {
        const oldParameter = this.get(key);
        this.parameters.set(key.getKey(), parameter);
        const invalidatables = this.invalidatables.get(key.getKey());
        this.removeInvalidatablesFromParameter(oldParameter, true, invalidatables);
        this.addInvalidatablesToParameter(parameter, true, invalidatables);
        this.invalidateInvalidatables(invalidatables);
    }

    protected removeInvalidatablesFromParameter(parameter: any, invalidate: boolean, invalidatables: Array<IInvalidatable>): void {
        const ic = this.getInvalidatableContainer(parameter);
        if (ic) {
            if (invalidate) {
                parameter.invalidate();
            }
            if (invalidatables) {
                for (const invalidatable of invalidatables) {
                    ic.remove(invalidatable);
                }
            }
        }
    }

    protected addInvalidatablesToParameter(parameter: any, invalidate: boolean, invalidatables: Array<IInvalidatable>): void {
        const ic = this.getInvalidatableContainer(parameter);
        if (ic) {
            if (invalidate) {
                parameter.invalidate(this);
            }
            if (invalidatables) {
                for (const invalidatable of invalidatables) {
                    ic.add(invalidatable);
                }
            }
        }
    }

    private getInvalidatableContainer(parameter: any): InvalidatableContainer {
        if (!parameter || typeof parameter.getInvalidatables !== 'function') {
            return null;
        }
        return parameter.getInvalidatables();
    }

    protected invalidateInvalidatables(invalidatables: Array<IInvalidatable>) {
        if (invalidatables) {
            for (const invalidatable of invalidatables) {
                invalidatable.invalidate();
            }
        }
    }

    public addInvalidatable<T>(key: ParameterKey<T>, invalidatable: IInvalidatable): void {
        if (!key || !invalidatable) {
            throw Error();
        }
        this.addInvalidatableUnsafe(key, invalidatable);
    }

    protected addInvalidatableUnsafe<T>(key: ParameterKey<T>, invalidatable: IInvalidatable): void {
        let invalidatables = this.invalidatables.get(key.getKey());
        if (!invalidatables) {
            invalidatables = new Array<IInvalidatable>();
            this.invalidatables.set(key.getKey(), invalidatables);
        }
        if (!invalidatables.includes(invalidatable)) {
            const parameter = this.get(key);
            this.addInvalidatablesToParameter(parameter, false, [invalidatable]);
            invalidatables.push(invalidatable);
        }
    }

    public removeInvalidatable<T>(key: ParameterKey<T>, invalidatable: IInvalidatable): void {
        if (!key || !invalidatable) {
            throw Error();
        }
        this.removeInvalidatableUnsafe(key, invalidatable);
    }

    protected removeInvalidatableUnsafe<T>(key: ParameterKey<T>, invalidatable: IInvalidatable): void {
        const invalidatables = this.invalidatables.get(key.getKey());
        if (invalidatables && invalidatables.includes(invalidatable)) {
            const parameter = this.get(key);
            this.removeInvalidatablesFromParameter(parameter, false, [invalidatable]);
            Utility.removeElement(invalidatables, invalidatable);
            if (invalidatables.length === 0) {
                this.invalidatables.delete(key.getKey());
            }
        }
    }

    public containsInvalidatable<T>(key: ParameterKey<T>, invalidatable: IInvalidatable): boolean {
        const invalidatables = this.invalidatables.get(key.getKey());
        return invalidatables ? invalidatables.includes(invalidatable) : false;
    }

    public getInvalidatableIterator<T>(key: ParameterKey<T>): IterableIterator<IInvalidatable> {
        const invalidatables = this.invalidatables.get(key.getKey());
        return invalidatables ? invalidatables.values() : [].values();
    }

    public getInvalidatableCount<T>(key: ParameterKey<T>): number {
        const invalidatables = this.invalidatables.get(key.getKey());
        return invalidatables ? invalidatables.length : 0;
    }

}
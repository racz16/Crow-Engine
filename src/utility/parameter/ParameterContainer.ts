import { ParameterKey } from './ParameterKey';
import { IInvalidatable } from '../invalidatable/IInvalidatable';
import { Utility } from '../Utility';

export class ParameterContainer {

    private parameters = new Map<string, any>();
    private invalidatables = new Map<string, Array<IInvalidatable>>();

    public get<T>(key: ParameterKey<T>): T {
        return this.parameters.get(key.getKey());
    }

    public set<T>(key: ParameterKey<T>, parameter: T): void {
        const oldParameter = this.get(key);
        this.parameters.set(key.getKey(), parameter);
        const invalidatables = this.invalidatables.get(key.getKey());
        this.removeInvalidatablesFromParameter(oldParameter, true, invalidatables);
        this.addInvalidatablesToParameter(parameter, true, invalidatables);
        this.invalidateInvalidatables(key);
    }

    private removeInvalidatablesFromParameter(parameter: any, invalidate: boolean, invalidatables: Array<IInvalidatable>): void {
        if (parameter && typeof parameter.getParameterInvalidatables === 'function') {
            if (invalidate) {
                parameter.invalidate(this);
            }
            if (invalidatables) {
                for (const invalidatable of invalidatables) {
                    parameter.getParameterInvalidatables().removeInvalidatable(invalidatable);
                }
            }
        }
    }

    private addInvalidatablesToParameter(parameter: any, invalidate: boolean, invalidatables: Array<IInvalidatable>): void {
        if (parameter && typeof parameter.getParameterInvalidatables === 'function') {
            if (invalidate) {
                parameter.invalidate(this);
            }
            if (invalidatables) {
                for (const invalidatable of invalidatables) {
                    parameter.getParameterInvalidatables().addInvalidatable(invalidatable);
                }
            }
        }
    }

    private invalidateInvalidatables<T>(key: ParameterKey<T>) {
        const invalidatablesArray = this.invalidatables.get(key.getKey());
        if (invalidatablesArray) {
            for (const invalidatable of invalidatablesArray) {
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

    private addInvalidatableUnsafe<T>(key: ParameterKey<T>, invalidatable: IInvalidatable): void {
        let invalidatableArray = this.invalidatables.get(key.getKey());
        if (invalidatableArray == null) {
            invalidatableArray = new Array<IInvalidatable>();
            this.invalidatables.set(key.getKey(), invalidatableArray);
        }
        if (!invalidatableArray.includes(invalidatable)) {
            const parameter = this.get(key);
            this.addInvalidatablesToParameter(parameter, false, [invalidatable]);
            invalidatableArray.push(invalidatable);
        }
    }

    public removeInvalidatable<T>(key: ParameterKey<T>, invalidatable: IInvalidatable): void {
        if (!key || !invalidatable) {
            throw Error();
        }
        this.removeInvalidatableUnsafe(key, invalidatable);
    }

    private removeInvalidatableUnsafe<T>(key: ParameterKey<T>, invalidatable: IInvalidatable): void {
        const invalidatableArray = this.invalidatables.get(key.getKey());
        if (invalidatableArray && invalidatableArray.includes(invalidatable)) {
            const parameter = this.get(key);
            this.removeInvalidatablesFromParameter(parameter, false, [invalidatable]);
            const index = invalidatableArray.indexOf(invalidatable);
            Utility.removeElement(invalidatableArray, index);
            if (invalidatableArray.length === 0) {
                this.invalidatables.delete(key.getKey());
            }
        }
    }

}
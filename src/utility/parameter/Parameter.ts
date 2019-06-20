
export class Parameter<T>{

    private value: T;

    public constructor(value: T) {
        this.setValue(value);
    }

    public getValue(): T {
        return this.value;
    }

    protected setValue(value: T): void {
        if (value == null) {
            throw new Error();
        }
        this.value = value;
    }

    public private_addedToParameters(removed: Parameter<T>): void {
    }

    public private_removedFromParameters(added: Parameter<T>): void {
    }

}

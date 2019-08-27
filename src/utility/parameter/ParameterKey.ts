export class ParameterKey<T>{

    private returnType: new (..._) => T;
    private key: string;

    public constructor(returnType: new (..._) => T, key: string) {
        if (!returnType || !key) {
            throw new Error();
        }
        this.returnType = returnType;
        this.key = key;
    }

    public getReturnType(): new (..._) => T {
        return this.returnType;
    }

    public getKey(): string {
        return this.key;
    }

}

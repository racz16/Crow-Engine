
export class ParameterKey<T>{

    private returnType: new () => T;
    private key: string;

    public constructor(returnType: new () => T, key: string) {
        if (returnType == null || key == null) {
            throw new Error();
        }
        this.returnType = returnType;
        this.key = key;
    }

    public getReturnType(): new () => T {
        return this.returnType;
    }

    public getKey(): string {
        return this.key;
    }

}

export class ParameterKey<T>{

    private key: string;

    public constructor(key: string) {
        this.key = key;
    }

    public getKey(): string {
        return this.key;
    }

}

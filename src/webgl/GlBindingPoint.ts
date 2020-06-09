export class GlBindingPoint {

    private readonly bindingPoint: number;
    private readonly name: string;

    public constructor(bindingPoint: number, name: string) {
        this.bindingPoint = bindingPoint;
        this.name = name;
    }

    public getBindingPoint(): number {
        return this.bindingPoint;
    }

    public getName(): string {
        return this.name;
    }

}
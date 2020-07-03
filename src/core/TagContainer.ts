export class TagContainer {

    private readonly tags = new Set<string>();

    public has(tag: string): boolean {
        return this.tags.has(tag);
    }

    public getCount(): number {
        return this.tags.size;
    }

    public getIterator(): IterableIterator<string> {
        return this.tags.values();
    }

    public add(tag: string): void {
        this.tags.add(tag);
    }

    public remove(tag: string): void {
        this.tags.delete(tag);
    }

    public clear(): void {
        this.tags.clear();
    }

}
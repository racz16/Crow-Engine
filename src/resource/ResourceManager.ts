import { IResource } from './IResource';
import { IResourceManager } from './IResourceManager';

export class ResourceManager implements IResourceManager {

    private resources = new Array<IResource>();

    public add(resource: IResource): void {
        if (!this.contains(resource)) {
            this.resources.push(resource);
        }
    }

    public contains(resource: IResource): boolean {
        return this.resources.includes(resource);
    }

    public get(index: number): IResource {
        return this.resources[index];
    }

    public getIterator(): IterableIterator<IResource> {
        return this.resources.values();
    }

    public getTypedIterator<T extends IResource>(type: new (..._) => T): IterableIterator<T> {
        return this.resources.filter(resource => resource instanceof type).values() as IterableIterator<T>;
    }

    public getCount(): number {
        return this.resources.length;
    }

    public release(): void {
        for (const resource of this.resources) {
            resource.release();
        }
    }

}
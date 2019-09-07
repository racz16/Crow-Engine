import { IResource } from './IResource';

export class ResourceManager {

    private resources = new Array<IResource>();

    public constructor() { }

    public add(resource: IResource): void {
        if (!this.contains(resource)) {
            this.resources.push(resource);
        }
    }

    public contains(resource: IResource): boolean {
        return this.resources.includes(resource);
    }

    public getAllResourcesIterator(): IterableIterator<IResource> {
        return this.resources.values();
    }

    public getResourcesIterator<T>(type: new (..._) => T): IterableIterator<T> {
        const ret = new Array<T>();
        for (const resource of this.resources) {
            if (resource instanceof type) {
                ret.push(resource);
            }
        }
        return ret.values();
    }

    public releaseResources(): void {
        for (const resource of this.resources) {
            resource.release();
        }
    }

}
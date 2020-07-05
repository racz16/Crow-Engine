import { IResource } from './IResource';

export interface IResourceManager {

    add(resource: IResource): void;

    contains(resource: IResource): boolean;

    get(index: number): IResource;

    getIterator(): IterableIterator<IResource>;

    getTypedIterator<T extends IResource>(type: new (..._) => T): IterableIterator<T>;

    getCount(): number;

    release(): void;

}